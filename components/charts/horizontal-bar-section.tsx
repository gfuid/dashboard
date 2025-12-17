"use client"

import type { ParsedData } from "../dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface HorizontalBarSectionProps {
  data: ParsedData
}

export function HorizontalBarSection({ data }: HorizontalBarSectionProps) {
  const { rows, numericColumns, categoricalColumns } = data
  const [selectedCategory, setSelectedCategory] = useState(categoricalColumns[0] || "")
  const [selectedValue, setSelectedValue] = useState(numericColumns[0] || "")

  const chartData = () => {
    if (!selectedCategory || !selectedValue) return []

    const grouped: Record<string, number> = {}
    rows.forEach((row) => {
      const cat = String(row[selectedCategory] || "Unknown")
      const val = Number(row[selectedValue]) || 0
      grouped[cat] = (grouped[cat] || 0) + val
    })

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name: name.length > 10 ? name.substring(0, 10) + "..." : name,
        fullName: name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  const barData = chartData()
  const COLORS = ["#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"]

  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
    return val.toFixed(0)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">Top Performers</CardTitle>
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="w-28 h-8 text-xs bg-secondary border-border">
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
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickFormatter={formatValue}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                width={70}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 30, 40, 0.95)",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e5e7eb",
                }}
                formatter={(value: number) => [formatValue(value), selectedValue]}
                labelFormatter={(label) => barData.find((d) => d.name === label)?.fullName || label}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {barData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
