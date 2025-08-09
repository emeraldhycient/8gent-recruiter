"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function BillingNav() {
  const pathname = usePathname()
  const items = [
    { href: "/billing", label: "Overview" },
    { href: "/billing/invoices", label: "Invoices" },
    { href: "/billing/payments", label: "Payments" },
    { href: "/billing/methods", label: "Payment Methods" },
  ]
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((it) => {
        const active = pathname === it.href
        return (
          <Link
            key={it.href}
            href={it.href}
            className={
              active
                ? "h-9 px-3 rounded-md text-sm bg-gray-900 text-white dark:bg-zinc-50 dark:text-zinc-900 border border-transparent"
                : "h-9 px-3 rounded-md text-sm border border-gray-300 dark:border-[#2B2B30] hover:bg-gray-50 dark:hover:bg-[#1F1F23] text-gray-900 dark:text-gray-100"
            }
          >
            {it.label}
          </Link>
        )
      })}
    </div>
  )
}
