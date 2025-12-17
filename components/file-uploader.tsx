"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileSpreadsheet, AlertCircle, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ParsedData } from "./dashboard"
import Papa from "papaparse"

interface FileUploaderProps {
  onDataParsed: (data: ParsedData) => void
}

export function FileUploader({ onDataParsed }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const parseCSV = useCallback(
    (file: File) => {
      setIsLoading(true)
      setError(null)

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError("Error parsing CSV file. Please check the format.")
            setIsLoading(false)
            return
          }

          const rows = results.data as Record<string, string>[]
          const headers = results.meta.fields || []

          if (headers.length === 0 || rows.length === 0) {
            setError("The CSV file appears to be empty.")
            setIsLoading(false)
            return
          }

          const numericColumns: string[] = []
          const categoricalColumns: string[] = []

          headers.forEach((header) => {
            const values = rows.map((row) => row[header]).filter(Boolean)
            const numericCount = values.filter((v) => !isNaN(Number.parseFloat(v))).length

            if (numericCount > values.length * 0.7) {
              numericColumns.push(header)
            } else {
              categoricalColumns.push(header)
            }
          })

          const processedRows = rows.map((row) => {
            const processedRow: Record<string, string | number> = {}
            headers.forEach((header) => {
              if (numericColumns.includes(header)) {
                processedRow[header] = Number.parseFloat(row[header]) || 0
              } else {
                processedRow[header] = row[header] || ""
              }
            })
            return processedRow
          })

          onDataParsed({
            headers,
            rows: processedRows,
            numericColumns,
            categoricalColumns,
          })
          setIsLoading(false)
        },
        error: () => {
          setError("Failed to read the file. Please try again.")
          setIsLoading(false)
        },
      })
    },
    [onDataParsed],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        parseCSV(file)
      }
    },
    [parseCSV],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  })

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-xl">
            <FileSpreadsheet className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Transform Your Data</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Upload a CSV file and instantly generate beautiful, interactive visualizations
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border">
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-foreground">Bar Charts</p>
            <p className="text-xs text-muted-foreground">Category analysis</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border">
            <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-3">
              <PieChart className="h-5 w-5 text-teal-600" />
            </div>
            <p className="text-sm font-medium text-foreground">Pie Charts</p>
            <p className="text-xs text-muted-foreground">Distribution view</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border">
            <div className="h-10 w-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mb-3">
              <TrendingUp className="h-5 w-5 text-sky-600" />
            </div>
            <p className="text-sm font-medium text-foreground">Trend Lines</p>
            <p className="text-xs text-muted-foreground">Pattern insights</p>
          </div>
        </div>

        {/* Upload Card */}
        <Card className="border-border bg-card shadow-lg">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <input {...getInputProps()} />
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-muted-foreground font-medium">Processing your file...</p>
                </div>
              ) : (
                <>
                  <div
                    className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? "bg-primary/20" : "bg-secondary"}`}
                  >
                    <Upload className={`h-8 w-8 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {isDragActive ? "Drop your file here" : "Drag & drop your CSV file"}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">or click to browse from your computer</p>
                  <p className="mt-4 text-xs text-muted-foreground/70">Supports .csv files with header row</p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data stays in your browser. Nothing is uploaded to any server.
        </p>
      </div>
    </div>
  )
}
