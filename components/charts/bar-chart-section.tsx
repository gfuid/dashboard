"use client"

import type { ParsedData } from "../dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Tooltip, Cell } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface BarChartSectionProps {
  data: ParsedData
}

export function BarChartSection({ data }: BarChartSectionProps) {
  const { rows, numericColumns, categoricalColumns } = data
  const [selectedCategory, setSelectedCategory] = useState(categoricalColumns[0] || "")
  const [selectedValue, setSelectedValue] = useState(numericColumns[0] || "")

  const aggregatedData = () => {
    if (!selectedCategory || !selectedValue) return []

    const grouped: Record<string, number[]> = {}
    rows.forEach((row) => {
      const cat = String(row[selectedCategory] || "Unknown")
      const val = Number(row[selectedValue]) || 0
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(val)
    })

    return Object.entries(grouped)
      .map(([name, values]) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        fullName: name,
        value: values.reduce((a, b) => a + b, 0) / values.length,
        high: Math.max(...values),
        low: Math.min(...values),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }

  const chartData = aggregatedData()
  const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"]

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            {selectedValue || "Average Value"} by {selectedCategory || "Category"}
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoricalColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                <SelectValue placeholder="Value" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 30, 40, 0.95)",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e5e7eb",
                }}
                formatter={(value: number) => [value.toFixed(2), selectedValue]}
                labelFormatter={(label) => chartData.find((d) => d.name === label)?.fullName || label}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(val: number) => val.toFixed(1)}
                  style={{ fontSize: 9, fill: "#9ca3af" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
