"use client"

import { useState, useRef } from "react"
import { FileUploader } from "./file-uploader"
import { DataTable } from "./data-table"
import { DashboardHeader } from "./dashboard-header"
import { KpiCards } from "./kpi-cards"
import { BarChartSection } from "./charts/bar-chart-section"
import { PieChartSection } from "./charts/pie-chart-section"
import { ScatterChartSection } from "./charts/scatter-chart-section"
import { HorizontalBarSection } from "./charts/horizontal-bar-section"
import { TopChannelsTable } from "./charts/top-channels-table"
import { LineChartSection } from "./charts/line-chart-section"
import { InsightsPanel } from "./insights-panel"
import { AiChatbot } from "./ai-chatbot"
import html2canvas from 'html2canvas-pro';
import { Download, Upload, Sun, Moon, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ParsedData {
  headers: string[]
  rows: Record<string, string | number>[]
  numericColumns: string[]
  categoricalColumns: string[]
}

export function Dashboard() {
  const [data, setData] = useState<ParsedData | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [lightMode, setLightMode] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // 1. We use this Ref to target the capture area
  const dashboardRef = useRef<HTMLDivElement>(null)

  // 2. FIXED EXPORT FUNCTION
  const handleExport4K = async () => {
    if (!dashboardRef.current) return

    setIsExporting(true)

    // A. Save the user's current scroll position
    const originalScrollY = window.scrollY
    const originalScrollX = window.scrollX

    // B. Scroll to top. This fixes the "Blank Image" bug.
    // html2canvas takes a "photo" of the screen; if you are scrolled down,
    // the top of the photo is empty.
    window.scrollTo(0, 0)

    // C. Wait 100ms for any scroll animations or charts to settle
    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      const element = dashboardRef.current

      const canvas = await html2canvas(element, {
        scale: 4, // 4K Resolution
        useCORS: true, // Fixes missing external images
        backgroundColor: lightMode ? "#f8fafc" : "#1a1a24", // Dynamic BG color

        // These settings force the camera to capture the FULL height,
        // not just what is visible on screen.
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,

        // Ignore specific elements if needed (like the chat window if open)
        ignoreElements: (node) => {
          return node.id === 'ai-chatbot-window';
        }
      })

      // Convert to Image & Download
      const dataUrl = canvas.toDataURL("image/png", 1.0)
      const link = document.createElement("a")
      link.download = `dashboard-4k-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (err) {
      console.error("Export failed:", err)
      alert("Export failed. Please try again.")
    } finally {
      // D. Restore the user's scroll position so they don't lose their place
      window.scrollTo(originalScrollX, originalScrollY)
      setIsExporting(false)
    }
  }

  const toggleLightMode = () => {
    setLightMode(!lightMode)
    document.documentElement.classList.toggle("light")
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-[1600px]">
        {!data ? (
          <FileUploader onDataParsed={setData} />
        ) : (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Analytics Dashboard</h2>
                  <p className="text-muted-foreground text-sm">
                    {data.rows.length.toLocaleString()} records | {data.headers.length} fields |{" "}
                    {data.numericColumns.length} metrics
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLightMode}
                  className="border-border hover:bg-secondary bg-transparent"
                >
                  {lightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="border-border hover:bg-secondary"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  AI Assistant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setData(null)}
                  className="border-border hover:bg-secondary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  New File
                </Button>
                <Button
                  onClick={handleExport4K}
                  disabled={isExporting}
                  size="sm"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 border-0"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export 4K"}
                </Button>
              </div>
            </div>

            {/* AI Insights Panel */}
            <InsightsPanel data={data} />

            {/* 3. DASHBOARD CONTENT REF
                The ref is placed here on the wrapper div.
                Everything inside this div will be captured.
            */}
            <div ref={dashboardRef} className="space-y-5 w-full max-w-[1600px] bg-background p-2 rounded-xl">
              {/* KPI Cards Row */}
              <KpiCards data={data} />

              {/* Main Charts Grid */}
              <div className="grid gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <BarChartSection data={data} />
                </div>
                <div>
                  <TopChannelsTable data={data} />
                </div>
              </div>

              {/* Secondary Charts Row */}
              <div className="grid gap-5 md:grid-cols-3">
                <PieChartSection data={data} />
                <ScatterChartSection data={data} />
                <HorizontalBarSection data={data} />
              </div>

              {/* Line Chart - Full Width */}
              <LineChartSection data={data} />

              {/* Data Table */}
              <DataTable data={data} />
            </div>
          </div>
        )}
      </main>

      {/* AI Chatbot Sidebar */}
      {showChat && data && <AiChatbot data={data} onClose={() => setShowChat(false)} />}
    </div>
  )
}