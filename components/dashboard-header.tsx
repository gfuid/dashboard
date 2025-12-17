"use client"

import { BarChart3, FileSpreadsheet, Layers, Download } from "lucide-react"
import html2canvas from 'html2canvas-pro';
export function DashboardHeader() {

  // 2. Add the Export Logic Here
  const handleExport4K = async () => {
    const element = document.getElementById('dashboard-content');

    if (!element) {
      alert("Dashboard content not found! Make sure you added id='dashboard-content' to your Dashboard wrapper.");
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 4, // 4K Resolution
        useCORS: true,
        backgroundColor: '#111827', // Force dark background
        scrollX: 0,
        scrollY: -window.scrollY, // Adjust for scroll position
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `dashboard-4k-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export image.");
    }
  };

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 max-w-[1600px]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">DataViz Pro</h1>
            <p className="text-xs text-muted-foreground">CSV to Visual Dashboard</p>
          </div>
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Data
          </a>

          {/* 3. CHANGED: Converted 'Export' link to a Button */}
          <button
            onClick={handleExport4K}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export 4K
          </button>

        </nav>
      </div>
    </header>
  )
}