import { getApplicants, getJobs } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ReportsPage() {
  const [jobs, applicants] = await Promise.all([getJobs(), getApplicants()])
  const hires = applicants.filter((a) => a.stage === "hired").length
  const offers = applicants.filter((a) => a.stage === "offer").length
  const interviews = applicants.filter((a) => a.stage === "interview").length
  const timeToFillAvg = 21 // demo number

  const metricClasses = "rounded-xl border p-4 bg-card text-card-foreground hover:shadow-sm transition-colors"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className={metricClasses}>
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-sm text-muted-foreground">Open Jobs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-semibold">{jobs.filter((j) => j.status === "published").length}</div>
          </CardContent>
        </Card>
        <Card className={metricClasses}>
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-sm text-muted-foreground">Interviews</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-semibold">{interviews}</div>
          </CardContent>
        </Card>
        <Card className={metricClasses}>
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-sm text-muted-foreground">Offers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-semibold">{offers}</div>
          </CardContent>
        </Card>
        <Card className={metricClasses}>
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg. Time to Fill</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-semibold">{timeToFillAvg}d</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add real analytics by connecting a DB and your ATS sources. This demo uses a seeded in-memory store.
        </CardContent>
      </Card>
    </div>
  )
}
