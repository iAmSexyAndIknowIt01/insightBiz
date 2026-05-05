/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [lastMonthIncome, setLastMonthIncome] = useState(0)
  const [growth, setGrowth] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
        return
      }

      setUser(data.user)

      // eslint-disable-next-line react-hooks/immutability
      await fetchIncome(data.user.id)
      // eslint-disable-next-line react-hooks/immutability
      await fetchCustomerCount(data.user.id)
    }

    init()
  }, [router])

  // 💰 INCOME (THIS MONTH + LAST MONTH)
  const fetchIncome = async (userId: string) => {
    const now = new Date()

    // THIS MONTH
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // LAST MONTH
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // 👉 THIS MONTH QUERY
    const { data: currentData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "income")
      .gte("transaction_date", startOfMonth.toISOString())
      .lte("transaction_date", endOfMonth.toISOString())

    // 👉 LAST MONTH QUERY
    const { data: lastData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "income")
      .gte("transaction_date", startOfLastMonth.toISOString())
      .lte("transaction_date", endOfLastMonth.toISOString())

    const currentTotal =
      currentData?.reduce((sum, i) => sum + Number(i.amount), 0) || 0

    const lastTotal =
      lastData?.reduce((sum, i) => sum + Number(i.amount), 0) || 0

    setMonthlyIncome(currentTotal)
    setLastMonthIncome(lastTotal)

    // 📈 GROWTH CALCULATION
    if (lastTotal === 0) {
      setGrowth(100) // new business
    } else {
      const percent = ((currentTotal - lastTotal) / lastTotal) * 100
      setGrowth(Number(percent.toFixed(1)))
    }
  }

  // 👥 CUSTOMER COUNT
  const fetchCustomerCount = async (userId: string) => {
    const { count } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (count !== null) {
      setCustomerCount(count)
    }
  }


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              {user?.email}
            </p>
          </div>

          <div className="px-4 py-2 bg-white/70 backdrop-blur border rounded-xl text-sm shadow-sm">
            Free Plan
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* USERS */}
          <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur border shadow">
            <p className="text-gray-500 text-sm">Нийт хэрэглэгч</p>
            <p className="text-3xl font-bold mt-2">
              {customerCount.toLocaleString()}
            </p>
          </div>

          {/* INCOME */}
          <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur border shadow">
            <p className="text-gray-500 text-sm">Сарын орлого</p>
            <p className="text-3xl font-bold mt-2">
              ₮{monthlyIncome.toLocaleString("mn-MN")}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Өмнөх сар: ₮{lastMonthIncome.toLocaleString("mn-MN")}
            </p>
          </div>

          {/* GROWTH */}
          <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur border shadow">

            <p className="text-gray-500 text-sm">Өсөлт</p>

            <p
              className={`text-3xl font-bold mt-2 ${
                growth >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {growth >= 0 ? "+" : ""}
              {growth}%
            </p>

            <p className="text-xs text-gray-400 mt-2">
              vs өнгөрсөн сар
            </p>

          </div>

        </div>

        {/* CHART */}
        <div className="bg-white/60 backdrop-blur border p-6 rounded-2xl shadow mb-10">
          <h2 className="font-semibold mb-4">Орлогын график</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            📊 Chart энд орно
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white/60 backdrop-blur border p-6 rounded-2xl shadow">
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