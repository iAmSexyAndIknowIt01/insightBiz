/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [lastMonthIncome, setLastMonthIncome] = useState(0)
  const [growth, setGrowth] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)

  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
        return
      }

      setUser(data.user)

      await fetchIncome(data.user.id)
      await fetchCustomerCount(data.user.id)
    }

    init()
  }, [router])

  // 💰 INCOME + 6 MONTH CHART
  const fetchIncome = async (userId: string) => {
    const now = new Date()

    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    )

    const { data } = await supabase
      .from("transactions")
      .select("amount, type, transaction_date")
      .eq("user_id", userId)
      .gte("transaction_date", sixMonthsAgo.toISOString())
      .lte("transaction_date", now.toISOString())

    // 👉 GROUP BY MONTH
    const grouped: Record<
      string,
      { income: number; expense: number }
    > = {}

    data?.forEach((item) => {
      const date = new Date(item.transaction_date)
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`

      if (!grouped[key]) {
        grouped[key] = { income: 0, expense: 0 }
      }

      if (item.type === "income") {
        grouped[key].income += Number(item.amount)
      } else {
        grouped[key].expense += Number(item.amount)
      }
    })

    // 👉 SORT + FORMAT
    const chartArr = Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((key) => {
        const [year, month] = key.split("-")

        return {
          month: `${month} сар`,
          income: grouped[key].income,
          expense: grouped[key].expense,
        }
      })

    setChartData(chartArr)

    // 👉 CURRENT vs LAST MONTH
    const currentKey = `${now.getFullYear()}-${now.getMonth() + 1}`
    const lastDate = new Date(now.getFullYear(), now.getMonth() - 1)
    const lastKey = `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}`

    const currentTotal = grouped[currentKey]?.income || 0
    const lastTotal = grouped[lastKey]?.income || 0

    setMonthlyIncome(currentTotal)
    setLastMonthIncome(lastTotal)

    if (lastTotal === 0) {
      setGrowth(100)
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

          <div className="p-6 rounded-2xl bg-white/60 border shadow">
            <p className="text-gray-500 text-sm">Нийт хэрэглэгч</p>
            <p className="text-3xl font-bold mt-2">
              {customerCount.toLocaleString()}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 border shadow">
            <p className="text-gray-500 text-sm">Сарын орлого</p>
            <p className="text-3xl font-bold mt-2">
              ₮{monthlyIncome.toLocaleString("mn-MN")}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Өмнөх сар: ₮{lastMonthIncome.toLocaleString("mn-MN")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 border shadow">
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

        {/* 📊 CHART (6 MONTH) */}
        <div className="bg-white/60 backdrop-blur border p-6 rounded-2xl shadow mb-10">
          <h2 className="font-semibold mb-4">
            Сүүлийн 6 сарын орлого / зарлага
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>

                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>

                  <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis dataKey="month" />
                <YAxis />

                <Tooltip
                  formatter={(value: any) =>
                    `₮${Number(value).toLocaleString()}`
                  }
                />

                {/* INCOME */}
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  fill="url(#income)"
                  strokeWidth={3}
                />

                {/* EXPENSE */}
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  fill="url(#expense)"
                  strokeWidth={3}
                />

              </AreaChart>
            </ResponsiveContainer>
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