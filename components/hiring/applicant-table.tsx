"use client"

import { useMemo, useState } from "react"
import type { Applicant } from "@/lib/types"
import { StageBadge } from "@/components/hiring/status-badges"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { actionMoveApplicant } from "@/app/actions/hiring"
import { Mail, CalendarClock, FileText, User } from "lucide-react"

type Props = {
  applicants?: Applicant[]
  showJobColumn?: boolean
  jobTitleById?: Record<string, string>
}

const STAGES: Applicant["stage"][] = ["new", "reviewed", "interview", "offer", "hired", "rejected"]

function formatDateTime(iso: string | undefined) {
  if (!iso) return "—"
  try {
    const d = new Date(iso)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  } catch {
    return iso
  }
}

export default function ApplicantTable({ applicants = [], showJobColumn = false, jobTitleById = {} }: Props) {
  const [q, setQ] = useState("")
  const [stage, setStage] = useState<"all" | Applicant["stage"]>("all")
  const [active, setActive] = useState<Applicant | null>(null)

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
    <>
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
                  <TableHead className="w-[280px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>
                      <a className="hover:underline" href={`mailto:${a.email}`} aria-label={`Email ${a.name}`}>
                        {a.email}
                      </a>
                    </TableCell>
                    <TableCell>{a.location}</TableCell>
                    {showJobColumn && <TableCell>{jobTitleById[a.jobId] || "—"}</TableCell>}
                    <TableCell>
                      <StageBadge stage={a.stage} />
                    </TableCell>
                    <TableCell>{a.source}</TableCell>
                    <TableCell>{formatDateTime(a.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {/* Quick stage advance buttons */}
                        {STAGES.map((s) => (
                          <form
                            key={s}
                            action={async () => {
                              await actionMoveApplicant(a.id, s)
                            }}
                          >
                            <Button
                              size="xs"
                              variant={s === a.stage ? "default" : "outline"}
                              type="submit"
                              aria-label={`Set stage ${s} for ${a.name}`}
                            >
                              {s}
                            </Button>
                          </form>
                        ))}
                        {/* View details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => setActive(a)}
                              aria-label={`View details for ${a.name}`}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <ApplicantDetails
                            applicant={active?.id === a.id ? active : a}
                            jobTitle={jobTitleById[a.jobId]}
                            onClose={() => setActive(null)}
                          />
                        </Dialog>
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
    </>
  )
}

function ApplicantDetails({
  applicant,
  jobTitle,
  onClose,
}: {
  applicant: Applicant
  jobTitle?: string
  onClose: () => void
}) {
  // Fallback if not available (shouldn’t happen due to controlled trigger)
  if (!applicant) return null

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          <span>{applicant.name}</span>
        </DialogTitle>
        <DialogDescription>Application details and actions</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        {/* Core info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Email</div>
            <a className="text-sm hover:underline" href={`mailto:${applicant.email}`}>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                {applicant.email}
              </span>
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="text-sm">{applicant.location || "—"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Applied For</div>
            <div className="text-sm">{jobTitle || "—"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Source</div>
            <div className="text-sm">{applicant.source || "—"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Stage</div>
            <div className="flex items-center gap-2">
              <StageBadge stage={applicant.stage} />
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Created</div>
            <div className="text-sm">{formatDateTime(applicant.createdAt)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Last Updated</div>
            <div className="text-sm">{formatDateTime(applicant.updatedAt)}</div>
          </div>
        </div>

        {/* Resume and quick actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {applicant.resumeUrl ? (
            <a
              href={applicant.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
              aria-label="Open resume"
            >
              <Button variant="outline" size="sm">
                <FileText className="mr-2 size-4" />
                Open resume
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <FileText className="mr-2 size-4" />
              No resume
            </Button>
          )}
          <a href="/team/meetings" className="inline-flex" aria-label="Schedule a meeting">
            <Button variant="default" size="sm">
              <CalendarClock className="mr-2 size-4" />
              Schedule meeting
            </Button>
          </a>
        </div>

        {/* Stage management (separate forms, no nesting) */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Change stage</div>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <form
                key={s}
                action={async () => {
                  await actionMoveApplicant(applicant.id, s)
                  onClose()
                }}
              >
                <Button size="sm" variant={s === applicant.stage ? "default" : "outline"} type="submit">
                  {s}
                </Button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
