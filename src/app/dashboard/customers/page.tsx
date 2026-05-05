/* eslint-disable react-hooks/immutability */
"use client"

import { useEffect, useState } from "react"

type Customer = {
  id: string
  first_name: string
  last_name: string
  email: string
  age: number
  created_at: string
}

export default function Customers() {
  const [search, setSearch] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/customers")

      if (!res.ok) {
        throw new Error("API алдаа")
      }

      const data = await res.json()
      setCustomers(data)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 🔍 Search filter
  const filteredCustomers = customers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      {/* Search */}
      <div className="mb-6 flex justify-between gap-4">
        <input
          type="text"
          placeholder="Хэрэглэгч хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition">
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/60 backdrop-blur border rounded-2xl p-6 shadow">

        {loading ? (
          <p className="text-center text-gray-500">Уншиж байна...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-500">
            Хэрэглэгч олдсонгүй
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm border-b">
              <tr>
                <th className="py-2">Нэр</th>
                <th>Имэйл</th>
                <th>Нас</th>
                <th>Огноо</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 font-medium">
                    {c.first_name} {c.last_name}
                  </td>
                  <td className="text-gray-600">
                    {c.email || "-"}
                  </td>
                  <td>{c.age || "-"}</td>
                  <td className="text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleDateString()}
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