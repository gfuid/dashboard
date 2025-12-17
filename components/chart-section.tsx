"use client"

import { useState } from "react"
import type { ParsedData } from "./dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface ChartSectionProps {
  data: ParsedData
  chartType: "bar" | "pie"
}

const COLORS = [
  "oklch(0.7 0.15 200)",
  "oklch(0.75 0.18 160)",
  "oklch(0.8 0.15 80)",
  "oklch(0.65 0.2 320)",
  "oklch(0.7 0.2 30)",
]

export function ChartSection({ data, chartType }: ChartSectionProps) {
  const [selectedNumeric, setSelectedNumeric] = useState(data.numericColumns[0] || "")
  const [selectedCategory, setSelectedCategory] = useState(data.categoricalColumns[0] || data.headers[0] || "")
  const [visualType, setVisualType] = useState<"bar" | "line" | "area">("bar")

  const chartData = data.rows.slice(0, 20).map((row) => ({
    name: String(row[selectedCategory]).slice(0, 15),
    value: Number(row[selectedNumeric]) || 0,
  }))

  const pieData = () => {
    const grouped: Record<string, number> = {}
    data.rows.forEach((row) => {
      const key = String(row[selectedCategory]).slice(0, 20)
      grouped[key] = (grouped[key] || 0) + (Number(row[selectedNumeric]) || 1)
    })
    return Object.entries(grouped)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }))
  }

  if (chartType === "pie") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">Distribution</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {data.headers.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData().map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.01 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: "oklch(0.65 0 0)" }}
                    formatter={(value) => <span style={{ color: "oklch(0.95 0 0)" }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pieData().map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="font-mono text-sm font-medium text-muted-foreground">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Data Visualization</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-36 bg-secondary border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {data.headers.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedNumeric} onValueChange={setSelectedNumeric}>
              <SelectTrigger className="w-36 bg-secondary border-border">
                <SelectValue placeholder="Value" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {data.numericColumns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={visualType} onValueChange={(v) => setVisualType(v as "bar" | "line" | "area")}>
              <SelectTrigger className="w-28 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {visualType === "bar" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                  <XAxis
                    dataKey="name"
                    stroke="oklch(0.65 0 0)"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="oklch(0.65 0 0)" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.01 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Bar dataKey="value" fill="oklch(0.7 0.15 200)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : visualType === "line" ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                  <XAxis
                    dataKey="name"
                    stroke="oklch(0.65 0 0)"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="oklch(0.65 0 0)" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.01 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.7 0.15 200)"
                    strokeWidth={3}
                    dot={{ fill: "oklch(0.7 0.15 200)", strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                  <XAxis
                    dataKey="name"
                    stroke="oklch(0.65 0 0)"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="oklch(0.65 0 0)" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.01 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.7 0.15 200)"
                    fill="oklch(0.7 0.15 200 / 0.3)"
                    strokeWidth={2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
