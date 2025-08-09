import Layout from "@/components/kokonutui/layout"
import { notFound } from "next/navigation"
import { getApplicants, getJob } from "@/lib/store"
import { actionAddApplicant, actionSetJobStatus } from "@/app/actions/hiring"
import { JobStatusBadge, StageBadge } from "@/components/hiring/status-badges"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)
  if (!job) return notFound()
  const applicants = await getApplicants(job.id)

  const counts = applicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.stage] = (acc[a.stage] || 0) + 1
    return acc
  }, {})

  async function publish() {
    "use server"
    await actionSetJobStatus(job.id, "published")
  }
  async function close() {
    "use server"
    await actionSetJobStatus(job.id, "closed")
  }
  async function revertToDraft() {
    "use server"
    await actionSetJobStatus(job.id, "draft")
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
            <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h1>
                <JobStatusBadge status={job.status} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {job.department} • {job.location} • {job.employmentType.replace("-", " ")}
              </p>
            </div>
            <div className="p-4 space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.description || "No description provided."}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Requirements</h3>
                {job.requirements.length ? (
                  <ul className="list-disc pl-4 text-gray-700 dark:text-gray-300">
                    {job.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">No requirements listed.</p>
                )}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Updated {new Date(job.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
            <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Actions</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Manage job status</p>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              <form action={publish}>
                <button
                  type="submit"
                  className="px-3 h-9 rounded-md bg-gray-900 text-white dark:bg-zinc-50 dark:text-zinc-900 disabled:opacity-50"
                  disabled={job.status === "published"}
                >
                  Publish
                </button>
              </form>
              <form action={revertToDraft}>
                <button
                  type="submit"
                  className="px-3 h-9 rounded-md border border-gray-300 dark:border-[#2B2B30] hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
                  disabled={job.status === "draft"}
                >
                  Mark Draft
                </button>
              </form>
              <form action={close}>
                <button
                  type="submit"
                  className="px-3 h-9 rounded-md bg-red-600 text-white disabled:opacity-50"
                  disabled={job.status === "closed"}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
          <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Applicants ({job.applicantsCount})</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm mb-4">
              {(["new", "reviewed", "interview", "offer", "hired", "rejected"] as const).map((stage) => (
                <div
                  key={stage}
                  className="rounded-md border border-gray-200 dark:border-[#1F1F23] p-2 flex items-center justify-between"
                >
                  <span className="capitalize text-gray-700 dark:text-gray-300">{stage}</span>
                  <span className="font-medium tabular-nums text-gray-900 dark:text-gray-100">
                    {counts[stage] || 0}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {(["new", "reviewed", "interview", "offer", "hired", "rejected"] as const).map((s) => {
                const list = applicants.filter((a) => a.stage === s)
                return (
                  <div key={s} className="rounded-xl border border-gray-200 dark:border-[#1F1F23]">
                    <div className="p-3 border-b border-gray-200 dark:border-[#1F1F23] flex items-center gap-2">
                      <StageBadge stage={s} />
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">{s}</span>
                      <span className="ml-auto text-xs text-gray-600 dark:text-gray-400">{list.length}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      {list.map((a) => (
                        <div key={a.id} className="rounded-md border border-gray-200 dark:border-[#1F1F23] p-3">
                          <div className="font-medium text-gray-900 dark:text-white">{a.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{a.email}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {(["new", "reviewed", "interview", "offer", "hired", "rejected"] as const).map((target) => (
                              <form
                                key={target + a.id}
                                action={async () => {
                                  "use server"
                                  const { actionMoveApplicant } = await import("@/app/actions/hiring")
                                  await actionMoveApplicant(a.id, target)
                                }}
                              >
                                <button
                                  type="submit"
                                  className={`px-2.5 py-1 text-xs rounded-md border ${
                                    target === a.stage
                                      ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                                      : "border-gray-300 dark:border-[#2B2B30] hover:bg-gray-50 dark:hover:bg-[#1F1F23] text-gray-900 dark:text-gray-100"
                                  }`}
                                >
                                  {target}
                                </button>
                              </form>
                            ))}
                          </div>
                        </div>
                      ))}
                      {list.length === 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 py-4 text-center">No applicants</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
          <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Add an applicant</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Attach a candidate to this job</p>
          </div>
          <div className="p-4">
            <form action={actionAddApplicant} className="space-y-3 max-w-xl">
              <input type="hidden" name="jobId" value={job.id} />
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="jane@example.com"
                    className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    placeholder="Remote"
                    className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  />
                </div>
                <div>
                  <label htmlFor="source" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Source
                  </label>
                  <input
                    id="source"
                    name="source"
                    placeholder="Referral"
                    className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Optional recruiter notes (not saved in demo)"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3 py-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 h-10 rounded-md bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:opacity-90"
                >
                  Add Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
