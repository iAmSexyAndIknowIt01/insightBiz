/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ExistingCustomer() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const handleSearch = async () => {
    if (!email) return

    const normalizedEmail = email.trim().toLowerCase()

    setLoading(true)
    setError("")
    setResult(null)
    setShowCreate(false)

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("email", normalizedEmail)
      .limit(1)

    setLoading(false)

    if (error) {
      setError("Алдаа гарлаа")
      return
    }

    if (!data || data.length === 0) {
      // ❌ хэрэглэгч байхгүй
      setError("Хэрэглэгч олдсонгүй")
      setShowCreate(true)
    } else {
      // ✅ хэрэглэгч байна
      setResult(data[0])
    }
  }

  const handleCreate = async () => {
    if (!firstName || !lastName) {
      alert("Нэр, овог оруулна уу")
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    setLoading(true)

    const { data: user } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          user_id: user.user?.id,
          first_name: firstName,
          last_name: lastName,
          email: normalizedEmail,
        },
      ])
      .select()
      .single()

    setLoading(false)

    if (error) {
      alert("Алдаа гарлаа")
    } else {
      setResult(data)
      setShowCreate(false)
      setError("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-2">
          Хэрэглэгч хайх
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Имэйл хаяг оруулна уу
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Имэйл</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl"
        >
          {loading ? "Хайж байна..." : "Хайх"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {error}
          </p>
        )}

        {/* CREATE */}
        {showCreate && (
          <div className="mt-6 border-t pt-6">

            <p className="text-sm mb-3 text-gray-600">
              Шинээр бүртгэх
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                placeholder="Нэр"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-3 py-2 border rounded-xl"
              />

              <input
                placeholder="Овог"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-3 py-2 border rounded-xl"
              />
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-green-600 text-white py-2 rounded-xl"
            >
              Бүртгэх
            </button>

          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="mt-6 p-4 border rounded-xl bg-white">

            <p className="font-semibold">
              {result.first_name} {result.last_name}
            </p>

            <p className="text-sm text-gray-500">
              {result.email}
            </p>

            <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl">
              Үйлчилгээ эхлүүлэх
            </button>

          </div>
        )}

      </div>
    </div>
  )
}