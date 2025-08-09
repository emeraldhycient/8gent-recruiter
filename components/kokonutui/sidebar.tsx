"use client"

import type React from "react"

import {
  Receipt,
  CreditCard,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
  Briefcase,
  Banknote,
  Wallet,
} from "lucide-react"

import { Home } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Primary"
      >
        <div className="h-full flex flex-col">
          {/* Brand header with original logo + new name/badge */}
          <Link
            href="/"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
            onClick={handleNavigation}
            aria-label="8gent Recruiter Home"
          >
            <div className="flex items-center gap-3">
              {/* Keep the original icon/logo in light/dark variants */}
              <Image
                src="https://kokonutui.com/logo.svg"
                alt="Brand logo"
                width={32}
                height={32}
                className="flex-shrink-0 hidden dark:block"
                priority
              />
              <Image
                src="https://kokonutui.com/logo-black.svg"
                alt="Brand logo"
                width={32}
                height={32}
                className="flex-shrink-0 block dark:hidden"
                priority
              />
              {/* Updated brand text and badge */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">8gent</span>
                <span
                  className="text-[10px] leading-none uppercase tracking-wide rounded-full border px-2 py-0.5 text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-300 dark:bg-[#141418] dark:border-[#1F1F23]"
                  aria-label="Product"
                >
                  recruiter
                </span>
              </div>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={Home}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/jobs" icon={Briefcase}>
                    Jobs
                  </NavItem>
                  <NavItem href="/applicants" icon={Users2}>
                    Applicants
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Finance
                </div>
                <div className="space-y-1">
                  <NavItem href="/billing" icon={Banknote}>
                    Plans & Billing
                  </NavItem>
                  <NavItem href="/billing/invoices" icon={Receipt}>
                    Invoices
                  </NavItem>
                  <NavItem href="/billing/payments" icon={Wallet}>
                    Payments
                  </NavItem>
                  <NavItem href="/billing/methods" icon={CreditCard}>
                    Payment Methods
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Team
                </div>
                <div className="space-y-1">
                  <NavItem href="/team/members" icon={Users2}>
                    Members
                  </NavItem>
                  <NavItem href="/team/permissions" icon={Shield}>
                    Permissions
                  </NavItem>
                  <NavItem href="#" icon={MessagesSquare}>
                    Chat
                  </NavItem>
                  <NavItem href="/team/meetings" icon={Video}>
                    Meetings
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/settings" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
