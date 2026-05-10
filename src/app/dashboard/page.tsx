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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)

  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [lastMonthIncome, setLastMonthIncome] = useState(0)
  const [growth, setGrowth] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
        return
      }

      setUser(data.user)

      // 🔥 session-ээс авах
      const cId = sessionStorage.getItem("company_id")

      if (!cId) {
        console.error("company_id session-д алга")
        router.push("/login")
        return
      }

      console.log("✅ session company_id:", cId)

      setCompanyId(cId)

      // eslint-disable-next-line react-hooks/immutability
      await fetchIncome(cId)
      // eslint-disable-next-line react-hooks/immutability
      await fetchCustomerCount(cId)
    }

    init()
  }, [router])

  // =========================
  // 💰 INCOME (COMPANY BASED)
  // =========================
  const fetchIncome = async (companyId: string) => {
    const now = new Date()

    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    )

    const { data, error } = await supabase
      .from("transactions")
      .select("amount, type, transaction_date")
      .eq("company_id", companyId)
      .gte("transaction_date", sixMonthsAgo.toISOString())
      .lte("transaction_date", now.toISOString())

    if (error) {
      console.error(error)
      return
    }

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

    const chartArr = Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((key) => {
        const [, month] = key.split("-")

        return {
          month: `${month} сар`,
          income: grouped[key].income,
          expense: grouped[key].expense,
        }
      })

    setChartData(chartArr)

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

  // =========================
  // 👥 CUSTOMER COUNT (COMPANY BASED)
  // =========================
  const fetchCustomerCount = async (companyId: string) => {
    const { count, error } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)

    if (error) {
      console.error(error)
      return
    }

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
          </div>

          <div className="p-6 rounded-2xl bg-white/60 border shadow">
            <p className="text-gray-500 text-sm">Өсөлт</p>
            <p className={`text-3xl font-bold mt-2 ${
              growth >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              {growth >= 0 ? "+" : ""}{growth}%
            </p>
          </div>

        </div>

        {/* CHART */}
        <div className="bg-white/60 border p-6 rounded-2xl shadow">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#22c55e" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}