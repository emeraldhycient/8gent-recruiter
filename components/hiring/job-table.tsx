"use client"

import { useMemo, useState } from "react"
import type { Job } from "@/lib/types"
import { JobStatusBadge } from "./status-badges"

export default function JobTable({ jobs = [] as Job[] }) {
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
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
      <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23] flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs..."
            className="h-9 w-[220px] rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-2 text-sm"
          />
          <select
            aria-label="Filter by status"
            className="h-9 rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filtered.length} job{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23]">
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="px-4 py-2 min-w-[220px]">Title</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Applicants</th>
              <th className="px-4 py-2">Updated</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id} className="border-b border-gray-100 dark:border-[#1F1F23]">
                <td className="px-4 py-2 text-gray-900 dark:text-white">{j.title}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{j.department}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{j.location}</td>
                <td className="px-4 py-2 capitalize text-gray-700 dark:text-gray-300">
                  {j.employmentType.replace("-", " ")}
                </td>
                <td className="px-4 py-2">
                  <JobStatusBadge status={j.status} />
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-900 dark:text-gray-100">
                  {j.applicantsCount}
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{new Date(j.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <a
                    href={`/job/${j.id}`}
                    className="inline-flex items-center px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-[#2B2B30] hover:bg-gray-50 dark:hover:bg-[#1F1F23] text-gray-900 dark:text-gray-100"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-600 dark:text-gray-400" colSpan={8}>
                  No jobs found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
