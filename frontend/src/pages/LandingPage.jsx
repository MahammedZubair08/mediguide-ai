import React from "react"
import { Link } from "react-router-dom"
import { 
  Stethoscope, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Clock, 
  Sparkles 
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function LandingPage() {
  const features = [
    {
      title: "Symptom Assessment",
      description: "Describe symptoms in plain text to get evidence-based clinical possibilities, questions for your doctor, and self-care advisory.",
      icon: Stethoscope,
      color: "bg-blue-500/10 text-blue-600 dark:text-teal-400 dark:bg-teal-950/20",
      badge: "Gemini Pro Powered"
    },
    {
      title: "Report Interpretation",
      description: "Upload laboratory printouts or clinical reports (PDF/TXT) to break down complex medical jargon into easy-to-read terms.",
      icon: FileText,
      color: "bg-teal-500/10 text-teal-600 dark:bg-teal-950/20",
      badge: "PDF Analysis"
    },
    {
      title: "Emergency Triage Routing",
      description: "Identify high-risk emergency markers (e.g. crushing chest pain, numbness) and receive immediate critical guidance.",
      icon: AlertTriangle,
      color: "bg-rose-500/10 text-rose-600 dark:bg-rose-950/20",
      badge: "Clinical Safety Safeguards"
    }
  ]

  const steps = [
    {
      num: "01",
      title: "Select an Advisory Tool",
      description: "Start a chat consultation, upload a laboratory file, or screen for acute emergency markers."
    },
    {
      num: "02",
      title: "Describe or Upload",
      description: "Briefly explain symptoms, or drag & drop files to parse them through the Gemini AI services."
    },
    {
      num: "03",
      title: "Review Guided Plan",
      description: "Analyze clinical suggestions, medical explanations, and recommended actions safely."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-radial from-blue-50/50 via-transparent to-transparent dark:from-teal-950/10 flex-1">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Col */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 dark:bg-teal-950/30 text-xs font-bold text-blue-700 dark:text-teal-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Clinical Guidance</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
                AI-Powered <br className="hidden sm:inline" />
                <span className="bg-linear-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-400">
                  Preliminary Healthcare
                </span> <br />
                Assistant
              </h1>

              <p className="text-base sm:text-lg text-slate-650 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                MediGuide AI translates medical jargon, evaluates everyday symptoms, and checks for critical warning indicators to keep you safe and informed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/chat"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all hover:scale-102 hover:shadow-xl active:scale-98"
                >
                  <span>Start Consultation</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-850 px-6 text-sm font-semibold text-slate-700 dark:text-slate-350 transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Col: Interactive Mockup Card */}
            <div className="lg:col-span-5 relative flex justify-center animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Decorative Blur Backing */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-blue-400/20 dark:bg-teal-500/10 blur-3xl -z-10" />

              <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-xl space-y-6 relative overflow-hidden glass-panel">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-teal-950 flex items-center justify-center shadow-xs">
                    <Activity className="h-5.5 w-5.5 text-blue-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-slate-800 dark:text-white text-sm">
                      MediGuide Assistant
                    </h3>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Clinic Advisory
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl rounded-tl-xs border border-slate-100 dark:border-slate-850 text-xs text-slate-650 dark:text-slate-400 leading-normal">
                    Hello! I'm evaluating symptom severity. What is your chief symptom today?
                  </div>
                  <div className="p-3 bg-blue-600 text-white rounded-2xl rounded-tr-xs ml-auto max-w-[85%] text-xs leading-normal font-medium shadow-xs">
                    I have had a mild fever and cough for two days.
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl rounded-tl-xs border border-slate-100 dark:border-slate-850 text-xs text-slate-650 dark:text-slate-400 space-y-1.5 leading-normal">
                    <p className="font-bold text-slate-800 dark:text-white">💡 Primary Educational Guidance:</p>
                    <p>• Stay hydrated and monitor body temperature.</p>
                    <p>• Seek clinical evaluation if fever exceeds 103°F.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/chat"
                    className="w-full text-center h-10 items-center justify-center flex rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Try Chat Simulator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-850">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Clinical Quality AI Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              MediGuide AI implements specific healthcare tools trained for safe patient triage screening and advisory context.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="flex flex-col p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:shadow-lg dark:hover:border-slate-700 transition-all group duration-300"
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-5 ${feature.color}`}>
                    <Icon className="h-5.5 w-5.5 transition-transform group-hover:scale-110" />
                  </div>
                  
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>

                  <span className="text-[9.5px] mt-4 uppercase tracking-wider font-extrabold text-blue-600 dark:text-teal-400">
                    {feature.badge}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How MediGuide Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Access clean healthcare advisory results in three simple workflow steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl space-y-4"
              >
                <span className="font-display text-4xl font-extrabold text-slate-200 dark:text-slate-800 block">
                  {step.num}
                </span>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Section */}
      <section id="standards" className="py-16 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-850">
        <div className="mx-auto max-w-5xl px-6 md:px-8 grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-teal-400" />
              Safety Safeguard Integration
            </h3>
            <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
              MediGuide AI is built using safe Clinical Prompts. The system will never prescribe specific drugs or bypass emergency medical protocols.
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                <Clock className="h-4 w-4 text-blue-600 dark:text-teal-400" />
                <span>Instant High-Risk Triage Detection</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-teal-400" />
                <span>No Medication Prescribing Protocols</span>
              </div>
            </div>
          </div>
          
          {/* Quick numbers */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider font-display flex items-center gap-1.5">
              <AlertTriangle className="h-4.5 w-4.5" />
              Emergency Information
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you require urgent support or suspect a major clinical event (heart attack, stroke, blood loss), please call emergency lines:
            </p>
            <div className="flex items-center justify-between p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-400">General Emergencies</span>
              <span className="text-lg font-black text-rose-600 dark:text-rose-455">911</span>
            </div>
            <Link 
              to="/emergency" 
              className="w-full text-center text-xs font-extrabold text-blue-600 dark:text-teal-400 block hover:underline"
            >
              Access Complete Emergency Portal &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
