"use client"

import { useState } from "react"
import type { ParsedData } from "./dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight, Table2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataTableProps {
  data: ParsedData
}

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const filteredRows = data.rows.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage)

  const exportTableCSV = () => {
    const csvContent = [
      data.headers.join(","),
      ...filteredRows.map((row) => data.headers.map((h) => `"${row[h]}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-export-${Date.now()}.csv`
    a.click()
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
            <Table2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">Data Table</CardTitle>
            <p className="text-xs text-muted-foreground">{filteredRows.length} records</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-56 bg-secondary border-border pl-10 h-9 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportTableCSV} className="h-9 bg-transparent">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {data.headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition-colors hover:bg-muted/30">
                  {data.headers.map((header) => (
                    <td key={header} className="whitespace-nowrap px-4 py-3 text-sm text-foreground">
                      {typeof row[header] === "number"
                        ? (row[header] as number).toLocaleString()
                        : String(row[header]).length > 30
                          ? String(row[header]).substring(0, 30) + "..."
                          : String(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
              {paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={data.headers.length} className="px-4 py-8 text-center text-muted-foreground">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRows.length > 0 ? startIndex + 1 : 0}-
            {Math.min(startIndex + rowsPerPage, filteredRows.length)} of {filteredRows.length} rows
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border h-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 p-0 ${currentPage === pageNum ? "bg-primary text-primary-foreground" : "border-border"}`}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="border-border h-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
