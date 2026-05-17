"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  CoinsIcon,
  Clock,
  FileText,
  PlusCircle,
  List,
  ChevronDown
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [hovered, setHovered] = useState(false)

  const [openMenu, setOpenMenu] = useState<string | null>(null)

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
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: CoinsIcon },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { name: "Timecard", href: "/dashboard/timecard", icon: Clock },
    { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`m-4 rounded-2xl bg-white/80 backdrop-blur-md border shadow-sm flex flex-col justify-between transition-all duration-300
        ${hovered ? "w-64" : "w-20"}
        `}
      >
        <div className="p-4">

          <h2 className={`text-xl font-bold mb-8 ${hovered ? "" : "hidden"}`}>
            InsightBiz
          </h2>

          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href

              // 🔥 CONTRACTS DROPDOWN
              if (item.name === "Contracts") {
                const isOpen = openMenu === "Contracts"

                return (
                  <div key={item.name} className="relative">

                    <button
                      onClick={() =>
                        setOpenMenu(isOpen ? null : "Contracts")
                      }
                      className={`w-full flex items-center justify-between p-3 rounded-xl
                      ${active ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        {hovered && <span>{item.name}</span>}
                      </div>

                      {hovered && (
                        <ChevronDown
                          size={16}
                          className={`transition ${isOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    {/* SUBMENU */}
                    {isOpen && hovered && (
                      <div className="ml-8 mt-1 space-y-1">

                        <Link
                          href="/dashboard/contracts/new"
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm"
                        >
                          <PlusCircle size={16} />
                          Шинэ гэрээ
                        </Link>

                        <Link
                          href="/dashboard/contracts"
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm"
                        >
                          <List size={16} />
                          Гэрээний жагсаалт
                        </Link>

                      </div>
                    )}
                  </div>
                )
              }

              // 🔹 NORMAL MENU
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-xl
                  ${active ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  <Icon size={20} />
                  {hovered && <span>{item.name}</span>}
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
            className="flex items-center gap-3 text-red-500 text-sm"
          >
            ⏻ {hovered && "Гарах"}
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