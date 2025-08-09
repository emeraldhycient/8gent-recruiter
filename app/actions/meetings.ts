"use server"

import { revalidatePath } from "next/cache"
import { cancelMeeting, createMeeting, rescheduleMeeting, setMeetingStatus } from "@/lib/store"

export async function actionCreateMeeting(formData: FormData) {
  const applicantId = String(formData.get("applicantId") || "")
  const type = String(formData.get("type") || "") as any
  const scheduledAt = String(formData.get("scheduledAt") || "")
  const durationMins = Number(formData.get("durationMins") || 30)
  const interviewer = String(formData.get("interviewer") || "").trim()
  const locationOrUrl = String(formData.get("locationOrUrl") || "").trim()
  const notes = String(formData.get("notes") || "").trim()

  if (!applicantId || !type || !scheduledAt || !interviewer) {
    return { ok: false, error: "Missing required fields." } as const
  }

  await createMeeting({ applicantId, type, scheduledAt, durationMins, interviewer, locationOrUrl, notes })
  revalidatePath("/team/meetings")
  return { ok: true } as const
}

export async function actionRescheduleMeeting(formData: FormData) {
  const id = String(formData.get("id") || "")
  const scheduledAt = String(formData.get("scheduledAt") || "")
  const durationMins = Number(formData.get("durationMins") || 30)
  if (!id || !scheduledAt) return { ok: false } as const
  await rescheduleMeeting(id, scheduledAt, durationMins)
  revalidatePath("/team/meetings")
  return { ok: true } as const
}

export async function actionCompleteMeeting(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  await setMeetingStatus(id, "completed")
  revalidatePath("/team/meetings")
  return { ok: true } as const
}

export async function actionCancelMeeting(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  await cancelMeeting(id)
  revalidatePath("/team/meetings")
  return { ok: true } as const
}
