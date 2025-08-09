export function JobStatusBadge({ status }: { status: "draft" | "published" | "closed" }) {
  const styles: Record<string, string> = {
    draft: "bg-zinc-100 text-zinc-900 dark:bg-[#1F1F23] dark:text-zinc-100",
    published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    closed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${styles[status]}`}>{status}</span>
}

export function StageBadge({
  stage,
}: {
  stage: "new" | "reviewed" | "interview" | "offer" | "hired" | "rejected"
}) {
  const styles: Record<string, string> = {
    new: "bg-zinc-100 text-zinc-900 dark:bg-[#1F1F23] dark:text-zinc-100",
    reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    interview: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    offer: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    hired: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${styles[stage]}`}>{stage}</span>
}
