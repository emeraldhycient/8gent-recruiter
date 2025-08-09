import Layout from "@/components/kokonutui/layout"
import { getMembers, getRoles } from "@/lib/store"
import { actionAddRole, actionRemoveRole, actionSaveRolePerms } from "@/app/actions/team"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PERM_LABELS: Record<
  "manage_billing" | "manage_jobs" | "manage_applicants" | "view_reports" | "manage_team" | "edit_settings",
  string
> = {
  manage_billing: "Manage billing",
  manage_jobs: "Manage jobs",
  manage_applicants: "Manage applicants",
  view_reports: "View reports",
  manage_team: "Manage team",
  edit_settings: "Edit settings",
}

export default async function PermissionsPage() {
  const [roles, members] = await Promise.all([getRoles(), getMembers()])
  const assignedCount: Record<string, number> = roles.reduce(
    (acc, r) => {
      acc[r.id] = members.filter((m) => m.roleId === r.id).length
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Layout>
      <div className="space-y-4">
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle>Create role</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={actionAddRole} className="grid gap-3 md:grid-cols-3 max-w-3xl">
              <div className="md:col-span-1">
                <label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Role name
                </label>
                <Input id="name" name="name" placeholder="Coordinator" required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Input id="description" name="description" placeholder="What can this role do?" />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit">Add Role</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle>Roles & permissions</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23]">
                <tr className="text-left text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-2 min-w-[200px]">Role</th>
                  {Object.values(PERM_LABELS).map((label) => (
                    <th key={label} className="px-4 py-2">
                      {label}
                    </th>
                  ))}
                  <th className="px-4 py-2">Assigned</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-[#1F1F23] align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{r.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{r.description || "—"}</div>
                      {r.system && <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">System role</div>}
                    </td>
                    <td colSpan={Object.keys(PERM_LABELS).length + 2} className="px-4 py-3">
                      <div className="space-y-2">
                        {/* Save permissions form */}
                        <form action={actionSaveRolePerms} className="space-y-2">
                          <input type="hidden" name="roleId" value={r.id} />
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                            {(Object.keys(PERM_LABELS) as (keyof typeof PERM_LABELS)[]).map((k) => (
                              <label
                                key={k}
                                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                              >
                                <input
                                  type="checkbox"
                                  name={k}
                                  defaultChecked={!!r.permissions[k]}
                                  className="h-4 w-4"
                                  aria-label={PERM_LABELS[k]}
                                />
                                <span className="truncate">{PERM_LABELS[k]}</span>
                              </label>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Assigned: <span className="tabular-nums">{assignedCount[r.id] || 0}</span>
                            </div>
                            <Button type="submit" size="sm" variant="outline">
                              Save
                            </Button>
                          </div>
                        </form>

                        {/* Remove role form (separate form to avoid nesting) */}
                        <div className="flex items-center justify-end">
                          <form action={actionRemoveRole}>
                            <input type="hidden" name="roleId" value={r.id} />
                            <Button
                              type="submit"
                              size="sm"
                              variant="destructive"
                              disabled={r.system || (assignedCount[r.id] || 0) > 0}
                              title={
                                r.system
                                  ? "System roles cannot be removed"
                                  : (assignedCount[r.id] || 0) > 0
                                    ? "Role is assigned to members"
                                    : "Remove role"
                              }
                            >
                              Remove
                            </Button>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                      No roles yet. Create one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
