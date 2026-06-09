import React, { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [patientName, setPatientName] = useState("Patient Account")

  // Load client parameters and set theme on load
  useEffect(() => {
    // Sync profile name
    const profile = JSON.parse(localStorage.getItem("mediguide_profile") || "{}")
    if (profile.name) {
      setPatientName(profile.name)
    }

    // Sync theme settings
    const savedTheme = localStorage.getItem("mediguide_theme") || "light"
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Dynamic profile avatar initials
  const getInitials = (name) => {
    if (!name) return "PA"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Screen */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-650 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 md:hidden"
            title="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-3 ml-auto select-none">
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-teal-950 border border-blue-100 dark:border-teal-900/30 flex items-center justify-center font-display text-sm font-extrabold text-blue-600 dark:text-teal-400">
              {getInitials(patientName)}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-350">
              {patientName}
            </span>
          </div>
        </header>

        {/* Global Safety banner */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30 px-6 py-2 select-none">
          <p className="text-[10px] md:text-xs text-amber-700 dark:text-amber-400 text-center font-bold">
            ⚠️ Disclaimer: AI guidance is for educational reference. If experiencing severe symptoms, consult a doctor or call emergency lines.
          </p>
        </div>

        {/* Dynamic children pages viewports */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-35 bg-slate-950/40 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}
    </div>
  )
}
