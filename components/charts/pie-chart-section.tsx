"use client"

import type { ParsedData } from "../dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface PieChartSectionProps {
  data: ParsedData
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}) => {
  // Position labels outside the pie for better visibility
  const radius = outerRadius + 20
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Only show label if percentage is significant
  if (percent < 0.03) return null

  return (
    <text
      x={x}
      y={y}
      fill="#e5e7eb"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

export function PieChartSection({ data }: PieChartSectionProps) {
  const { rows, categoricalColumns } = data
  const [selectedCategory, setSelectedCategory] = useState(categoricalColumns[0] || "")

  const pieData = () => {
    if (!selectedCategory) return []

    const counts: Record<string, number> = {}
    rows.forEach((row) => {
      const cat = String(row[selectedCategory] || "Unknown")
      counts[cat] = (counts[cat] || 0) + 1
    })

    const total = Object.values(counts).reduce((a, b) => a + b, 0)

    return Object.entries(counts)
      .map(([name, value]) => ({
        name: name.length > 12 ? name.substring(0, 12) + "..." : name,
        fullName: name,
        value,
        percentage: ((value / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }

  const chartData = pieData()
  const COLORS = ["#f97316", "#14b8a6", "#0ea5e9", "#eab308", "#8b5cf6", "#ec4899"]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            {selectedCategory || "Category"} Distribution
          </CardTitle>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categoricalColumns.map((col) => (
                <SelectItem key={col} value={col} className="text-xs">
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={{ stroke: "#6b7280", strokeWidth: 1 }}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 30, 40, 0.95)",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e5e7eb",
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} (${props.payload.percentage}%)`,
                  props.payload.fullName,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={45}
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                formatter={(value) => <span className="text-muted-foreground ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
