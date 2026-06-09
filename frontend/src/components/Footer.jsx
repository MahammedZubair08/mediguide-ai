import React from "react"
import { Link } from "react-router-dom"
import { Activity, ShieldCheck } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16 space-y-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Slogan */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 text-xl font-extrabold text-blue-600 dark:text-teal-400 font-display">
              <Activity className="h-6 w-6 text-blue-600 dark:text-teal-400" />
              <span>MediGuide AI</span>
            </div>
            <p className="text-xs max-w-sm leading-relaxed text-slate-500">
              An AI-powered clinical assistant designed to check symptoms, summarize lab printouts, identify emergencies, and offer clinical guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/chat" className="hover:text-blue-600 dark:hover:text-teal-400">Symptom Checker</Link></li>
              <li><Link to="/upload" className="hover:text-blue-600 dark:hover:text-teal-400">Report Summarizer</Link></li>
              <li><Link to="/emergency" className="hover:text-rose-600 dark:hover:text-rose-400 font-semibold">Emergency Portal</Link></li>
            </ul>
          </div>

          {/* Core Settings / Extras */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">Account</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/history" className="hover:text-blue-600 dark:hover:text-teal-400">Consultation History</Link></li>
              <li><Link to="/settings" className="hover:text-blue-600 dark:hover:text-teal-400">Settings</Link></li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Block */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex gap-3 text-xs leading-relaxed text-amber-850 dark:text-amber-400">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <span className="font-bold block">Important Medical Disclaimer</span>
            MediGuide AI is an AI-powered advisory system designed for educational purposes only. It is not a clinical diagnostic system and does not replace professional physical diagnostic screenings, therapy, or emergency advice. If you suspect a serious or acute condition, immediately consult a physician or call 911/your local emergency service.
          </div>
        </div>

        {/* Copyright info */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-[11px] flex flex-col sm:flex-row justify-between gap-4 text-slate-400">
          <span>&copy; {new Date().getFullYear()} MediGuide AI. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
