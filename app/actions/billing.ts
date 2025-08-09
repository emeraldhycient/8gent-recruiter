"use server"

import { revalidatePath } from "next/cache"
import { addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } from "@/lib/store"

export async function actionAddPaymentMethod(formData: FormData) {
  const brand = String(formData.get("brand") || "").trim()
  const last4 = String(formData.get("last4") || "").trim()
  const exp = String(formData.get("exp") || "").trim()
  const makeDefault = String(formData.get("makeDefault") || "") === "on"

  const [m, y] = exp.split("/")
  const expMonth = Number(m)
  const expYear = Number("20" + (y || ""))

  if (!brand || !/^\d{4}$/.test(last4) || !(expMonth >= 1 && expMonth <= 12) || !(expYear >= 2024 && expYear <= 2100)) {
    return { ok: false, error: "Invalid fields" } as const
  }

  await addPaymentMethod({ brand, last4, expMonth, expYear, makeDefault })
  revalidatePath("/billing/methods")
  return { ok: true } as const
}

export async function actionSetDefaultMethod(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  await setDefaultPaymentMethod(id)
  revalidatePath("/billing/methods")
  return { ok: true } as const
}

export async function actionRemoveMethod(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  await removePaymentMethod(id)
  revalidatePath("/billing/methods")
  return { ok: true } as const
}
