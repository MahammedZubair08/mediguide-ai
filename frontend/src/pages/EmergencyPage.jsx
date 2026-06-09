import React, { useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, PhoneCall, HeartHandshake, ShieldAlert, Search, MessageSquare } from "lucide-react"
import { apiService } from "@/services/api"
import AlertCard from "@/components/AlertCard"

export default function EmergencyPage() {
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleTriage = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await apiService.triage(symptoms)
      setResult(data)
      saveTriageToHistory(symptoms, data)
    } catch (err) {
      // Offline fallback rules-based emergency triage simulation
      const text = symptoms.toLowerCase()
      let mockResult = {
        triage_level: "NON_URGENT",
        reasoning: "Standard mild symptom description. System is currently running in offline advisory mode.",
        recommended_action: "Monitor symptoms at home, rest, keep hydrated, and check with a physician if signs persist."
      }

      if (text.includes("chest pain") || text.includes("breath") || text.includes("stroke") || text.includes("bleed")) {
        mockResult = {
          triage_level: "CRITICAL",
          reasoning: "Chest pain or breathing difficulties can indicate severe cardiac/pulmonary stress. Offline triage flagged high risk.",
          recommended_action: "Bypass AI immediately. Call 911 or visit the nearest emergency room."
        }
      } else if (text.includes("fever") || text.includes("migraine") || text.includes("severe pain")) {
        mockResult = {
          triage_level: "URGENT",
          reasoning: "Fever or severe localized pains suggest potential acute infection. Offline triage recommended rapid check.",
          recommended_action: "Contact primary care clinic or visit an Urgent Care center today."
        }
      }

      setResult(mockResult)
      saveTriageToHistory(symptoms, mockResult)
    } finally {
      setLoading(false)
    }
  }

  const saveTriageToHistory = (symptomText, triageData) => {
    try {
      const history = JSON.parse(localStorage.getItem("mediguide_history") || "[]")
      const sessionRecord = {
        id: "triage_" + Date.now(),
        type: "Emergency Screen",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        snippet: `Screened symptoms: "${symptomText.substring(0, 40)}..." -> Level: ${triageData.triage_level}`,
        symptoms: symptomText,
        triage: triageData
      }
      history.unshift(sessionRecord)
      localStorage.setItem("mediguide_history", JSON.stringify(history))
    } catch (err) {
      console.error("Could not write triage to history:", err)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-rose-600 dark:bg-rose-950/40 text-white border border-rose-500/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8">
          <AlertTriangle className="h-48 w-48" />
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-md animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 text-center md:text-left relative z-10 flex-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            CRITICAL EMERGENCY PORTAL
          </h1>
          <p className="text-xs text-rose-100 max-w-xl leading-relaxed font-semibold">
            If you are experiencing chest pressures, respiratory crisis, severe bleeding, or neurological loss, stop using this application and call emergency lines instantly.
          </p>
        </div>
        <Link
          to="/chat"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white hover:bg-rose-50 px-5 text-xs font-extrabold text-rose-650 transition-all shrink-0 shadow-md relative z-10"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Go to Chat instead</span>
        </Link>
      </div>

      {/* Main Grid content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Triage Evaluator */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <h3 className="font-display font-extrabold text-slate-800 dark:text-white text-base">
              Rapid Symptoms Severity Screener
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Type the acute signs you are experiencing. The screening tool will analyze risk markers to categorize urgency levels.
            </p>

            <form onSubmit={handleTriage} className="flex gap-2">
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Briefly state symptoms (e.g. pressure in left chest, high fever)..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="inline-flex h-11 px-5 items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-md"
              >
                <Search className="h-4 w-4" />
                <span>Screen Signs</span>
              </button>
            </form>

            {/* Screener Output */}
            {result && (
              <div className="pt-2 animate-in fade-in zoom-in-95 duration-200">
                <AlertCard
                  title={`Result: Suspected ${result.triage_level} Urgency`}
                  triageLevel={result.triage_level}
                  reasoning={result.reasoning}
                  recommendedAction={result.recommended_action}
                />
              </div>
            )}
          </div>

          {/* Reference Cards */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-slate-800 dark:text-slate-200">
              Severity Level Guides
            </h3>
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              {/* Critical Card */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/30 bg-rose-50/20 dark:bg-rose-950/10 space-y-2">
                <span className="font-black text-rose-600 block">CRITICAL</span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Immediate emergency room care. Life-threatening signs.
                </p>
                <ul className="text-[9.5px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Sudden numbness / speech loss</li>
                  <li>Crushing chest discomfort</li>
                  <li>Inability to breathe</li>
                </ul>
              </div>

              {/* Urgent Card */}
              <div className="p-4 rounded-xl border border-amber-250 dark:border-amber-950/30 bg-amber-50/20 dark:bg-amber-950/10 space-y-2">
                <span className="font-black text-amber-600 block">URGENT</span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Visit doctor or Urgent Care within 24-48 hours.
                </p>
                <ul className="text-[9.5px] text-slate-650 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Fever above 103°F (39°4C)</li>
                  <li>Severe migraine headache</li>
                  <li>Deep laceration cut</li>
                </ul>
              </div>

              {/* Non-Urgent Card */}
              <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-950/30 bg-teal-50/20 dark:bg-teal-950/10 space-y-2">
                <span className="font-black text-teal-605 block">NON-URGENT</span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Safe for home care, monitoring, or standard visits.
                </p>
                <ul className="text-[9.5px] text-slate-650 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Mild dry cough & sniffles</li>
                  <li>Minor muscle strains</li>
                  <li>Light skin scrapes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contacts card */}
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <h4 className="font-display font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
              <PhoneCall className="h-4.5 w-4.5 text-rose-500" />
              Direct Emergency Lines
            </h4>

            <div className="space-y-3.5">
              <div className="p-3 rounded-xl border border-rose-100 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/25">
                <span className="text-[9.5px] font-bold text-rose-600 block uppercase tracking-wider">General Emergencies</span>
                <span className="text-xl font-black text-rose-800 dark:text-rose-400">911</span>
                <span className="text-[9px] text-slate-400 block mt-1">Available 24/7 in US and Canada</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50/60 dark:bg-slate-950/40">
                <span className="text-[9.5px] font-bold text-teal-600 block uppercase tracking-wider">Poison Control Assistance</span>
                <span className="text-base font-black text-slate-850 dark:text-slate-300">1 (800) 222-1222</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50/60 dark:bg-slate-950/40 flex gap-2">
                <HeartHandshake className="h-5 w-5 text-slate-405 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  If experiencing extreme mental distress or thoughts of self-harm, please dial the Suicide & Crisis Lifeline at <strong>988</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
