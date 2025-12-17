"use client"

import type { ParsedData } from "../dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface LineChartSectionProps {
  data: ParsedData
}

export function LineChartSection({ data }: LineChartSectionProps) {
  const { rows, numericColumns, categoricalColumns } = data
  const [selectedMetric1, setSelectedMetric1] = useState(numericColumns[0] || "")
  const [selectedMetric2, setSelectedMetric2] = useState(numericColumns[1] || numericColumns[0] || "")

  const chartData = rows.slice(0, 25).map((row, index) => ({
    name: row[categoricalColumns[0]] ? String(row[categoricalColumns[0]]).substring(0, 10) : `Item ${index + 1}`,
    value1: Number(row[selectedMetric1]) || 0,
    value2: Number(row[selectedMetric2]) || 0,
  }))

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold text-foreground">Trend Analysis</CardTitle>
          <div className="flex gap-2">
            <Select value={selectedMetric1} onValueChange={setSelectedMetric1}>
              <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                <SelectValue placeholder="Metric 1" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMetric2} onValueChange={setSelectedMetric2}>
              <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                <SelectValue placeholder="Metric 2" />
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
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
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
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="line"
                formatter={(value) => <span style={{ fontSize: "11px", color: "#9ca3af" }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="value1"
                name={selectedMetric1}
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ fill: "#14b8a6", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="value2"
                name={selectedMetric2}
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#f97316", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
