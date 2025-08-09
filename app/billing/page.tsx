import Layout from "@/components/kokonutui/layout"
import { BillingNav } from "@/components/billing/billing-nav"
import { getApplicants, getJobs } from "@/lib/store"

type Plan = {
  id: "free" | "starter" | "growth" | "scale"
  name: string
  price: string
  description: string
  applicantCap?: number // applicants per month
  seatLimit?: number
  activeJobs?: number | "unlimited"
  features: string[]
  cta: string
  highlight?: boolean
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Get started with the basics.",
    applicantCap: 100,
    seatLimit: 1,
    activeJobs: 2,
    features: [
      "1 team member",
      "2 active jobs",
      "Up to 100 applicants/mo",
      "Manual stage updates",
      "Basic email notifications",
    ],
    cta: "Current plan",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$49/mo",
    description: "For small teams hiring occasionally.",
    applicantCap: 1000,
    seatLimit: 5,
    activeJobs: 10,
    features: [
      "Up to 5 team members",
      "10 active jobs",
      "1,000 applicants/mo",
      "Resume uploads (1GB)",
      "Simple automations",
      "Careers page branding",
    ],
    cta: "Upgrade to Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$199/mo",
    description: "Grow your hiring with automation and insights.",
    applicantCap: 5000,
    seatLimit: 25,
    activeJobs: 50,
    features: [
      "Up to 25 team members",
      "50 active jobs",
      "5,000 applicants/mo",
      "Resume uploads (10GB)",
      "Advanced automations",
      "Integrations (Slack, Calendars)",
      "Pipeline analytics & reports",
    ],
    cta: "Upgrade to Growth",
    highlight: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: "$499/mo",
    description: "For large orgs with security and scale needs.",
    applicantCap: 25000,
    seatLimit: 100,
    activeJobs: "unlimited",
    features: [
      "Up to 100 team members",
      "Unlimited active jobs",
      "25,000 applicants/mo",
      "Resume uploads (100GB)",
      "Custom roles & permissions",
      "SSO & SCIM provisioning",
      "Audit logs & data export",
      "Priority support",
    ],
    cta: "Contact Sales",
  },
]

// Demo state
const CURRENT_PLAN_ID: Plan["id"] = "free"
const CURRENT_SEATS_USED = 1

function Progress({
  used,
  cap,
  label,
}: {
  used: number
  cap?: number
  label: string
}) {
  const pct = cap ? Math.min(100, Math.round((used / cap) * 100)) : 0
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
        <span>{label}</span>
        <span className="tabular-nums">{cap ? `${used}/${cap}` : used}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-[#1F1F23] overflow-hidden">
        <div className="h-full bg-gray-900 dark:bg-zinc-50 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function BillingOverviewPage() {
  const [jobs, applicants] = await Promise.all([getJobs(), getApplicants()])
  const applicantsUsed = applicants.length
  const openJobs = jobs.filter((j) => j.status === "published").length
  const currentPlan = PLANS.find((p) => p.id === CURRENT_PLAN_ID)!

  return (
    <Layout>
      <BillingNav />
      <div className="space-y-4">
        {/* Current plan + usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl p-4 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Plan</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {currentPlan.name}{" "}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">({currentPlan.price})</span>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{currentPlan.description}</p>
              </div>
              <span className="inline-flex items-center h-8 px-3 rounded-md bg-gray-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                {currentPlan.cta}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Progress used={applicantsUsed} cap={currentPlan.applicantCap} label="Applicants this month" />
              <Progress used={CURRENT_SEATS_USED} cap={currentPlan.seatLimit} label="Team members" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Active jobs: <span className="font-medium text-gray-900 dark:text-gray-100">{openJobs}</span>{" "}
                {typeof currentPlan.activeJobs === "number" ? `of ${currentPlan.activeJobs}` : `(unlimited on Scale)`}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Tip: Upgrade to unlock more seats, jobs, and applicant capacity.
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <div className="text-sm text-gray-600 dark:text-gray-400">Billing Summary</div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Plan</span>
                <span className="text-gray-900 dark:text-gray-100">{currentPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Price</span>
                <span className="text-gray-900 dark:text-gray-100">{currentPlan.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Next invoice</span>
                <span className="text-gray-900 dark:text-gray-100">—</span>
              </div>
            </div>
            <div className="mt-3">
              <a
                href="#"
                className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-gray-900 text-white dark:bg-zinc-50 dark:text-zinc-900 hover:opacity-90 text-sm"
              >
                Update payment method
              </a>
            </div>
          </div>
        </div>

        {/* Plan comparison */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Compare plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl p-4 bg-white dark:bg-[#0F0F12] border ${
                  plan.highlight ? "border-gray-900 dark:border-zinc-50" : "border-gray-200 dark:border-[#1F1F23]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{plan.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">{plan.price}</div>
                    {plan.applicantCap && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Up to {plan.applicantCap.toLocaleString()} applicants/mo
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  {typeof plan.activeJobs === "number" ? (
                    <div>{plan.activeJobs} active jobs</div>
                  ) : (
                    <div>Unlimited active jobs</div>
                  )}
                  {typeof plan.seatLimit === "number" ? (
                    <div>{plan.seatLimit} team members</div>
                  ) : (
                    <div>Flexible team size</div>
                  )}
                </div>

                <div className="mt-3 border-t border-gray-200 dark:border-[#1F1F23] pt-3 space-y-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
                      • {f}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <a
                    href="#"
                    className={`inline-flex items-center justify-center h-9 px-3 rounded-md text-sm ${
                      plan.id === CURRENT_PLAN_ID
                        ? "bg-gray-100 dark:bg-[#1F1F23] text-gray-900 dark:text-gray-100 cursor-default"
                        : plan.highlight
                          ? "bg-gray-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                          : "border border-gray-300 dark:border-[#2B2B30] hover:bg-gray-50 dark:hover:bg-[#1F1F23] text-gray-900 dark:text-gray-100"
                    }`}
                    aria-disabled={plan.id === CURRENT_PLAN_ID}
                  >
                    {plan.id === CURRENT_PLAN_ID ? "Current plan" : plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
