import React, { useState, useEffect } from "react"
import { Clock, Trash2, Calendar, FileText, MessageSquare, AlertTriangle, Eye, X, BookOpen } from "lucide-react"

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  // Load from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("mediguide_history") || "[]")
    setHistoryItems(items)
  }, [])

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire consultation history? This cannot be undone.")) {
      localStorage.removeItem("mediguide_history")
      setHistoryItems([])
      setSelectedItem(null)
    }
  }

  const handleDeleteItem = (id, e) => {
    e.stopPropagation()
    const updated = historyItems.filter(item => item.id !== id)
    localStorage.setItem("mediguide_history", JSON.stringify(updated))
    setHistoryItems(updated)
    if (selectedItem?.id === id) {
      setSelectedItem(null)
    }
  }

  const getTypeColor = (type) => {
    switch(type) {
      case "Chat Session": return "bg-blue-50 dark:bg-blue-955 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
      case "Report Analysis": return "bg-teal-50 dark:bg-teal-955 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30"
      case "Emergency Screen": return "bg-rose-50 dark:bg-rose-955 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30"
      default: return "bg-slate-50 dark:bg-slate-900 text-slate-550 border border-slate-100"
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case "Chat Session": return <MessageSquare className="h-4.5 w-4.5" />
      case "Report Analysis": return <FileText className="h-4.5 w-4.5" />
      case "Emergency Screen": return <AlertTriangle className="h-4.5 w-4.5" />
      default: return <Clock className="h-4.5 w-4.5" />
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="h-7 w-7 text-blue-600 dark:text-teal-400" />
            Consultation History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Review cache logs of symptom dialogues, uploaded medical documents, and emergency screenings.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100/50 hover:shadow-xs transition-all self-start sm:self-center"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Grid: Session list + Detail viewer side pane */}
      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* List side */}
        <div className="lg:col-span-3 space-y-3">
          {historyItems.length === 0 ? (
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-10 bg-white/40 dark:bg-slate-900/10 min-h-[300px]">
              <Calendar className="h-12 w-12 text-slate-350 dark:text-slate-700 mb-3 animate-pulse-slow" />
              <h3 className="font-display font-bold text-slate-750 dark:text-slate-400 text-sm mb-1">
                No past consultations recorded
              </h3>
              <p className="text-xs text-slate-450 max-w-[300px] text-center leading-normal">
                Your completed chat guides and report summaries will be cached here.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 bg-white dark:bg-slate-900 border rounded-2xl cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex justify-between gap-4 ${
                  selectedItem?.id === item.id 
                    ? "border-blue-500 dark:border-teal-500 shadow-sm" 
                    : "border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <div className="space-y-2.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                      <span>{item.type}</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {item.date} at {item.time}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-250 truncate">
                    {item.snippet}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    title="Delete Record"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                  <Eye className="h-4.5 w-4.5 text-slate-350 dark:text-slate-650" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Details side */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden p-6 space-y-5 animate-in fade-in slide-in-from-right-2 duration-250 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${getTypeColor(selectedItem.type)}`}>
                    {selectedItem.type}
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-400">{selectedItem.date}</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Chat Log details */}
              {selectedItem.type === "Chat Session" && (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {selectedItem.messages?.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl text-xs leading-normal ${
                        msg.role === "user" 
                          ? "bg-blue-600 text-white ml-auto max-w-[85%]" 
                          : "bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 text-slate-750 dark:text-slate-300 mr-auto max-w-[85%]"
                      }`}
                    >
                      <p className="font-bold text-[9px] uppercase tracking-wider mb-1 opacity-70">
                        {msg.role === "user" ? "Patient" : "MediGuide AI"}
                      </p>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Report translation log details */}
              {selectedItem.type === "Report Analysis" && (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 rounded-xl text-xs text-slate-700 dark:text-slate-350">
                    <span className="font-bold block mb-1 text-[10px] text-slate-455">File Name:</span>
                    <span>{selectedItem.filename}</span>
                  </div>
                  <div className="prose prose-xs text-xs text-slate-700 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                    {selectedItem.summary}
                  </div>
                </div>
              )}

              {/* Triage assessment logs */}
              {selectedItem.type === "Emergency Screen" && (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold block text-[10px] text-slate-450 uppercase mb-1">Symptoms Screened:</span>
                    <span className="font-medium">"{selectedItem.symptoms}"</span>
                  </div>

                  <div className={`p-4 border rounded-xl space-y-2.5 ${
                    selectedItem.triage?.triage_level === "CRITICAL"
                      ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-455"
                      : selectedItem.triage?.triage_level === "URGENT"
                      ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-850 dark:text-amber-400"
                      : "bg-teal-50/50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/30 text-teal-800 dark:text-teal-400"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase">Triage Level</span>
                      <span className="text-[10.5px] font-extrabold">{selectedItem.triage?.triage_level}</span>
                    </div>
                    <p className="text-[11.5px] leading-normal font-semibold">
                      <strong>AI Explanation:</strong> {selectedItem.triage?.reasoning}
                    </p>
                    <p className="text-[12px] leading-normal font-bold">
                      <strong>Action:</strong> {selectedItem.triage?.recommended_action}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-50/40 dark:bg-slate-900/5 min-h-[200px]">
              <BookOpen className="h-8 w-8 text-slate-350 dark:text-slate-705 mb-2.5" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center leading-normal">
                Select a record from the list to display details here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
