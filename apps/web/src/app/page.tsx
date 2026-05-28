'use client'

import {
  Activity,
  ArrowRight,
  HelpCircle,
  Layers,
  Mail,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserPlus,
} from 'lucide-react'
import * as React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-slate-900 dark:text-white">
                Acme
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                SaaS
              </span>
              <span className="ml-1.5 rounded-full border border-indigo-100/50 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-400">
                RBAC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                className="w-64 border-slate-200 bg-slate-50/50 pl-9 focus-visible:bg-white dark:border-zinc-800 dark:bg-zinc-800/20 dark:focus-visible:bg-zinc-900"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Settings className="mr-1 size-4 text-slate-500" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="mr-1 size-4" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          {/* Section 1: Dashboard Welcome & Notifications */}
          <div className="grid gap-4">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                Workspace Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Manage roles, access tokens, and invite team members to your
                secure SaaS portal.
              </p>
            </div>

            {/* Alert Notification */}
            <Alert className="border-indigo-100 bg-indigo-50/30 text-indigo-950 shadow-xs dark:border-indigo-950/30 dark:bg-indigo-950/10 dark:text-indigo-100">
              <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400" />
              <AlertTitle className="font-semibold text-indigo-900 dark:text-indigo-300">
                RBAC Security Policy Update
              </AlertTitle>
              <AlertDescription className="mt-1 text-indigo-800/80 dark:text-indigo-200/80">
                We have upgraded the permission evaluation logic. Role
                validations now occur via instant JWT claims caching, improving
                latency by up to 40%. Read the full release notes to review the
                new custom policy structure.
              </AlertDescription>
            </Alert>
          </div>

          <Separator className="bg-slate-200 dark:bg-zinc-800" />

          {/* Section 2: Form Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Team Invitation Form */}
            <div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-zinc-50">
                  <UserPlus className="size-5 text-indigo-500" />
                  Invite Team Member
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                  Send secure join links to users under specific organization
                  domains.
                </p>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-zinc-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-2.5 left-3 size-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="lucas@example.com"
                      className="bg-slate-50/50 pl-9 dark:bg-zinc-800/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="role"
                    className="text-slate-700 dark:text-zinc-300"
                  >
                    Assigned Role
                  </Label>
                  <Input
                    id="role"
                    placeholder="e.g., Developer, Auditor, Owner"
                    defaultValue="Developer"
                    className="bg-slate-50/50 dark:bg-zinc-800/20"
                  />
                </div>
              </div>

              <Separator className="my-5 bg-slate-100 dark:bg-zinc-800" />

              <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Send Invite
                  <ArrowRight className="ml-1 size-3.5" />
                </Button>
              </div>
            </div>

            {/* Card 2: Interactive Buttons & States Showcase */}
            <div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-zinc-50">
                  <Layers className="size-5 text-indigo-500" />
                  Quick Controls
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                  Explore the full slate of design system button styles and
                  variants.
                </p>
              </div>

              <div className="grid flex-1 grid-cols-2 items-start gap-2.5">
                <Button variant="default" size="sm" className="w-full">
                  Primary Action
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Secondary
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Outline Style
                </Button>
                <Button variant="ghost" size="sm" className="w-full">
                  Ghost Interactive
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="col-span-2 w-full"
                >
                  Destructive Danger Button
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="col-span-2 w-full text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Read documentation specs
                </Button>
              </div>

              <Separator className="my-5 bg-slate-100 dark:bg-zinc-800" />

              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500">
                <span>Total Variants: 6</span>
                <span className="flex items-center gap-1">
                  <Activity className="size-3 text-emerald-500" /> Active System
                </span>
              </div>
            </div>

            {/* Card 3: Security & Health Status */}
            <div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-shadow hover:shadow-md md:col-span-2 lg:col-span-1 dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-zinc-50">
                  <ShieldAlert className="size-5 text-rose-500" />
                  System Warnings
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                  Real-time threat detection and security alert log items.
                </p>
              </div>

              <div className="flex-1 space-y-3.5">
                <Alert
                  variant="destructive"
                  className="border-rose-100 bg-rose-50/30 dark:border-rose-950/20 dark:bg-rose-950/10"
                >
                  <ShieldAlert className="size-4 text-rose-600 dark:text-rose-400" />
                  <AlertTitle className="font-semibold text-rose-950 dark:text-rose-300">
                    Unencrypted Payload Detected
                  </AlertTitle>
                  <AlertDescription className="text-xs text-rose-900/80 dark:text-rose-200/80">
                    Workspace `dev-stage` logged 4 plain API calls outside TLS
                    layer.
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                      Total API Audited
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                      <TrendingUp className="size-3.5 text-emerald-500" />
                      142.8k/day
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" />
                  </div>
                </div>
              </div>

              <Separator className="my-5 bg-slate-100 dark:bg-zinc-800" />

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-slate-400 dark:text-zinc-500"
                >
                  <HelpCircle className="mr-1 size-3.5" />
                  Audit logs support
                </Button>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  99.98% Secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
