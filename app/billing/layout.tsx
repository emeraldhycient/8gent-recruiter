import type React from "react"

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  // Keep Finance routes consistent with other sections (each page wraps itself with Layout).
  return children
}
