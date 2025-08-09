"use client"

import { getApplicants, getJobs } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ExportsPage() {
  const [jobs, applicants] = await Promise.all([getJobs(), getApplicants()])

  function toCsv(rows: any[]) {
    const keys = Object.keys(rows[0] || {})
    const header = keys.join(",")
    const body = rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))
    return [header, ...body].join("\n")
  }

  function triggerDownload(name: string, content: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exports</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          onClick={() => triggerDownload("jobs.csv", toCsv(jobs.map(({ description, requirements, ...rest }) => rest)))}
        >
          Export Jobs CSV
        </Button>
        <Button
          variant="outline"
          onClick={() => triggerDownload("applicants.csv", toCsv(applicants.map(({ resumeUrl, ...rest }) => rest)))}
        >
          Export Applicants CSV
        </Button>
      </CardContent>
    </Card>
  )
}
