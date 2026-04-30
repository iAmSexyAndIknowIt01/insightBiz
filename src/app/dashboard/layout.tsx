/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
      } else {
        setUser(data.user)
      }
    }

    checkUser()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`m-4 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm flex flex-col justify-between transition-all duration-300
        ${hovered ? "w-64" : "w-20"}
        `}
      >
        {/* TOP */}
        <div className="p-4">

          <h2 className={`text-xl font-bold mb-8 transition-all ${hovered ? "opacity-100" : "opacity-0 hidden"}`}>
            InsightBiz
          </h2>

          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition
                    ${active ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  <Icon size={20} />

                  <span
                    className={`transition-all whitespace-nowrap
                      ${hovered ? "opacity-100" : "opacity-0 hidden"}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-4">

          {hovered && (
            <p className="text-xs text-gray-500 mb-2">
              {user?.email}
            </p>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-500 text-sm hover:underline"
          >
            <span>⏻</span>
            {hovered && <span>Гарах</span>}
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  )
}