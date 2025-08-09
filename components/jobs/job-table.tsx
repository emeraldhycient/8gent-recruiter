"use client"

import { useMemo, useState } from "react"
import type { Job } from "@/lib/types"
import { JobStatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Props = {
  jobs?: Job[]
}

export default function JobTable({ jobs = [] }: Props) {
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<"all" | "draft" | "published" | "closed">("all")

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesQ =
        !q ||
        j.title.toLowerCase().includes(q.toLowerCase()) ||
        j.department.toLowerCase().includes(q.toLowerCase()) ||
        j.location.toLowerCase().includes(q.toLowerCase())
      const matchesStatus = status === "all" ? true : j.status === status
      return matchesQ && matchesStatus
    })
  }, [jobs, q, status])

  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jobs..."
              className="w-[220px]"
            />
            <select
              aria-label="Filter by status"
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filtered.length} job{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
                <TableHead className="min-w-[160px]">Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.title}</TableCell>
                  <TableCell>{j.department}</TableCell>
                  <TableCell>{j.location}</TableCell>
                  <TableCell className="capitalize">{j.employmentType.replace("-", " ")}</TableCell>
                  <TableCell>
                    <JobStatusBadge status={j.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{j.applicantsCount}</TableCell>
                  <TableCell>{new Date(j.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/jobs/${j.id}`}>View</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                    No jobs found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
