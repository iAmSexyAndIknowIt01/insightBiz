"use client"

import { useState } from "react"

export default function Customers() {
  const [search, setSearch] = useState("")

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
          className="w-full px-4 py-2 border rounded-xl"
        />

        <button className="bg-indigo-600 text-white px-4 rounded-xl">
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/60 backdrop-blur border rounded-2xl p-6 shadow">

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
            <tr className="border-b">
              <td className="py-2">Бат</td>
              <td>bat@email.com</td>
              <td>28</td>
              <td>2026-04-30</td>
            </tr>

            <tr>
              <td className="py-2">Сараа</td>
              <td>saraa@email.com</td>
              <td>32</td>
              <td>2026-04-29</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  )
}