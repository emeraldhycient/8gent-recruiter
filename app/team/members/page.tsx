import Layout from "@/components/kokonutui/layout"
import { getMembers, getRoles } from "@/lib/store"
import {
  actionActivateMember,
  actionInviteMember,
  actionRemoveMember,
  actionResendInvite,
  actionSetMemberRole,
  actionSuspendMember,
} from "@/app/actions/team"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function MembersPage() {
  const [members, roles] = await Promise.all([getMembers(), getRoles()])
  const roleById = Object.fromEntries(roles.map((r) => [r.id, r.name]))

  return (
    <Layout>
      <div className="space-y-4">
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={actionInviteMember} className="grid gap-3 md:grid-cols-3 max-w-3xl">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <Input id="name" name="name" placeholder="Jane Doe" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
              </div>
              <div>
                <label htmlFor="roleId" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  className="h-10 w-full rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-3"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit">Send Invite</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle>Team members</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23]">
                <tr className="text-left text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Last Active</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 dark:border-[#1F1F23]">
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{m.name}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.email}</td>
                    <td className="px-4 py-2">
                      <form action={actionSetMemberRole} className="inline-flex">
                        <input type="hidden" name="id" value={m.id} />
                        <select
                          name="roleId"
                          defaultValue={m.roleId}
                          className="h-8 rounded-md border border-gray-300 dark:border-[#2B2B30] bg-white dark:bg-[#0F0F12] px-2 text-sm"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        <Button type="submit" variant="outline" size="sm" className="ml-2 bg-transparent">
                          Save
                        </Button>
                      </form>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                          m.status === "active"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : m.status === "invited"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {m.status === "invited" && (
                          <form action={actionResendInvite}>
                            <input type="hidden" name="id" value={m.id} />
                            <Button variant="outline" size="sm" type="submit">
                              Resend invite
                            </Button>
                          </form>
                        )}
                        {m.status !== "suspended" && (
                          <form action={actionSuspendMember}>
                            <input type="hidden" name="id" value={m.id} />
                            <Button variant="outline" size="sm" type="submit">
                              Suspend
                            </Button>
                          </form>
                        )}
                        {m.status === "suspended" && (
                          <form action={actionActivateMember}>
                            <input type="hidden" name="id" value={m.id} />
                            <Button variant="outline" size="sm" type="submit">
                              Activate
                            </Button>
                          </form>
                        )}
                        {/* Prevent self-remove by name heuristic in demo */}
                        {m.name !== "You" && (
                          <form action={actionRemoveMember}>
                            <input type="hidden" name="id" value={m.id} />
                            <Button variant="destructive" size="sm" type="submit">
                              Remove
                            </Button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                      No members yet. Invite your team above.
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
