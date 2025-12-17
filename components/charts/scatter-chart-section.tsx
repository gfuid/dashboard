"use client"

import type { ParsedData } from "../dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ZAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface ScatterChartSectionProps {
  data: ParsedData
}

export function ScatterChartSection({ data }: ScatterChartSectionProps) {
  const { rows, numericColumns } = data
  const [xAxis, setXAxis] = useState(numericColumns[0] || "")
  const [yAxis, setYAxis] = useState(numericColumns[1] || numericColumns[0] || "")

  const scatterData = rows.slice(0, 50).map((row) => ({
    x: Number(row[xAxis]) || 0,
    y: Number(row[yAxis]) || 0,
    z: Math.random() * 100 + 50,
  }))

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">Activity Analysis</CardTitle>
          <div className="flex gap-1">
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger className="w-20 h-7 text-xs bg-secondary border-border">
                <SelectValue placeholder="X" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col.length > 10 ? col.substring(0, 10) + "..." : col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger className="w-20 h-7 text-xs bg-secondary border-border">
                <SelectValue placeholder="Y" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col.length > 10 ? col.substring(0, 10) + "..." : col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                type="number"
                dataKey="x"
                name={xAxis}
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                label={{ value: "X-axis", position: "bottom", fontSize: 10, fill: "#9ca3af" }}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={yAxis}
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                label={{ value: "Y-axis", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9ca3af" }}
                axisLine={{ stroke: "#374151" }}
                tickLine={{ stroke: "#374151" }}
              />
              <ZAxis type="number" dataKey="z" range={[40, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "rgba(30, 30, 40, 0.95)",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e5e7eb",
                }}
                formatter={(value: number) => value.toFixed(2)}
              />
              <Scatter data={scatterData} fill="#f97316" opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
