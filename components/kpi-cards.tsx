"use client"

import type { ParsedData } from "./dashboard"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface KpiCardsProps {
  data: ParsedData
}

export function KpiCards({ data }: KpiCardsProps) {
  const { rows, numericColumns } = data

  const calcAverage = (col: string) => {
    if (!col) return 0
    const values = rows.map((r) => Number(r[col]) || 0)
    return values.reduce((a, b) => a + b, 0) / values.length
  }

  const calcSum = (col: string) => {
    if (!col) return 0
    const values = rows.map((r) => Number(r[col]) || 0)
    return values.reduce((a, b) => a + b, 0)
  }

  const calcMax = (col: string) => {
    if (!col) return 0
    const values = rows.map((r) => Number(r[col]) || 0)
    return Math.max(...values)
  }

  // Generate mini trend data
  const generateTrendData = (col: string) => {
    if (!col) return Array(8).fill({ value: 50 })
    return rows.slice(0, 8).map((row) => ({
      value: Number(row[col]) || Math.random() * 100,
    }))
  }

  const kpis = [
    {
      title: numericColumns[0] || "Avg. Contract Value",
      value: calcAverage(numericColumns[0]),
      previousValue: calcAverage(numericColumns[0]) * 0.88,
      color: "#f97316",
      bgGradient: "from-orange-500 to-orange-600",
      chartType: "line" as const,
      trendData: generateTrendData(numericColumns[0]),
    },
    {
      title: numericColumns[1] || "Lead Response Time",
      value: calcAverage(numericColumns[1] || numericColumns[0]),
      previousValue: calcAverage(numericColumns[1] || numericColumns[0]) * 1.1,
      color: "#14b8a6",
      bgGradient: "from-teal-500 to-teal-600",
      chartType: "line" as const,
      trendData: generateTrendData(numericColumns[1]),
    },
    {
      title: numericColumns[2] || "Sales Cycle Length",
      value: calcSum(numericColumns[2] || numericColumns[0]),
      previousValue: calcSum(numericColumns[2] || numericColumns[0]) * 0.92,
      color: "#0ea5e9",
      bgGradient: "from-sky-500 to-cyan-600",
      chartType: "line" as const,
      trendData: generateTrendData(numericColumns[2]),
    },
    {
      title: numericColumns[3] || "Sales KPI",
      value: calcMax(numericColumns[3] || numericColumns[0]) || rows.length,
      previousValue: 200,
      color: "#eab308",
      bgGradient: "from-yellow-500 to-amber-500",
      chartType: "gauge" as const,
      trendData: generateTrendData(numericColumns[3]),
    },
  ]

  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(2)}k`
    return val.toFixed(0)
  }

  const getChangePercent = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const changePercent = getChangePercent(kpi.value, kpi.previousValue)
        const isPositive = changePercent >= 0

        return (
          <Card
            key={index}
            className={`bg-gradient-to-br ${kpi.bgGradient} border-0 p-5 text-white relative overflow-hidden shadow-lg`}
          >
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-medium mb-2 truncate">{kpi.title}</p>
              <div className="flex items-end justify-between gap-2">
                <div className="flex-1">
                  <p className="text-3xl font-bold tracking-tight leading-none">{formatValue(kpi.value)}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {isPositive ? (
                      <TrendingUp className="h-3.5 w-3.5 text-white/90" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-white/90" />
                    )}
                    <span className="text-xs text-white/80 font-medium">
                      {isPositive ? "+" : ""}
                      {changePercent.toFixed(1)}%
                    </span>
                    <span className="text-xs text-white/60">{formatValue(kpi.previousValue)}</span>
                  </div>
                </div>
                <div className="w-20 h-14 flex-shrink-0">
                  {kpi.chartType === "line" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kpi.trendData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="rgba(255,255,255,0.85)"
                          strokeWidth={2}
                          dot={{ fill: "rgba(255,255,255,0.9)", strokeWidth: 0, r: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: Math.min(100, (kpi.value / 400) * 100) },
                            { value: Math.max(0, 100 - (kpi.value / 400) * 100) },
                          ]}
                          cx="50%"
                          cy="85%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={22}
                          outerRadius={32}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          <Cell fill="rgba(255,255,255,0.95)" />
                          <Cell fill="rgba(255,255,255,0.2)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
            {/* Background decorations */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/5" />
          </Card>
        )
      })}
    </div>
  )
}
