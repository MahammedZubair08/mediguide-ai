import React, { useState, useEffect } from "react"
import { Settings, Save, ShieldAlert, User, Globe, AlertCircle, Sparkles } from "lucide-react"

export default function SettingsPage() {
  // Profile settings state
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    sex: "Male",
    primaryLanguage: "English"
  })

  // System options state
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api")
  const [theme, setTheme] = useState("light")
  const [saveBanner, setSaveBanner] = useState(false)

  // Load current preferences
  useEffect(() => {
    // Profile
    const savedProfile = JSON.parse(localStorage.getItem("mediguide_profile") || "{}")
    setProfile(prev => ({
      ...prev,
      ...savedProfile
    }))

    // API URL
    const savedUrl = localStorage.getItem("mediguide_api_url")
    if (savedUrl) setApiUrl(savedUrl)

    // Theme state checking
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  // Sync theme changes from other components (e.g. global toggle)
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "dark" : "light")
    }
    window.addEventListener("themechange", handleThemeChange)
    return () => window.removeEventListener("themechange", handleThemeChange)
  }, [])

  const handleSave = (e) => {
    e.preventDefault()

    // Save profile demographics
    localStorage.setItem("mediguide_profile", JSON.stringify(profile))

    // Save api configuration
    localStorage.setItem("mediguide_api_url", apiUrl)

    // Save/Update dark mode configuration
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      localStorage.setItem("mediguide_theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("mediguide_theme", "light")
    }

    setSaveBanner(true)
    setTimeout(() => {
      setSaveBanner(false)
    }, 2500)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-blue-600 dark:text-teal-400" />
          System Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          Customize demographic context for clinical chatbot explanations, configure backend API ports, and toggle visual modes.
        </p>
      </div>

      {saveBanner && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs font-extrabold animate-in fade-in slide-in-from-top-1 duration-200">
          ✓ Preferences saved successfully! Update initialized across current session.
        </div>
      )}

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="h-5 w-5 text-blue-600 dark:text-teal-400" />
              <h3 className="font-display font-extrabold text-sm">Patient Profile Context</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 dark:text-slate-400">Age (Years)</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="e.g. 32"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 dark:text-slate-400">Biological Sex</label>
                <select
                  value={profile.sex}
                  onChange={(e) => setProfile({ ...profile, sex: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-teal-500 font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Decline to state</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 dark:text-slate-400">Primary Language</label>
                <input
                  type="text"
                  value={profile.primaryLanguage}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl opacity-60 cursor-not-allowed"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-slate-450 leading-normal pt-1.5">
              *Note: Demographics help the AI chatbot optimize responses (e.g., pediatric or adult guidance adjustments). Information is stored exclusively on your local client web browser storage.
            </p>
          </div>

          {/* API endpoints configuration card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Globe className="h-5 w-5 text-blue-600 dark:text-teal-400" />
              <h3 className="font-display font-extrabold text-sm">Server & Network Routing</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 dark:text-slate-400">FastAPI Server URL</label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="e.g. http://localhost:8000/api"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-teal-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Settings column */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-teal-400" />
              <h3 className="font-display font-extrabold text-sm">Theme Settings</h3>
            </div>

            <div className="flex items-center justify-between text-xs pt-1.5">
              <span className="font-bold text-slate-650 dark:text-slate-405">Visual Mode Theme</span>
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-150 dark:border-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setTheme("light")
                    document.documentElement.classList.remove("dark")
                    window.dispatchEvent(new Event("themechange"))
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10.5px] transition-all ${
                    theme === "light" 
                      ? "bg-white text-slate-900 shadow-xs" 
                      : "text-slate-450 hover:text-slate-200"
                  }`}
                >
                  Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme("dark")
                    document.documentElement.classList.add("dark")
                    window.dispatchEvent(new Event("themechange"))
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10.5px] transition-all ${
                    theme === "dark" 
                      ? "bg-slate-900 text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Dark Mode
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <button
            type="submit"
            className="w-full h-11 items-center justify-center flex gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-sm shadow-md hover:scale-101 active:scale-99 transition-all"
          >
            <Save className="h-4.5 w-4.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  )
}
