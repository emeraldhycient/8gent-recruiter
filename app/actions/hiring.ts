"use server"

import { revalidatePath } from "next/cache"
import { addApplicantToJob, createJob, moveApplicantStage, setJobStatus } from "@/lib/store"
import type { EmploymentType, Stage } from "@/lib/types"

/* Jobs */
export async function actionCreateJob(formData: FormData) {
  const title = String(formData.get("title") || "").trim()
  const department = String(formData.get("department") || "").trim()
  const location = String(formData.get("location") || "").trim()
  const employmentType = String(formData.get("employmentType") || "full-time").trim() as EmploymentType
  const description = String(formData.get("description") || "").trim()
  const requirements = String(formData.get("requirements") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)

  if (!title) {
    return { ok: false, error: "Title is required" } as const
  }

  const job = await createJob({ title, department, location, employmentType, description, requirements })
  revalidatePath("/jobs")
  revalidatePath(`/job/${job.id}`)
  return { ok: true, id: job.id } as const
}

export async function actionSetJobStatus(jobId: string, status: "draft" | "published" | "closed") {
  await setJobStatus(jobId, status)
  revalidatePath("/jobs")
  revalidatePath(`/job/${jobId}`)
  return { ok: true } as const
}

/* Applicants */
export async function actionAddApplicant(formData: FormData) {
  const jobId = String(formData.get("jobId") || "")
  const name = String(formData.get("name") || "")
  const email = String(formData.get("email") || "")
  const location = String(formData.get("location") || "")
  const source = String(formData.get("source") || "Manual")

  if (!jobId || !name || !email) {
    return { ok: false, error: "Missing fields" } as const
  }

  await addApplicantToJob({ jobId, name, email, location, source })
  revalidatePath(`/job/${jobId}`)
  revalidatePath("/applicants")
  return { ok: true } as const
}

export async function actionMoveApplicant(applicantId: string, stage: Stage) {
  await moveApplicantStage(applicantId, stage)
  revalidatePath("/applicants")
  return { ok: true } as const
}
