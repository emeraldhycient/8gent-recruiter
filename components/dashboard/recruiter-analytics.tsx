"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

type KPIs = {
  totalJobs: number
  openJobs: number
  totalApplicants: number
  interviews: number
  offers: number
  hires: number
  acceptanceRate: number
  applicantsPerOpen: number
  avgDaysToHire: number
}

type Charts = {
  pipeline: { stage: string; value: number }[]
  sources: { name: string; value: number }[]
  applicantsTrend: { date: string; count: number }[]
  dept: { department: string; jobs: number }[]
}

export default function RecruiterAnalytics({ kpis, charts }: { kpis: KPIs; charts: Charts }) {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="space-y-4">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Metric title="Open Jobs" value={kpis.openJobs} />
        <Metric title="Applicants" value={kpis.totalApplicants} />
        <Metric title="Interviews" value={kpis.interviews} />
        <Metric title="Offers" value={kpis.offers} />
        <Metric title="Hires" value={kpis.hires} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Applicants trend */}
        <Card className="col-span-1 xl:col-span-2 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-sm">Applicants over last 14 days</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ChartContainer
              config={{
                count: { label: "Applicants", color: "hsl(var(--chart-1))" },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.applicantsTrend} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="count"
                    type="monotone"
                    stroke="var(--color-count)"
                    fill="var(--color-count)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Offer acceptance + time to hire */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-sm">Recruiting quality</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Stat label="Acceptance rate" value={`${kpis.acceptanceRate}%`} />
            <Stat label="Avg days to hire" value={`${kpis.avgDaysToHire}d`} />
            <Stat label="Applicants per open" value={kpis.applicantsPerOpen.toString()} />
            <Stat label="Total jobs" value={kpis.totalJobs.toString()} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pipeline bar */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-sm">Pipeline by stage</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ChartContainer
              config={{
                value: { label: "Candidates", color: "hsl(var(--chart-2))" },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.pipeline} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" tickFormatter={(s) => s.slice(0, 8)} />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Source breakdown */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-sm">Source breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ChartContainer
              config={{
                value: { label: "Candidates by Source", color: "hsl(var(--chart-4))" },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.sources} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80}>
                    {charts.sources.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Jobs by department */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader>
            <CardTitle className="text-sm">Open roles by department</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ChartContainer
              config={{
                jobs: { label: "Jobs", color: "hsl(var(--chart-3))" },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.dept} layout="vertical" margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="department" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="jobs" fill="var(--color-jobs)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-xl p-4 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
      <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-[#1F1F23] p-3">
      <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  )
}
