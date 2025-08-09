import Layout from "@/components/kokonutui/layout"
import { getApplicants, getJobs } from "@/lib/store"
import ApplicantTable from "@/components/hiring/applicant-table"

export default async function ApplicantsPage() {
  const [apps, jobs] = await Promise.all([getApplicants(), getJobs()])
  const jobTitleById = Object.fromEntries(jobs.map((j) => [j.id, j.title]))

  return (
    <Layout>
      <ApplicantTable applicants={apps} showJobColumn jobTitleById={jobTitleById} />
    </Layout>
  )
}
