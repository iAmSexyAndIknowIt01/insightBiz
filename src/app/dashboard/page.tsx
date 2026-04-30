/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/dist/client/link"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* SIDEBAR
      <aside className="w-64 m-4 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm p-6 hidden md:flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-10">InsightBiz</h2>

          <nav className="space-y-4 text-gray-600">
              <Link href="/dashboard" className="block">Dashboard</Link>
              <Link href="/dashboard/customers" className="block">Customers</Link>
              <Link href="/dashboard/analytics" className="block">Analytics</Link>
              <Link href="/dashboard/settings" className="block">Settings</Link>
          </nav>
        </div>

        <button
          onClick={logout}
          className="text-red-500 text-sm hover:underline"
        >
          Гарах
        </button>
      </aside> */}

      {/* MAIN */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/70 backdrop-blur border border-gray-200 rounded-xl text-sm shadow-sm">
              Free Plan
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 shadow hover:shadow-lg hover:scale-[1.02] transition">

            <div className="absolute -top-5 -right-5 w-20 h-20 bg-indigo-200 rounded-full blur-2xl opacity-40"></div>

            <p className="text-gray-500 text-sm">Нийт хэрэглэгч</p>
            <p className="text-3xl font-bold mt-2">1,240</p>
          </div>

          <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 shadow hover:shadow-lg hover:scale-[1.02] transition">

            <div className="absolute -top-5 -right-5 w-20 h-20 bg-purple-200 rounded-full blur-2xl opacity-40"></div>

            <p className="text-gray-500 text-sm">Орлого</p>
            <p className="text-3xl font-bold mt-2">₮8.2M</p>
          </div>

          <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 shadow hover:shadow-lg hover:scale-[1.02] transition">

            <div className="absolute -top-5 -right-5 w-20 h-20 bg-green-200 rounded-full blur-2xl opacity-40"></div>

            <p className="text-gray-500 text-sm">Өсөлт</p>
            <p className="text-3xl font-bold mt-2 text-green-500">
              +22%
            </p>
          </div>

        </div>

        {/* CHART */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-100 p-6 rounded-2xl shadow mb-10 hover:shadow-lg transition">
          <h2 className="font-semibold mb-4">Орлогын график</h2>

          <div className="h-48 flex items-center justify-center text-gray-400">
            📊 Chart энд орно
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-4">Сүүлийн үйлдлүүд</h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Шинэ хэрэглэгч бүртгэгдлээ</span>
              <span className="text-gray-400 text-sm">2 мин</span>
            </div>

            <div className="flex justify-between">
              <span>Орлого нэмэгдлээ</span>
              <span className="text-gray-400 text-sm">10 мин</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}