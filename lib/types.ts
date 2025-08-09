export type JobStatus = "draft" | "published" | "closed"
export type EmploymentType = "full-time" | "part-time" | "contract" | "internship" | "temporary"
export type Stage = "new" | "reviewed" | "interview" | "offer" | "hired" | "rejected"

export interface Job {
  id: string
  title: string
  department: string
  location: string
  employmentType: EmploymentType
  description: string
  requirements: string[]
  status: JobStatus
  applicantsCount: number
  createdAt: string
  updatedAt: string
}

export interface Applicant {
  id: string
  jobId: string
  name: string
  email: string
  location: string
  source: string
  stage: Stage
  resumeUrl?: string
  createdAt: string
  updatedAt: string
}

/* Billing domain types */
export type InvoiceStatus = "open" | "paid" | "past_due"
export interface Invoice {
  id: string
  number: string
  amount: number // cents
  status: InvoiceStatus
  issuedAt: string
  dueAt: string
  paidAt?: string
}

export type PaymentStatus = "succeeded" | "failed" | "refunded"
export interface Payment {
  id: string
  amount: number // cents
  date: string
  methodBrand: string
  methodLast4: string
  status: PaymentStatus
  invoiceId?: string
  invoiceNumber?: string
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

/* Team & permissions */
export type PermissionKey =
  | "manage_billing"
  | "manage_jobs"
  | "manage_applicants"
  | "view_reports"
  | "manage_team"
  | "edit_settings"

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Record<PermissionKey, boolean>
  system?: boolean
}

export type MemberStatus = "active" | "invited" | "suspended"

export interface TeamMember {
  id: string
  name: string
  email: string
  roleId: string
  status: MemberStatus
  lastActiveAt?: string
}

/* Meetings domain types */
export type MeetingType = "phone_screen" | "technical" | "onsite" | "offer"
export type MeetingStatus = "scheduled" | "completed" | "canceled"

export interface Meeting {
  id: string
  applicantId: string
  jobId: string
  type: MeetingType
  status: MeetingStatus
  scheduledAt: string // ISO
  durationMins: number
  interviewer: string
  locationOrUrl?: string
  notes?: string
  // Optional multi-round support
  round?: number // e.g., 1, 2, 3 for multi-level interviews
  seriesId?: string // optional grouping key to link rounds in a series
  createdAt: string
  updatedAt: string
}
