"use client"

import type { ParsedData } from "./dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Database, Columns3, Hash } from "lucide-react"

interface StatsCardsProps {
  data: ParsedData
}

export function StatsCards({ data }: StatsCardsProps) {
  const totalRows = data.rows.length
  const totalColumns = data.headers.length
  const numericCols = data.numericColumns.length

  const averages = data.numericColumns.slice(0, 1).map((col) => {
    const values = data.rows.map((row) => Number(row[col]) || 0)
    const sum = values.reduce((a, b) => a + b, 0)
    return { column: col, average: sum / values.length }
  })

  const stats = [
    {
      label: "Total Rows",
      value: totalRows.toLocaleString(),
      icon: Database,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Columns",
      value: totalColumns,
      icon: Columns3,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Numeric Fields",
      value: numericCols,
      icon: Hash,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: averages[0]?.column ? `Avg ${averages[0].column}` : "Average",
      value: averages[0]?.average ? averages[0].average.toFixed(2) : "N/A",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
