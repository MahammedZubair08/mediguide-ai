import React, { useState } from "react"
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2 } from "lucide-react"
import { cn } from "@/utils/utils"

export default function UploadCard({ 
  onFileSelect, 
  selectedFile, 
  onFileClear, 
  loading, 
  progress, 
  progressMessage,
  error 
}) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-all">
      {/* File Drop Area */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-200 min-h-[200px]",
            dragActive 
              ? "border-blue-500 bg-blue-50/15 dark:border-teal-500 dark:bg-teal-950/10" 
              : "border-slate-250 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-500 bg-slate-50/50 dark:bg-slate-950/40"
          )}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.txt,.png,.jpg,.jpeg"
            id="file-upload"
            className="hidden"
            disabled={loading}
          />

          <UploadCloud className="h-10 w-10 text-slate-400 dark:text-slate-550 mb-3 animate-pulse-slow" />
          
          <label 
            htmlFor="file-upload" 
            className="text-xs font-extrabold text-blue-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Select a medical document
          </label>
          <span className="text-[11px] text-slate-400 mt-1 font-medium">or drag & drop here</span>
          <span className="text-[9px] text-slate-455 dark:text-slate-550 mt-3 font-semibold">PDF, TXT or Image documents (Max 10MB)</span>
        </div>
      ) : (
        /* Selected File Card */
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 dark:bg-teal-950/40 border border-blue-100 dark:border-teal-900/30 flex items-center justify-center">
              <FileText className="h-5.5 w-5.5 text-blue-600 dark:text-teal-450" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
                {formatSize(selectedFile.size)}
              </p>
            </div>
          </div>

          <button
            onClick={onFileClear}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-lg transition-colors shrink-0 disabled:opacity-50"
            title="Remove File"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* Progress display */}
      {loading && (
        <div className="space-y-2 pt-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-blue-600 dark:text-teal-400 animate-pulse">{progressMessage || "Processing File..."}</span>
            <span className="text-slate-500">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 dark:bg-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 rounded-xl flex items-center gap-2.5 text-xs font-medium">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
