"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Meeting, MeetingStatus, MeetingType, Applicant, Job } from "@/lib/types"
import {
  actionCancelMeeting,
  actionCompleteMeeting,
  actionRescheduleMeeting,
  actionCreateNextRound,
} from "@/app/actions/meetings"

type Props = {
  meetings?: Meeting[]
  applicants?: Applicant[]
  jobs?: Job[]
}

const TYPE_LABELS: Record<MeetingType, string> = {
  phone_screen: "Phone Screen",
  technical: "Technical",
  onsite: "Onsite",
  offer: "Offer Call",
}

const STATUS_NAME: Record<MeetingStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  canceled: "Canceled",
}

const STATUS_BADGE: Record<MeetingStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

function labelMeeting(m: Meeting) {
  const base = TYPE_LABELS[m.type]
  return m.round ? `${base} R${m.round}` : base
}

function toLocalDatetimeValue(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export default function MeetingsClient({ meetings = [], applicants = [], jobs = [] }: Props) {
  // Derived maps
  const applicantById = React.useMemo(() => Object.fromEntries(applicants.map((a) => [a.id, a])), [applicants])
  const jobById = React.useMemo(() => Object.fromEntries(jobs.map((j) => [j.id, j])), [jobs])

  // Filters
  const [status, setStatus] = React.useState<"all" | MeetingStatus>("all")
  const [type, setType] = React.useState<"all" | MeetingType>("all")
  const [from, setFrom] = React.useState<string>("")
  const [to, setTo] = React.useState<string>("")

  // View
  const [tab, setTab] = React.useState<"list" | "calendar">("calendar")

  // Calendar month state
  const [month, setMonth] = React.useState<Date>(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null)

  // Details dialog state
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState<Meeting | null>(null)
  function openMeeting(m: Meeting) {
    setActive(m)
    setOpen(true)
  }

  const filtered = React.useMemo(() => {
    return meetings.filter((m) => {
      if (status !== "all" && m.status !== status) return false
      if (type !== "all" && m.type !== type) return false
      const time = new Date(m.scheduledAt).getTime()
      if (from) {
        const ft = new Date(from + "T00:00:00").getTime()
        if (time < ft) return false
      }
      if (to) {
        const tt = new Date(to + "T23:59:59").getTime()
        if (time > tt) return false
      }
      return true
    })
  }, [meetings, status, type, from, to])

  // Calendar grid
  const days = React.useMemo(() => {
    const first = startOfMonth(month)
    const last = endOfMonth(month)
    const startDay = new Date(first)
    startDay.setDate(first.getDate() - first.getDay()) // back to Sunday
    const endDay = new Date(last)
    endDay.setDate(last.getDate() + (6 - last.getDay())) // forward to Saturday

    const grid: Date[] = []
    const cur = new Date(startDay)
    while (cur <= endDay) {
      grid.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }
    return grid
  }, [month])

  const meetingsByDay = React.useMemo(() => {
    const map = new Map<string, Meeting[]>()
    for (const m of filtered) {
      const d = new Date(m.scheduledAt)
      const key = ymd(d)
      const arr = map.get(key) || []
      arr.push(m)
      map.set(key, arr)
    }
    return map
  }, [filtered])

  const selectedDayKey = selectedDay ? ymd(selectedDay) : ""
  const selectedMeetings = selectedDay ? meetingsByDay.get(selectedDayKey) || [] : []

  const ActiveDetails = active
    ? {
        applicant: applicantById[active.applicantId],
        job: jobById[active.jobId],
      }
    : { applicant: undefined, job: undefined }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
            >
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
            >
              <option value="all">All</option>
              <option value="phone_screen">Phone Screen</option>
              <option value="technical">Technical</option>
              <option value="onsite">Onsite</option>
              <option value="offer">Offer Call</option>
            </select>
          </div>
          <div>
            <label htmlFor="from" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              From
            </label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              To
            </label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setStatus("all")
                setType("all")
                setFrom("")
                setTo("")
              }}
            >
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Views */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        {/* Calendar view */}
        <TabsContent value="calendar" className="space-y-4">
          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  {month.toLocaleString(undefined, { month: "long", year: "numeric" })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setMonth(addMonths(month, -1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setMonth(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setMonth(addMonths(month, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 text-xs text-gray-500 dark:text-gray-400 mb-2">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="px-2 py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((d) => {
                  const inMonth = d.getMonth() === month.getMonth()
                  const key = ymd(d)
                  const list = meetingsByDay.get(key) || []
                  const isToday = sameDay(d, new Date())
                  const isSelected = selectedDay ? sameDay(d, selectedDay) : false
                  return (
                    <div
                      key={key}
                      className={[
                        "min-h-[112px] rounded-md border p-2 transition-colors",
                        inMonth
                          ? "bg-white dark:bg-transparent border-gray-200 dark:border-[#1F1F23]"
                          : "bg-gray-50 dark:bg-[#0F0F12] border-gray-200/60 dark:border-[#1F1F23]",
                        isSelected ? "ring-2 ring-gray-900 dark:ring-zinc-50" : "",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDay(new Date(d))}
                        className="flex items-center justify-between w-full text-left"
                        aria-label={"Select day " + d.toDateString()}
                      >
                        <span
                          className={[
                            "text-xs",
                            inMonth ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
                          ].join(" ")}
                        >
                          {d.getDate()}
                        </span>
                        {isToday && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                            Today
                          </span>
                        )}
                      </button>
                      <div className="mt-2 space-y-1">
                        {list.slice(0, 3).map((m) => {
                          const a = applicantById[m.applicantId]
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => openMeeting(m)}
                              className={`w-full text-left text-[11px] px-1.5 py-0.5 rounded truncate ${
                                m.status === "scheduled"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : m.status === "completed"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                              aria-label={`View ${labelMeeting(m)} with ${a?.name ?? "candidate"}`}
                            >
                              {labelMeeting(m)} • {a?.name || "—"}
                            </button>
                          )
                        })}
                        {list.length > 3 && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">+{list.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected day details */}
          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader>
              <CardTitle className="text-sm">
                {selectedDay ? `Meetings on ${selectedDay.toDateString()}` : "Select a day to view meetings"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDay && selectedMeetings.length === 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">No meetings on this day.</div>
              )}
              <div className="grid gap-3">
                {selectedMeetings.map((m) => {
                  const a = applicantById[m.applicantId]
                  const j = jobById[m.jobId]
                  return (
                    <div
                      key={m.id}
                      className="rounded-lg border border-gray-200 dark:border-[#1F1F23] p-3 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_BADGE[m.status]}`}>
                          {STATUS_NAME[m.status]}
                        </span>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{labelMeeting(m)}</div>
                        <div className="ml-auto text-sm text-gray-700 dark:text-gray-300">
                          {formatDateTime(m.scheduledAt)}
                        </div>
                      </div>
                      <div className="grid gap-2 md:grid-cols-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <User className="h-4 w-4" />
                          <span>{a?.name || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Clock className="h-4 w-4" />
                          <span>{m.durationMins} mins</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="h-4 w-4" />
                          <span>{m.locationOrUrl || "—"}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Job: <span className="text-gray-900 dark:text-gray-100">{j?.title || "—"}</span> • Interviewer:{" "}
                        <span className="text-gray-900 dark:text-gray-100">{m.interviewer}</span>
                      </div>
                      {m.seriesId && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          Series: <span className="text-gray-900 dark:text-gray-100">{m.seriesId}</span>
                        </div>
                      )}
                      {m.notes && <div className="text-xs text-gray-600 dark:text-gray-400">Notes: {m.notes}</div>}

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" type="button" onClick={() => openMeeting(m)}>
                          View
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List view */}
        <TabsContent value="list">
          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader>
              <CardTitle>Meetings</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23]">
                  <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="px-4 py-2">Applicant</th>
                    <th className="px-4 py-2">Job</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">When</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">Interviewer</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Series</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => {
                    const a = applicantById[m.applicantId]
                    const j = jobById[m.jobId]
                    return (
                      <tr key={m.id} className="border-b border-gray-100 dark:border-[#1F1F23] align-top">
                        <td className="px-4 py-2 text-gray-900 dark:text-white">{a?.name || "—"}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{j?.title || "—"}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{labelMeeting(m)}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{formatDateTime(m.scheduledAt)}</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.durationMins}m</td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.interviewer}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_BADGE[m.status]}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.seriesId || "—"}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" type="button" onClick={() => openMeeting(m)}>
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                        No meetings found for current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle>Meeting details</DialogTitle>
            <DialogDescription>Review details and take actions.</DialogDescription>
          </DialogHeader>

          {active && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_BADGE[active.status]}`}>
                  {STATUS_NAME[active.status]}
                </span>
                <div className="text-sm font-medium">{labelMeeting(active)}</div>
                <div className="ml-auto text-sm text-gray-700 dark:text-gray-300">
                  {formatDateTime(active.scheduledAt)}
                </div>
              </div>

              <Separator />

              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span>Applicant:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ActiveDetails.applicant?.name || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{active.durationMins} mins</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>Location/Link:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{active.locationOrUrl || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>Job:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ActiveDetails.job?.title || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>Interviewer:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{active.interviewer}</span>
                </div>
                {active.seriesId && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Tag className="h-4 w-4" />
                    <span>Series:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{active.seriesId}</span>
                  </div>
                )}
              </div>

              {active.notes && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Notes:</span> {active.notes}
                </div>
              )}

              <Separator />

              {/* Reschedule */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Reschedule</div>
                <form action={actionRescheduleMeeting} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={active.id} />
                  <Input
                    name="scheduledAt"
                    type="datetime-local"
                    className="h-9"
                    defaultValue={toLocalDatetimeValue(active.scheduledAt)}
                    aria-label="New date/time"
                  />
                  <Input
                    name="durationMins"
                    type="number"
                    min={15}
                    step={15}
                    className="h-9 w-24"
                    defaultValue={active.durationMins}
                    aria-label="Duration minutes"
                  />
                  <Button size="sm" variant="outline" type="submit">
                    Save
                  </Button>
                </form>
              </div>

              {/* Create next round (optional multi-round workflow) */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Add next round</div>
                <form action={actionCreateNextRound} className="grid gap-2 md:grid-cols-2">
                  <input type="hidden" name="applicantId" value={active.applicantId} />
                  <input type="hidden" name="type" value={active.type} />
                  <input type="hidden" name="currentRound" value={active.round ?? 1} />
                  <input type="hidden" name="seriesId" value={active.seriesId ?? ""} />
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="scheduledAtNext">
                      When
                    </label>
                    <Input id="scheduledAtNext" name="scheduledAt" type="datetime-local" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="durationNext">
                      Duration (mins)
                    </label>
                    <Input id="durationNext" name="durationMins" type="number" min={15} step={15} defaultValue={60} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="interviewerNext">
                      Interviewer
                    </label>
                    <Input id="interviewerNext" name="interviewer" defaultValue={active.interviewer} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="locationNext">
                      Location or Link
                    </label>
                    <Input id="locationNext" name="locationOrUrl" placeholder="Zoom/Meet link or Office" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="notesNext">
                      Notes
                    </label>
                    <Input id="notesNext" name="notes" placeholder="Optional round-specific notes" />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button size="sm" type="submit">
                      Create next round
                    </Button>
                  </div>
                </form>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Next round will be created as R{(active.round ?? 1) + 1}
                  {active.seriesId ? ` in series ${active.seriesId}.` : " with a new series ID if none exists."}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <div />
            <div className="flex gap-2">
              {active && (
                <>
                  <form action={actionCompleteMeeting}>
                    <input type="hidden" name="id" value={active.id} />
                    <Button size="sm" type="submit" disabled={active.status !== "scheduled"}>
                      Mark complete
                    </Button>
                  </form>
                  <form action={actionCancelMeeting}>
                    <input type="hidden" name="id" value={active.id} />
                    <Button size="sm" variant="destructive" type="submit" disabled={active.status !== "scheduled"}>
                      Cancel
                    </Button>
                  </form>
                </>
              )}
              <Button size="sm" variant="outline" type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
