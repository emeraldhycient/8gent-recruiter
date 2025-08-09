"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"

export function Header() {
  const pathname = usePathname()
  const parts = pathname.split("/").filter(Boolean)

  const items = parts.map((p, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/")
    return { label: decodeURIComponent(p), href }
  })

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {items.map((item, idx) => (
              <span key={item.href} className="contents">
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {idx < items.length - 1 ? (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="capitalize">{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <Input placeholder="Search jobs or applicants..." className="w-[260px]" />
        </div>
        <Button asChild>
          <Link href="/jobs/new">Post Job</Link>
        </Button>
      </div>
    </div>
  )
}
