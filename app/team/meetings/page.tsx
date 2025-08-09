import Layout from "@/components/kokonutui/layout"
import { getApplicants, getJobs, getMeetings } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import MeetingsClient from "@/components/meetings/meetings-client"
import { actionCreateMeeting } from "@/app/actions/meetings"

export default async function MeetingsPage() {
  const [meetings, applicants, jobs] = await Promise.all([getMeetings(), getApplicants(), getJobs()])
  const jobById = Object.fromEntries(jobs.map((j) => [j.id, j]))

  return (
    <Layout>
      <div className="space-y-4">
        {/* Schedule meeting */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle>Schedule meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={actionCreateMeeting} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label htmlFor="applicantId" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Applicant
                </label>
                <select
                  id="applicantId"
                  name="applicantId"
                  className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  required
                >
                  <option value="">Select applicant…</option>
                  {applicants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} • {jobById[a.jobId]?.title || "—"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  defaultValue="phone_screen"
                >
                  <option value="phone_screen">Phone Screen</option>
                  <option value="technical">Technical Interview</option>
                  <option value="onsite">Onsite</option>
                  <option value="offer">Offer Call</option>
                </select>
              </div>

              <div>
                <label htmlFor="scheduledAt" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  When
                </label>
                <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
              </div>

              <div>
                <label htmlFor="durationMins" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Duration (mins)
                </label>
                <Input id="durationMins" name="durationMins" type="number" min={15} step={15} defaultValue={30} />
              </div>

              <div>
                <label htmlFor="interviewer" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Interviewer
                </label>
                <Input id="interviewer" name="interviewer" placeholder="e.g., You" required />
              </div>

              <div>
                <label htmlFor="locationOrUrl" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Location or Link
                </label>
                <Input id="locationOrUrl" name="locationOrUrl" placeholder="Zoom/Meet link or Office" />
              </div>

              {/* Optional multi-round fields */}
              <div>
                <label htmlFor="round" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Round (optional)
                </label>
                <Input id="round" name="round" type="number" min={1} placeholder="e.g., 1 or 2" />
              </div>

              <div>
                <label htmlFor="seriesId" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Series ID (optional)
                </label>
                <Input id="seriesId" name="seriesId" placeholder="e.g., series_candidate_123" />
              </div>

              <div className="xl:col-span-3">
                <label htmlFor="notes" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <Textarea id="notes" name="notes" rows={3} placeholder="Any prep notes for interviewers" />
              </div>

              <div className="xl:col-span-3 flex justify-end">
                <Button type="submit">Schedule</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Filters + Calendar/List views */}
        <MeetingsClient meetings={meetings} applicants={applicants} jobs={jobs} />
      </div>
    </Layout>
  )
}
