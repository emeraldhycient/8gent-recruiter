import Layout from "@/components/kokonutui/layout"
import { actionCreateJob } from "@/app/actions/hiring"
import { redirect } from "next/navigation"

export default function NewJobPage() {
  async function create(formData: FormData) {
    "use server"
    const res = await actionCreateJob(formData)
    if (res.ok) redirect(`/job/${res.id}`)
    return res
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
          <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Post a new job</h1>
          </div>
          <div className="p-4">
            <form action={create} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    required
                    placeholder="Senior Frontend Engineer"
                    className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    id="department"
                    name="department"
                    placeholder="Engineering"
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
                  <label htmlFor="employmentType" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Describe the role, responsibilities, etc."
                  className="w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={6}
                  placeholder={"React\nTypeScript\nAccessibility"}
                  className="w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3 py-2"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 h-10 rounded-md bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:opacity-90"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
