"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertCircle, Lightbulb, Target, BarChart3 } from "lucide-react"
import type { ParsedData } from "./dashboard"

interface InsightsPanelProps {
  data: ParsedData
}

export function InsightsPanel({ data }: InsightsPanelProps) {
  const { rows, numericColumns, categoricalColumns, headers } = data

  const insights = []

  // Data completeness
  const totalCells = rows.length * headers.length
  const emptyCells = rows.reduce((count, row) => {
    return count + Object.values(row).filter((v) => v === "" || v === null || v === undefined).length
  }, 0)
  const completeness = ((totalCells - emptyCells) / totalCells) * 100

  if (completeness < 95) {
    insights.push({
      type: "warning",
      icon: AlertCircle,
      title: "Data Completeness",
      message: `Dataset is ${completeness.toFixed(1)}% complete. Consider filling ${emptyCells} missing values for better accuracy.`,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    })
  } else {
    insights.push({
      type: "success",
      icon: TrendingUp,
      title: "Excellent Data Quality",
      message: `Your dataset is ${completeness.toFixed(1)}% complete with minimal gaps. Ready for comprehensive analysis.`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    })
  }

  // Numeric analysis
  if (numericColumns.length > 0) {
    const col = numericColumns[0]
    const values = rows.map((r) => Number(r[col]) || 0).filter((v) => !isNaN(v))
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length)
    const outliers = values.filter((v) => Math.abs(v - avg) > 2 * stdDev).length

    insights.push({
      type: "insight",
      icon: BarChart3,
      title: `${col} Analysis`,
      message: `Range: ${min.toFixed(1)} - ${max.toFixed(1)} | Avg: ${avg.toFixed(2)} | Std Dev: ${stdDev.toFixed(2)} | ${outliers} outliers detected`,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    })
  }

  // Categorical insight
  if (categoricalColumns.length > 0) {
    const col = categoricalColumns[0]
    const uniqueValues = new Set(rows.map((r) => r[col]))
    const counts: Record<string, number> = {}
    rows.forEach((row) => {
      const val = String(row[col])
      counts[val] = (counts[val] || 0) + 1
    })
    const topItems = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    insights.push({
      type: "recommendation",
      icon: Target,
      title: `Top ${col} Distribution`,
      message: `${uniqueValues.size} unique values. Top: ${topItems.map(([name, count]) => `${name} (${((count / rows.length) * 100).toFixed(1)}%)`).join(", ")}`,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    })
  }

  // Suggestion
  insights.push({
    type: "tip",
    icon: Lightbulb,
    title: "Pro Tip",
    message:
      rows.length > 1000
        ? "Large dataset detected. Use filters to focus on specific segments for faster insights."
        : "Try comparing multiple metrics in the Trend Analysis chart to discover correlations.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          AI-Powered Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className={`flex gap-3 p-3 rounded-lg border ${insight.bg}`}>
                <div className={`flex-shrink-0 ${insight.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
