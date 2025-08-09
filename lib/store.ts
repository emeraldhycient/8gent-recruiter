import type {
  Applicant,
  EmploymentType,
  Invoice,
  Job,
  JobStatus,
  Payment,
  PaymentMethod,
  Stage,
  Role,
  TeamMember,
  PermissionKey,
  Meeting,
  MeetingStatus,
  MeetingType,
} from "./types"

type DB = {
  jobs: Job[]
  applicants: Applicant[]
  invoices: Invoice[]
  payments: Payment[]
  paymentMethods: PaymentMethod[]
  roles: Role[]
  members: TeamMember[]
  meetings: Meeting[]
}

declare global {
  // eslint-disable-next-line no-var
  var __MEM_DB__: DB | undefined
}

function seed(): DB {
  const now = new Date()
  const iso = (d: Date) => d.toISOString()

  const jobs: Job[] = [
    {
      id: "job_1",
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote",
      employmentType: "full-time",
      description: "Lead frontend initiatives and ship high-quality UI.",
      requirements: ["React", "TypeScript", "Accessibility"],
      status: "published",
      applicantsCount: 4,
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 2)),
    },
    {
      id: "job_2",
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      employmentType: "full-time",
      description: "Design delightful, accessible product experiences.",
      requirements: ["Figma", "User Research", "Prototyping"],
      status: "draft",
      applicantsCount: 1,
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 10)),
    },
    {
      id: "job_3",
      title: "Customer Success Manager",
      department: "Operations",
      location: "Austin, TX",
      employmentType: "full-time",
      description: "Drive adoption and ensure customer happiness.",
      requirements: ["Communication", "SaaS", "Problem Solving"],
      status: "published",
      applicantsCount: 2,
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 35)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 30)),
    },
  ]

  const applicants: Applicant[] = [
    {
      id: "app_1",
      jobId: "job_1",
      name: "Alex Johnson",
      email: "alex@example.com",
      location: "New York, NY",
      stage: "new",
      source: "LinkedIn",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    },
    {
      id: "app_2",
      jobId: "job_1",
      name: "Priya Narayanan",
      email: "priya@example.com",
      location: "Remote",
      stage: "reviewed",
      source: "Referral",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 22)),
    },
    {
      id: "app_3",
      jobId: "job_1",
      name: "Miguel Santos",
      email: "miguel@example.com",
      location: "Madrid, ES",
      stage: "interview",
      source: "Careers Page",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 12)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 1)),
    },
    {
      id: "app_4",
      jobId: "job_2",
      name: "Lina Park",
      email: "lina@example.com",
      location: "San Jose, CA",
      stage: "new",
      source: "Dribbble",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 8)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 8)),
    },
    {
      id: "app_5",
      jobId: "job_3",
      name: "Chris Moore",
      email: "chris@example.com",
      location: "Austin, TX",
      stage: "reviewed",
      source: "Indeed",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 5)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 45)),
    },
    {
      id: "app_6",
      jobId: "job_3",
      name: "Fatima Zahra",
      email: "fatima@example.com",
      location: "Remote",
      stage: "offer",
      source: "Referral",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 72)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 30)),
    },
  ]

  const invoices: Invoice[] = [
    {
      id: "inv_1001",
      number: "INV-1001",
      amount: 4900,
      status: "paid",
      issuedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60)),
      dueAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45)),
      paidAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 46)),
    },
    {
      id: "inv_1002",
      number: "INV-1002",
      amount: 4900,
      status: "paid",
      issuedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)),
      dueAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15)),
      paidAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 16)),
    },
    {
      id: "inv_1003",
      number: "INV-1003",
      amount: 4900,
      status: "open",
      issuedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
      dueAt: iso(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14)),
    },
  ]

  const payments: Payment[] = [
    {
      id: "pay_1",
      amount: 4900,
      date: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 46)),
      methodBrand: "Visa",
      methodLast4: "4242",
      status: "succeeded",
      invoiceId: "inv_1001",
      invoiceNumber: "INV-1001",
    },
    {
      id: "pay_2",
      amount: 4900,
      date: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 16)),
      methodBrand: "Mastercard",
      last4: "4444",
      status: "succeeded",
      methodLast4: "4444",
      invoiceId: "inv_1002",
      invoiceNumber: "INV-1002",
    } as any,
    {
      id: "pay_3",
      amount: 4900,
      date: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
      methodBrand: "Visa",
      methodLast4: "4242",
      status: "failed",
    },
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: "pm_1",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: new Date().getFullYear() + 2,
      isDefault: true,
    },
    {
      id: "pm_2",
      brand: "Mastercard",
      last4: "4444",
      expMonth: 9,
      expYear: new Date().getFullYear() + 3,
      isDefault: false,
    },
  ]

  const roles: Role[] = [
    {
      id: "role_owner",
      name: "Owner",
      system: true,
      description: "Full access, including billing and team management.",
      permissions: {
        manage_billing: true,
        manage_jobs: true,
        manage_applicants: true,
        view_reports: true,
        manage_team: true,
        edit_settings: true,
      },
    },
    {
      id: "role_admin",
      name: "Admin",
      system: true,
      description: "Manage jobs, applicants, and settings.",
      permissions: {
        manage_billing: false,
        manage_jobs: true,
        manage_applicants: true,
        view_reports: true,
        manage_team: false,
        edit_settings: true,
      },
    },
    {
      id: "role_recruiter",
      name: "Recruiter",
      system: true,
      description: "Create jobs and move candidates through pipeline.",
      permissions: {
        manage_billing: false,
        manage_jobs: true,
        manage_applicants: true,
        view_reports: true,
        manage_team: false,
        edit_settings: false,
      },
    },
    {
      id: "role_reviewer",
      name: "Reviewer",
      system: true,
      description: "View candidates and leave feedback.",
      permissions: {
        manage_billing: false,
        manage_jobs: false,
        manage_applicants: true,
        view_reports: true,
        manage_team: false,
        edit_settings: false,
      },
    },
  ]

  const members: TeamMember[] = [
    {
      id: "mem_1",
      name: "You",
      email: "you@example.com",
      roleId: "role_owner",
      status: "active",
      lastActiveAt: iso(new Date(now.getTime() - 1000 * 60 * 20)),
    },
    {
      id: "mem_2",
      name: "Dana Kim",
      email: "dana@example.com",
      roleId: "role_admin",
      status: "active",
      lastActiveAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 12)),
    },
    {
      id: "mem_3",
      name: "Sam Patel",
      email: "sam@example.com",
      roleId: "role_recruiter",
      status: "invited",
    },
  ]

  // Seed meetings
  const meetings: Meeting[] = [
    {
      id: "meet_1",
      applicantId: "app_3",
      jobId: "job_1",
      type: "technical",
      status: "scheduled",
      scheduledAt: iso(new Date(now.getTime() + 1000 * 60 * 60 * 24)), // +1 day
      durationMins: 60,
      interviewer: "Dana Kim",
      locationOrUrl: "Zoom https://zoom.us/j/123456",
      notes: "Focus on React performance and TS.",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 35)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 35)),
    },
    {
      id: "meet_2",
      applicantId: "app_2",
      jobId: "job_1",
      type: "phone_screen",
      status: "completed",
      scheduledAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
      durationMins: 30,
      interviewer: "You",
      locationOrUrl: "Phone",
      notes: "Good communicator.",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 49)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 25)),
    },
    {
      id: "meet_3",
      applicantId: "app_6",
      jobId: "job_3",
      type: "offer",
      status: "scheduled",
      scheduledAt: iso(new Date(now.getTime() + 1000 * 60 * 60 * 48)),
      durationMins: 45,
      interviewer: "You",
      locationOrUrl: "Google Meet",
      createdAt: iso(new Date(now.getTime() - 1000 * 60 * 20)),
      updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 20)),
    },
  ]

  return { jobs, applicants, invoices, payments, paymentMethods, roles, members, meetings }
}

function db(): DB {
  if (!globalThis.__MEM_DB__) {
    globalThis.__MEM_DB__ = seed()
  }
  return globalThis.__MEM_DB__!
}

/* Queries: Hiring */
export async function getJobs(): Promise<Job[]> {
  return db().jobs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getJob(id: string): Promise<Job | undefined> {
  return db().jobs.find((j) => j.id === id)
}

export async function getApplicants(jobId?: string): Promise<Applicant[]> {
  const list = db().applicants
  return (jobId ? list.filter((a) => a.jobId === jobId) : list).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/* Mutations: Hiring */
export async function createJob(data: {
  title: string
  department: string
  location: string
  employmentType: EmploymentType
  description: string
  requirements: string[]
}): Promise<Job> {
  const now = new Date().toISOString()
  const id = `job_${Math.random().toString(36).slice(2, 8)}`
  const job: Job = {
    id,
    status: "draft",
    applicantsCount: 0,
    createdAt: now,
    updatedAt: now,
    ...data,
  }
  db().jobs.unshift(job)
  return job
}

export async function setJobStatus(id: string, status: JobStatus) {
  const j = db().jobs.find((x) => x.id === id)
  if (!j) return
  j.status = status
  j.updatedAt = new Date().toISOString()
}

export async function addApplicantToJob(input: {
  jobId: string
  name: string
  email: string
  location: string
  source: string
}): Promise<Applicant> {
  const now = new Date().toISOString()
  const id = `app_${Math.random().toString(36).slice(2, 8)}`
  const app: Applicant = {
    id,
    jobId: input.jobId,
    name: input.name,
    email: input.email,
    location: input.location,
    source: input.source,
    stage: "new",
    createdAt: now,
    updatedAt: now,
  }
  db().applicants.unshift(app)
  const job = db().jobs.find((j) => j.id === input.jobId)
  if (job) {
    job.applicantsCount = db().applicants.filter((a) => a.jobId === job.id).length
    job.updatedAt = now
  }
  return app
}

export async function moveApplicantStage(applicantId: string, stage: Stage) {
  const a = db().applicants.find((x) => x.id === applicantId)
  if (!a) return
  a.stage = stage
  a.updatedAt = new Date().toISOString()
}

/* Queries: Billing */
export async function getInvoices(): Promise<Invoice[]> {
  return db()
    .invoices.slice()
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
}

export async function getPayments(): Promise<Payment[]> {
  return db()
    .payments.slice()
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return db()
    .paymentMethods.slice()
    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
}

/* Mutations: Billing */
export async function addPaymentMethod(input: {
  brand: string
  last4: string
  expMonth: number
  expYear: number
  makeDefault?: boolean
}) {
  const id = `pm_${Math.random().toString(36).slice(2, 8)}`
  const method: PaymentMethod = {
    id,
    brand: input.brand,
    last4: input.last4,
    expMonth: input.expMonth,
    expYear: input.expYear,
    isDefault: false,
  }
  const state = db()
  state.paymentMethods.unshift(method)
  if (input.makeDefault) {
    state.paymentMethods.forEach((m) => (m.isDefault = m.id === method.id))
  }
  return method
}

export async function setDefaultPaymentMethod(id: string) {
  const state = db()
  state.paymentMethods.forEach((m) => (m.isDefault = m.id === id))
}

export async function removePaymentMethod(id: string) {
  const state = db()
  const idx = state.paymentMethods.findIndex((m) => m.id === id)
  if (idx === -1) return
  if (state.paymentMethods[idx]?.isDefault) {
    state.paymentMethods.splice(idx, 1)
    if (state.paymentMethods.length) state.paymentMethods[0].isDefault = true
  } else {
    state.paymentMethods.splice(idx, 1)
  }
}

/* Queries: Team */
export async function getRoles(): Promise<Role[]> {
  return db().roles.slice()
}

export async function getMembers(): Promise<TeamMember[]> {
  return db()
    .members.slice()
    .sort((a, b) => (a.status === "invited" && b.status !== "invited" ? -1 : 0))
}

/* Mutations: Team */
export async function inviteMember(input: { name: string; email: string; roleId: string }) {
  const id = `mem_${Math.random().toString(36).slice(2, 8)}`
  const member: TeamMember = { id, name: input.name, email: input.email, roleId: input.roleId, status: "invited" }
  db().members.push(member)
  return member
}

export async function removeMember(id: string) {
  const state = db()
  const idx = state.members.findIndex((m) => m.id === id)
  if (idx !== -1) state.members.splice(idx, 1)
}

export async function setMemberRole(id: string, roleId: string) {
  const m = db().members.find((x) => x.id === id)
  if (m) m.roleId = roleId
}

export async function setMemberStatus(id: string, status: TeamMember["status"]) {
  const m = db().members.find((x) => x.id === id)
  if (m) m.status = status
}

export async function addRole(input: { name: string; description?: string }) {
  const id = `role_${Math.random().toString(36).slice(2, 8)}`
  const blankPermissions = Object.fromEntries(
    (
      [
        "manage_billing",
        "manage_jobs",
        "manage_applicants",
        "view_reports",
        "manage_team",
        "edit_settings",
      ] as PermissionKey[]
    ).map((k) => [k, false]),
  ) as Record<PermissionKey, boolean>
  const role: Role = {
    id,
    name: input.name,
    description: input.description,
    permissions: blankPermissions,
    system: false,
  }
  db().roles.push(role)
  return role
}

export async function updateRolePermissions(roleId: string, perms: Partial<Record<PermissionKey, boolean>>) {
  const r = db().roles.find((x) => x.id === roleId)
  if (!r) return
  r.permissions = { ...r.permissions, ...perms }
}

export async function removeRole(roleId: string) {
  const state = db()
  const role = state.roles.find((r) => r.id === roleId)
  if (!role || role.system) return
  const assigned = state.members.some((m) => m.roleId === roleId)
  if (assigned) return
  state.roles = state.roles.filter((r) => r.id !== roleId)
}

/* Meetings */
export async function getMeetings(): Promise<Meeting[]> {
  return db()
    .meetings.slice()
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
}

export async function createMeeting(input: {
  applicantId: string
  type: MeetingType
  scheduledAt: string
  durationMins: number
  interviewer: string
  locationOrUrl?: string
  notes?: string
}): Promise<Meeting | undefined> {
  const state = db()
  const applicant = state.applicants.find((a) => a.id === input.applicantId)
  if (!applicant) return
  const nowIso = new Date().toISOString()
  const m: Meeting = {
    id: `meet_${Math.random().toString(36).slice(2, 8)}`,
    applicantId: applicant.id,
    jobId: applicant.jobId,
    type: input.type,
    status: "scheduled",
    scheduledAt: input.scheduledAt,
    durationMins: input.durationMins,
    interviewer: input.interviewer,
    locationOrUrl: input.locationOrUrl,
    notes: input.notes,
    createdAt: nowIso,
    updatedAt: nowIso,
  }
  state.meetings.push(m)
  return m
}

export async function rescheduleMeeting(id: string, scheduledAt: string, durationMins: number) {
  const m = db().meetings.find((x) => x.id === id)
  if (!m) return
  m.scheduledAt = scheduledAt
  m.durationMins = durationMins
  m.updatedAt = new Date().toISOString()
}

export async function setMeetingStatus(id: string, status: MeetingStatus) {
  const m = db().meetings.find((x) => x.id === id)
  if (!m) return
  m.status = status
  m.updatedAt = new Date().toISOString()
}

export async function cancelMeeting(id: string) {
  const m = db().meetings.find((x) => x.id === id)
  if (!m) return
  m.status = "canceled"
  m.updatedAt = new Date().toISOString()
}
