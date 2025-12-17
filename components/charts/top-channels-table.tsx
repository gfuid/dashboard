"use client"

import type { ParsedData } from "../dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface TopChannelsTableProps {
  data: ParsedData
}

export function TopChannelsTable({ data }: TopChannelsTableProps) {
  const { rows, headers, categoricalColumns, numericColumns } = data
  const [sortColumn, setSortColumn] = useState(numericColumns[0] || headers[0])

  // Get top rows sorted by selected column
  const topRows = [...rows]
    .sort((a, b) => {
      const aVal = Number(a[sortColumn]) || 0
      const bVal = Number(b[sortColumn]) || 0
      return bVal - aVal
    })
    .slice(0, 8)

  // Display columns - pick first 3 meaningful columns
  const displayColumns = headers.slice(0, 3)

  const formatValue = (val: string | number) => {
    const num = Number(val)
    if (isNaN(num)) return val
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">Top Records</CardTitle>
          <Select value={sortColumn} onValueChange={setSortColumn}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {numericColumns.map((col) => (
                <SelectItem key={col} value={col} className="text-xs">
                  {col.length > 12 ? col.substring(0, 12) + "..." : col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {displayColumns.map((col) => (
                  <th key={col} className="text-left py-2 px-2 font-semibold text-foreground bg-muted/50">
                    {col.length > 10 ? col.substring(0, 10) + "..." : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topRows.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  {displayColumns.map((col) => (
                    <td key={col} className="py-2 px-2 text-muted-foreground">
                      {String(row[col]).length > 12 ? String(row[col]).substring(0, 12) + "..." : formatValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
