import Layout from "@/components/kokonutui/layout"
import { getJobs } from "@/lib/store"
import JobTable from "@/components/hiring/job-table"

export default async function JobsPage() {
  const jobs = await getJobs()

  const stats = {
    total: jobs.length,
    published: jobs.filter((j) => j.status === "published").length,
    draft: jobs.filter((j) => j.status === "draft").length,
    closed: jobs.filter((j) => j.status === "closed").length,
    applicants: jobs.reduce((acc, j) => acc + j.applicantsCount, 0),
  }

  return (
    <Layout>
      <div className="space-y-4">
        {/* Metrics row styled like the original cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Jobs", value: stats.total },
            { label: "Published", value: stats.published },
            { label: "Drafts", value: stats.draft },
            { label: "Closed", value: stats.closed },
            { label: "Applicants", value: stats.applicants },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl p-4 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">{m.label}</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{m.value}</div>
            </div>
          ))}
        </div>

        <JobTable jobs={jobs} />
      </div>
    </Layout>
  )
}
