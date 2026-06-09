import React, { useState } from "react"
import { FileText, ClipboardList, BookOpen, Clock, CheckCircle } from "lucide-react"
import { apiService } from "@/services/api"
import UploadCard from "@/components/UploadCard"

export default function ReportUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleFileSelect = (selectedFile) => {
    setError(null)
    const ext = selectedFile.name.split(".").pop().toLowerCase()
    if (ext !== "pdf" && ext !== "txt" && ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
      setError("Only PDF, TXT, and image (PNG, JPG) formats are supported.")
      return
    }
    setFile(selectedFile)
  }

  const handleFileClear = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  // Save parsed outcome to localStorage history log
  const saveReportToHistory = (filename, summary, snippet) => {
    try {
      const history = JSON.parse(localStorage.getItem("mediguide_history") || "[]")
      const sessionRecord = {
        id: "report_" + Date.now(),
        type: "Report Analysis",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        snippet: `Analyzed report "${filename}": ` + summary.substring(0, 60) + "...",
        filename,
        summary,
        extractedText: snippet
      }
      history.unshift(sessionRecord)
      localStorage.setItem("mediguide_history", JSON.stringify(history))
    } catch (err) {
      console.error("Could not write report to local history:", err)
    }
  }

  const handleStartAnalysis = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)
    setProgress(0)

    // Simulate progress intervals for that smooth visual feedback
    const intervals = [
      { max: 20, msg: "Uploading file block structures..." },
      { max: 50, msg: "Extracting clinical lab measurements..." },
      { max: 80, msg: "Translating diagnostic jargon via Gemini AI..." },
      { max: 95, msg: "Refining summary suggestions..." }
    ]

    let currentStepIdx = 0
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const step = intervals[currentStepIdx]
        if (!step) return prev
        
        if (prev < step.max) {
          setProgressMessage(step.msg)
          return prev + Math.floor(Math.random() * 4) + 1
        } else {
          currentStepIdx++
          return prev
        }
      })
    }, 150)

    try {
      const data = await apiService.uploadReport(file)
      
      clearInterval(progressTimer)
      setProgress(100)
      setProgressMessage("Translation Finished!")
      
      setTimeout(() => {
        setResult(data)
        setLoading(false)
        saveReportToHistory(data.filename, data.summary, data.extracted_text_snippet)
      }, 500)
    } catch (err) {
      clearInterval(progressTimer)
      
      // Fallback Demo mock analysis in case the API backend is offline
      setTimeout(() => {
        setProgress(100)
        setProgressMessage("Finished using Fallback advisory...")
        
        const demoSummary = `### [DEMO SUMMARY] Medical Report Analysis (Offline Mode)

**Executive Summary:**
The report shows a typical lipid panel layout. Vital indicators are healthy with a borderline elevated cholesterol metric.

**Key Findings Explained:**
- **Total Cholesterol:** 210 mg/dL (*Borderline High*). Suggests monitoring dietary intake of saturated fats.
- **HDL Cholesterol:** 52 mg/dL (*Optimal*). Excellent high-density lipoprotein levels supporting cardiac safety.
- **LDL Cholesterol:** 128 mg/dL (*Near Optimal*). Keep monitoring.

**Actionable Steps:**
- Incorporate more soluble fiber into your weekly meals.
- Discuss whether a lipid panel check is helpful during your next annual physical.`

        const demoResult = {
          filename: file.name,
          content_type: file.type || "application/octet-stream",
          extracted_text_snippet: "Cholesterol: 210 mg/dL, HDL: 52 mg/dL, LDL: 128 mg/dL...",
          summary: demoSummary
        }

        setResult(demoResult)
        setLoading(false)
        saveReportToHistory(demoResult.filename, demoResult.summary, demoResult.extracted_text_snippet)
      }, 1000)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-7 w-7 text-blue-600 dark:text-teal-400" />
          Medical Report Summarizer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          Upload diagnostic records, image panels, or lab reports (PDF/TXT/Images) to view simplified translations of clinical statistics.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Drop Panel */}
        <div className="lg:col-span-1 space-y-4">
          <UploadCard 
            onFileSelect={handleFileSelect}
            selectedFile={file}
            onFileClear={handleFileClear}
            loading={loading}
            progress={progress}
            progressMessage={progressMessage}
            error={error}
          />

          {file && !loading && !result && (
            <button
              onClick={handleStartAnalysis}
              className="w-full h-11 items-center justify-center flex rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-sm shadow-md hover:scale-101 active:scale-99 transition-all animate-in fade-in duration-200"
            >
              Analyze Medical Document
            </button>
          )}

          {/* Guide Card */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-350 font-display flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-blue-600 dark:text-teal-405" />
              Guidelines for Uploading
            </h4>
            <div className="space-y-1.5 text-[10.5px] text-slate-500 leading-normal">
              <p>• Upload PDF/TXT reports, or image sheets (CBC, lipids panel, etc.).</p>
              <p>• Make sure reports are clear and contain text characters.</p>
              <p>• Keep records secure. Do not share extremely private ID keys.</p>
            </div>
          </div>
        </div>

        {/* Translation Results Display */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-teal-950 flex items-center justify-center">
                  <ClipboardList className="h-5.5 w-5.5 text-blue-600 dark:text-teal-450" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-800 dark:text-white">
                    Simplified Patient Interpretation
                  </h3>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold block mt-0.5">
                    Source Document: {result.filename}
                  </span>
                </div>
              </div>

              {/* Summary text parser */}
              <div className="prose prose-sm dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                {result.summary}
              </div>

              {/* Text Extract Container */}
              {result.extracted_text_snippet && (
                <div className="pt-4 border-t border-slate-150 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                    Raw Document Snippet Extracted
                  </span>
                  <pre className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-[10.5px] text-slate-500 overflow-y-auto max-h-[100px] whitespace-pre-wrap leading-normal border border-slate-150 dark:border-slate-900">
                    {result.extracted_text_snippet}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 bg-white/30 dark:bg-slate-900/10">
              <BookOpen className="h-12 w-12 text-slate-350 dark:text-slate-700 mb-3 animate-pulse-slow" />
              <h3 className="font-display font-bold text-slate-750 dark:text-slate-400 text-sm mb-1.5">
                No active document reports analyzed
              </h3>
              <p className="text-xs text-slate-450 max-w-[280px] text-center leading-normal">
                Upload a blood panel report or imaging write-up on the left sidebar to translate complex variables.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
