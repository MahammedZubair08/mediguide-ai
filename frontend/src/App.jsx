import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashboardLayout from "@/layouts/DashboardLayout"
import LandingPage from "@/pages/LandingPage"
import ChatDashboard from "@/pages/ChatDashboard"
import ReportUpload from "@/pages/ReportUpload"
import EmergencyPage from "@/pages/EmergencyPage"
import HistoryPage from "@/pages/HistoryPage"
import SettingsPage from "@/pages/SettingsPage"

export default function App() {
  // Synchronize visual themes on application load
  useEffect(() => {
    const savedTheme = localStorage.getItem("mediguide_theme") || "light"
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return (
    <Router>
      <Routes>
        {/* Standalone Landing Page (Unwrapped) */}
        <Route path="/" element={<LandingPage />} />

        {/* Application Pages (Wrapped in DashboardLayout) */}
        <Route 
          path="/chat" 
          element={
            <DashboardLayout>
              <ChatDashboard />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <DashboardLayout>
              <ReportUpload />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/emergency" 
          element={
            <DashboardLayout>
              <EmergencyPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/history" 
          element={
            <DashboardLayout>
              <HistoryPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          } 
        />
      </Routes>
    </Router>
  )
}
