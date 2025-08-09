"use client"

import { useMemo, useState } from "react"
import type { Applicant } from "@/lib/types"
import { StageBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { actionMoveApplicant } from "@/app/actions/hiring"

type Props = {
  applicants?: Applicant[]
  showJobColumn?: boolean
  jobTitleById?: Record<string, string>
}

const STAGES: Applicant["stage"][] = ["new", "reviewed", "interview", "offer", "hired", "rejected"]

export default function ApplicantTable({ applicants = [], showJobColumn = false, jobTitleById = {} }: Props) {
  const [q, setQ] = useState("")
  const [stage, setStage] = useState<"all" | Applicant["stage"]>("all")

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const matchesQ =
        !q ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.email.toLowerCase().includes(q.toLowerCase()) ||
        a.location.toLowerCase().includes(q.toLowerCase())
      const matches = stage === "all" ? true : a.stage === stage
      return matchesQ && matches
    })
  }, [applicants, q, stage])

  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search applicants..."
              className="w-[240px]"
            />
            <select
              aria-label="Filter by stage"
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
            >
              <option value="all">All stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filtered.length} applicant{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                {showJobColumn && <TableHead>Job</TableHead>}
                <TableHead>Stage</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[220px]">Advance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.location}</TableCell>
                  {showJobColumn && <TableCell>{jobTitleById[a.jobId] || "—"}</TableCell>}
                  <TableCell>
                    <StageBadge stage={a.stage} />
                  </TableCell>
                  <TableCell>{a.source}</TableCell>
                  <TableCell>{new Date(a.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {STAGES.map((s) => (
                        <form
                          key={s}
                          action={async () => {
                            await actionMoveApplicant(a.id, s)
                          }}
                        >
                          <Button size="xs" variant={s === a.stage ? "default" : "outline"} type="submit">
                            {s}
                          </Button>
                        </form>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                    No applicants found.
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
