"use server"

import { revalidatePath } from "next/cache"
import {
  addRole,
  getMembers,
  removeMember,
  removeRole,
  setMemberRole,
  setMemberStatus,
  updateRolePermissions,
  inviteMember as storeInviteMember,
} from "@/lib/store"

export async function actionInviteMember(formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const roleId = String(formData.get("roleId") || "").trim()
  if (!name || !email || !roleId) return { ok: false, error: "Missing fields" } as const

  await storeInviteMember({ name, email, roleId })
  revalidatePath("/team/members")
  return { ok: true } as const
}

export async function actionRemoveMember(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  await removeMember(id)
  revalidatePath("/team/members")
  return { ok: true } as const
}

export async function actionSetMemberRole(formData: FormData) {
  const id = String(formData.get("id") || "")
  const roleId = String(formData.get("roleId") || "")
  if (!id || !roleId) return { ok: false } as const
  await setMemberRole(id, roleId)
  revalidatePath("/team/members")
  return { ok: true } as const
}

export async function actionResendInvite(formData: FormData) {
  // Demo: no-op, could trigger email webhook
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  // Ensure member still exists
  const members = await getMembers()
  if (!members.find((m) => m.id === id)) return { ok: false } as const
  revalidatePath("/team/members")
  return { ok: true } as const
}

export async function actionSuspendMember(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  await setMemberStatus(id, "suspended")
  revalidatePath("/team/members")
  return { ok: true } as const
}

export async function actionActivateMember(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) return { ok: false } as const
  await setMemberStatus(id, "active")
  revalidatePath("/team/members")
  return { ok: true } as const
}

/* Roles & permissions */
export async function actionAddRole(formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  const description = String(formData.get("description") || "").trim()
  if (!name) return { ok: false, error: "Name required" } as const
  await addRole({ name, description })
  revalidatePath("/team/permissions")
  return { ok: true } as const
}

export async function actionSaveRolePerms(formData: FormData) {
  const roleId = String(formData.get("roleId") || "")
  if (!roleId) return { ok: false } as const
  const keys = [
    "manage_billing",
    "manage_jobs",
    "manage_applicants",
    "view_reports",
    "manage_team",
    "edit_settings",
  ] as const
  const perms: Record<string, boolean> = {}
  for (const k of keys) {
    perms[k] = String(formData.get(k) || "") === "on"
  }
  await updateRolePermissions(roleId, perms as any)
  revalidatePath("/team/permissions")
  return { ok: true } as const
}

export async function actionRemoveRole(formData: FormData) {
  const roleId = String(formData.get("roleId") || "")
  if (!roleId) return { ok: false } as const
  await removeRole(roleId)
  revalidatePath("/team/permissions")
  return { ok: true } as const
}
