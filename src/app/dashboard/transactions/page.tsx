"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Transaction = {
  id: string
  amount: number
  type: "income" | "expense"
  note: string
  transaction_date: string
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  // 👉 filters
  const [type, setType] = useState("")
  const [search, setSearch] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  const fetchData = async () => {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) return

    const params = new URLSearchParams({
      user_id: userId,
      ...(type && { type }),
      ...(search && { search }),
      ...(from && { from }),
      ...(to && { to }),
      ...(min && { min }),
      ...(max && { max }),
    })

    const res = await fetch(`/api/dashboard/transactions?${params}`)
    const data = await res.json()

    setTransactions(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* 🔥 FILTER UI */}
      <div className="bg-white/60 backdrop-blur border rounded-2xl p-4 mb-6 shadow">

        <div className="grid md:grid-cols-6 gap-3">

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          >
            <option value="">Бүгд</option>
            <option value="income">Орлого</option>
            <option value="expense">Зарлага</option>
          </select>

          <input
            placeholder="Тайлбар хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          />

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          />

          <input
            placeholder="Мин дүн"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          />

          <input
            placeholder="Макс дүн"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          />

        </div>

        <button
          onClick={fetchData}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          Хайх
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white/60 backdrop-blur border rounded-2xl p-6 shadow">

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm border-b">
              <tr>
                <th className="py-2">Огноо</th>
                <th>Төрөл</th>
                <th>Дүн</th>
                <th>Тайлбар</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">
                    {new Date(t.transaction_date).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "Орлого" : "Зарлага"}
                    </span>
                  </td>

                  <td className="font-semibold">
                    ₮{t.amount.toLocaleString()}
                  </td>

                  <td className="text-gray-500">
                    {t.note || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  )
}