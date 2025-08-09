import Layout from "@/components/kokonutui/layout"
import { getApplicants, getJobs } from "@/lib/store"
import RecruiterAnalytics from "@/components/dashboard/recruiter-analytics"
import type { Applicant, Job } from "@/lib/types"

type PipelineCounts = Record<Applicant["stage"], number>

function pipelineCounts(applicants: Applicant[]): PipelineCounts {
  const stages: Applicant["stage"][] = ["new", "reviewed", "interview", "offer", "hired", "rejected"]
  return stages.reduce((acc, s) => {
    acc[s] = applicants.filter((a) => a.stage === s).length
    return acc
  }, {} as PipelineCounts)
}

function sourceBreakdown(applicants: Applicant[]) {
  const map = new Map<string, number>()
  for (const a of applicants) {
    map.set(a.source || "Other", (map.get(a.source || "Other") || 0) + 1)
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

function applicantsByDay(applicants: Applicant[], days = 14) {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - (days - 1))
  // Initialize buckets
  const buckets: Record<string, number> = {}
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    buckets[key] = 0
  }
  // Fill from applicants
  for (const a of applicants) {
    const key = a.createdAt.slice(0, 10)
    if (key in buckets) buckets[key]++
  }
  return Object.entries(buckets).map(([date, count]) => ({ date, count }))
}

function jobsByDepartment(jobs: Job[]) {
  const map = new Map<string, number>()
  for (const j of jobs) {
    const dep = j.department || "Unassigned"
    map.set(dep, (map.get(dep) || 0) + 1)
  }
  return Array.from(map.entries()).map(([department, jobs]) => ({ department, jobs }))
}

function avgDaysToHire(applicants: Applicant[]) {
  const hired = applicants.filter((a) => a.stage === "hired")
  if (!hired.length) return 0
  const days = hired.map((a) => {
    const created = new Date(a.createdAt).getTime()
    const updated = new Date(a.updatedAt).getTime()
    return Math.max(0, (updated - created) / (1000 * 60 * 60 * 24))
  })
  const avg = days.reduce((s, d) => s + d, 0) / days.length
  return Math.round(avg)
}

export default async function DashboardPage() {
  const [jobs, applicants] = await Promise.all([getJobs(), getApplicants()])

  const openJobs = jobs.filter((j) => j.status === "published")
  const counts = pipelineCounts(applicants)
  const offers = counts.offer
  const hires = counts.hired
  const acceptanceRate = offers > 0 ? Math.round((hires / offers) * 100) : 0
  const applicantsPerOpen = openJobs.length ? Math.round((applicants.length / openJobs.length) * 10) / 10 : 0
  const avgFill = avgDaysToHire(applicants)

  const kpis = {
    totalJobs: jobs.length,
    openJobs: openJobs.length,
    totalApplicants: applicants.length,
    interviews: counts.interview,
    offers,
    hires,
    acceptanceRate,
    applicantsPerOpen,
    avgDaysToHire: avgFill,
  }

  const charts = {
    pipeline: Object.entries(counts).map(([stage, value]) => ({ stage, value })) as { stage: string; value: number }[],
    sources: sourceBreakdown(applicants),
    applicantsTrend: applicantsByDay(applicants, 14),
    dept: jobsByDepartment(jobs),
  }

  return (
    <Layout>
      <RecruiterAnalytics kpis={kpis} charts={charts} />
    </Layout>
  )
}
