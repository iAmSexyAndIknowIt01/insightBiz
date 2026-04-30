"use client"

import { useState } from "react"
import NewCustomer from "./new"
import ExistingCustomer from "./existing"

export default function ClientPage() {
  const [mode, setMode] = useState<"new" | "existing" | null>(null)

  if (mode === "new") return <NewCustomer />
  if (mode === "existing") return <ExistingCustomer />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">

      <div className="bg-white p-10 rounded-2xl shadow w-full max-w-md text-center">

        <h1 className="text-2xl font-bold mb-6">
          Тавтай морил
        </h1>

        <div className="space-y-4">

          <button
            onClick={() => setMode("new")}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            Шинэ хэрэглэгч
          </button>

          <button
            onClick={() => setMode("existing")}
            className="w-full border py-3 rounded-xl"
          >
            Бүртгэлтэй хэрэглэгч
          </button>

        </div>

      </div>
    </div>
  )
}