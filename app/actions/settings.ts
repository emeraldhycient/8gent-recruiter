"use server"

import { revalidatePath } from "next/cache"
import { updateSettings } from "@/lib/settings"

export async function actionSaveSettings(formData: FormData) {
  const brandColor = String(formData.get("brandColor") || "").trim() || undefined
  const careersUrl = String(formData.get("careersUrl") || "").trim() || undefined
  const meetingProvider = String(formData.get("meetingProvider") || "").trim() || undefined
  // Note: For demo purposes only. In production, store provider secrets in a secure secret manager or envs.
  const meetingApiKey = String(formData.get("meetingApiKey") || "").trim()

  await updateSettings({
    brandColor,
    careersUrl,
    meetingProvider: meetingProvider as any,
    // Persist as provided. Consider redaction/masking on read if needed.
    meetingApiKey,
  })

  revalidatePath("/settings")
  return { ok: true } as const
}
