"use client"

import { useState } from "react"

export default function Settings() {
  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white/60 backdrop-blur border rounded-2xl p-6 shadow space-y-4">

        <div>
          <label className="text-sm text-gray-500">Нэр</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Бизнесийн нэр</label>
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl mt-1"
          />
        </div>

        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl">
          Хадгалах
        </button>

      </div>
    </div>
  )
}