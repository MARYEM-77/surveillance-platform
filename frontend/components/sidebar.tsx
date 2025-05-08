"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bell, Calendar, Camera, FileText, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Tableau de Bord",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Alertes",
    icon: Bell,
    href: "/alertes",
    color: "text-rose-500",
  },
  {
    label: "Événements",
    icon: Calendar,
    href: "/evenements",
    color: "text-violet-500",
  },
  {
    label: "Rapports",
    icon: FileText,
    href: "/rapports",
    color: "text-emerald-500",
  },
  {
    label: "Caméras / Zones",
    icon: Camera,
    href: "/cameras",
    color: "text-amber-500",
  },
  {
    label: "Paramètres",
    icon: Settings,
    href: "/parametres",
    color: "text-gray-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full space-y-4 py-4 bg-slate-50 dark:bg-slate-900 border-r w-64 shrink-0">
      <div className="px-3 py-2 flex items-center gap-2 mb-4">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">SurveillancePro</h1>
      </div>
      <div className="space-y-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
              pathname === route.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="mt-auto px-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">AS</span>
            </div>
            <div>
              <p className="text-sm font-medium">Agent Sécurité</p>
              <p className="text-xs text-muted-foreground">admin@surveillance.fr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
