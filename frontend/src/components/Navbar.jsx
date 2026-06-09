import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Activity, Menu, X, ArrowRight } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold text-blue-600 dark:text-teal-400">
          <Activity className="h-6 w-6 text-blue-600 dark:text-teal-400 animate-pulse-slow" />
          <span>MediGuide AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-blue-600 dark:hover:text-teal-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-teal-400 transition-colors">How It Works</a>
          <a href="#standards" className="hover:text-blue-600 dark:hover:text-teal-400 transition-colors">Clinical Standards</a>
          <Link to="/emergency" className="text-rose-600 dark:text-rose-455 hover:underline transition-colors font-bold">Emergency Portal</Link>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/chat"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all hover:scale-102 hover:shadow-lg active:scale-98"
          >
            <span>Start Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white md:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-teal-400">Features</a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-teal-400">How It Works</a>
            <a href="#standards" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-teal-400">Clinical Standards</a>
            <Link to="/emergency" onClick={() => setIsOpen(false)} className="text-rose-600 dark:text-rose-400 font-bold">Emergency Portal</Link>
          </nav>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/chat"
              onClick={() => setIsOpen(false)}
              className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all"
            >
              <span>Start Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
