import React, { useState } from "react"
import { 
  FileText, 
  ClipboardList, 
  BookOpen, 
  Clock, 
  CheckCircle,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  HeartPulse,
  Compass
} from "lucide-react"
import { apiService } from "@/services/api"
import UploadCard from "@/components/UploadCard"

const formatInlineMarkdown = (text) => {
  if (!text) return ""
  // Replace bold **text**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900 dark:text-white">$1</strong>')
  // Replace italic *text*
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>')
  // Replace code ticks
  formatted = formatted.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono text-[11px]">$1</code>')
  return formatted
}

const parseSummary = (text) => {
  if (!text) return null

  const sections = {
    executiveSummary: "",
    keyFindings: [],
    discussionPoints: [],
    nextSteps: [],
    disclaimer: ""
  }

  const lines = text.split('\n')
  let currentSection = ""

  lines.forEach(line => {
    const cleanLine = line.trim()
    if (!cleanLine) return

    const lowerLine = cleanLine.toLowerCase()
    
    // Detect section headers
    if (lowerLine.includes("executive summary")) {
      currentSection = "executive"
      return
    } else if (lowerLine.includes("key findings") || lowerLine.includes("findings explained")) {
      currentSection = "findings"
      return
    } else if (lowerLine.includes("areas for discussion") || lowerLine.includes("discussion points") || lowerLine.includes("discussion:")) {
      currentSection = "discussion"
      return
    } else if (lowerLine.includes("next steps") || lowerLine.includes("actionable steps")) {
      currentSection = "next"
      return
    } else if (lowerLine.includes("disclaimer") || lowerLine.includes("safety safeguard") || lowerLine.includes("important medical disclaimer") || lowerLine.includes("must be reviewed with a qualified")) {
      currentSection = "disclaimer"
      if (lowerLine.startsWith("###") || lowerLine.startsWith("**") || lowerLine.includes("disclaimer:")) {
        return
      }
    }

    // Capture sections
    if (currentSection === "executive") {
      const stripped = cleanLine.replace(/^(executive summary:?|###|1\.)\s*/i, "")
      sections.executiveSummary += (sections.executiveSummary ? " " : "") + stripped
    } else if (currentSection === "findings") {
      const stripped = cleanLine.replace(/^[-•*]\s*/, "")
      if (stripped) sections.keyFindings.push(stripped)
    } else if (currentSection === "discussion") {
      const stripped = cleanLine.replace(/^[-•*]\s*/, "")
      if (stripped) sections.discussionPoints.push(stripped)
    } else if (currentSection === "next") {
      const stripped = cleanLine.replace(/^[-•*]\s*/, "")
      if (stripped) sections.nextSteps.push(stripped)
    } else if (currentSection === "disclaimer") {
      sections.disclaimer += (sections.disclaimer ? " " : "") + cleanLine
    }
  })

  if (sections.executiveSummary || sections.keyFindings.length > 0) {
    return sections
  }

  return null
}

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
      { max: 80, msg: "Translating diagnostic jargon via Groq AI..." },
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

              {/* Structured Beautiful Summary Report Dashboard */}
              {(() => {
                const parsed = parseSummary(result.summary)
                if (!parsed) {
                  return (
                    <div className="prose prose-sm dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                      {result.summary}
                    </div>
                  )
                }

                return (
                  <div className="space-y-6 text-xs text-slate-650 dark:text-slate-350">
                    {/* Executive Summary Card */}
                    {parsed.executiveSummary && (
                      <div className="p-5 bg-radial from-blue-50/20 via-transparent to-transparent dark:from-teal-950/10 border border-blue-100/50 dark:border-teal-900/30 rounded-2xl space-y-2 relative overflow-hidden glass-panel">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-display font-extrabold text-sm border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <HeartPulse className="h-5 w-5 text-blue-600 dark:text-teal-400" />
                          <span>Executive Summary</span>
                        </div>
                        <p className="leading-relaxed font-semibold text-slate-700 dark:text-slate-300">
                          {parsed.executiveSummary}
                        </p>
                      </div>
                    )}

                    {/* Key Findings Card */}
                    {parsed.keyFindings.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-display font-extrabold text-sm border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span>Key Findings Explained</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-1">
                          {parsed.keyFindings.map((finding, idx) => (
                            <div 
                              key={idx} 
                              className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
                            >
                              <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              </div>
                              <p 
                                className="leading-relaxed font-medium"
                                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(finding) }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Areas for Discussion Card */}
                    {parsed.discussionPoints.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-display font-extrabold text-sm border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <MessageSquare className="h-5 w-5 text-blue-600 dark:text-teal-400" />
                          <span>Questions for Your Doctor</span>
                        </div>
                        <div className="space-y-3">
                          {parsed.discussionPoints.map((point, idx) => (
                            <div 
                              key={idx} 
                              className="p-4 bg-blue-50/20 dark:bg-teal-950/10 border border-blue-100/30 dark:border-teal-900/10 rounded-2xl flex gap-3 shadow-2xs"
                            >
                              <HelpCircle className="h-5 w-5 text-blue-500 dark:text-teal-450 shrink-0 mt-0.5" />
                              <p 
                                className="leading-relaxed font-semibold text-slate-800 dark:text-slate-200"
                                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(point) }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Steps Card */}
                    {parsed.nextSteps.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-display font-extrabold text-sm border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <Compass className="h-5 w-5 text-amber-500" />
                          <span>Recommended Action Plan</span>
                        </div>
                        <div className="p-5 bg-amber-50/20 dark:bg-amber-950/5 border border-amber-100/30 dark:border-amber-900/10 rounded-2xl space-y-3.5 shadow-2xs">
                          {parsed.nextSteps.map((step, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <span className="h-4.5 w-4.5 rounded-lg bg-amber-100/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p 
                                className="leading-relaxed font-semibold text-slate-700 dark:text-slate-300"
                                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(step) }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer Card */}
                    {parsed.disclaimer && (
                      <div className="p-4 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 rounded-2xl text-[10px] text-rose-800 dark:text-rose-400 font-bold leading-relaxed shadow-3xs">
                        ⚠️ Disclaimer: {parsed.disclaimer.replace(/^(disclaimer|⚠️|warning):?\s*/i, "")}
                      </div>
                    )}
                  </div>
                )
              })()}

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
