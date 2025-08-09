"use client"

import { useMemo, useState } from "react"
import type { Applicant } from "@/lib/types"
import { StageBadge } from "./status-badges"
import { actionMoveApplicant } from "@/app/actions/hiring"

const STAGES: Applicant["stage"][] = ["new", "reviewed", "interview", "offer", "hired", "rejected"]

export default function ApplicantTable({
  applicants = [],
  showJobColumn = false,
  jobTitleById = {},
}: {
  applicants?: Applicant[]
  showJobColumn?: boolean
  jobTitleById?: Record<string, string>
}) {
  const [q, setQ] = useState("")
  const [stage, setStage] = useState<"all" | Applicant["stage"]>("all")

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const matchesQ =
        !q ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.email.toLowerCase().includes(q.toLowerCase()) ||
        a.location.toLowerCase().includes(q.toLowerCase())
      const matchesStage = stage === "all" ? true : a.stage === stage
      return matchesQ && matchesStage
    })
  }, [applicants, q, stage])

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
      <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23] flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search applicants..."
            className="h-9 w-[240px] rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-2 text-sm"
          />
          <select
            aria-label="Filter by stage"
            className="h-9 rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-2 text-sm"
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
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filtered.length} applicant{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23]">
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Location</th>
              {showJobColumn && <th className="px-4 py-2">Job</th>}
              <th className="px-4 py-2">Stage</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2">Updated</th>
              <th className="px-4 py-2">Advance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 dark:border-[#1F1F23]">
                <td className="px-4 py-2 text-gray-900 dark:text-white">{a.name}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.email}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.location}</td>
                {showJobColumn && (
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{jobTitleById[a.jobId] || "—"}</td>
                )}
                <td className="px-4 py-2">
                  <StageBadge stage={a.stage} />
                </td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.source}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{new Date(a.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1.5">
                    {STAGES.map((s) => (
                      <form
                        key={s}
                        action={async () => {
                          await actionMoveApplicant(a.id, s)
                        }}
                      >
                        <button
                          type="submit"
                          className={`px-2.5 py-1 text-xs rounded-md border ${
                            s === a.stage
                              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                              : "border-gray-300 dark:border-[#2B2B30] hover:bg-gray-50 dark:hover:bg-[#1F1F23] text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {s}
                        </button>
                      </form>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
