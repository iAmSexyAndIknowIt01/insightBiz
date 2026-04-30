"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NewCustomer() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!firstName || !lastName) {
      alert("Нэр болон овог заавал оруулна")
      return
    }

    setLoading(true)

    const { data: user } = await supabase.auth.getUser()

    const client_id = sessionStorage.getItem("user_id")
    console.log("Client ID from sessionStorage:", client_id)

    const { error } = await supabase.from("customers").insert([
      {
        user_id: client_id,
        first_name: firstName,
        last_name: lastName,
        email,
        age: age ? Number(age) : null,
        gender,
      },
    ])

    setLoading(false)

    if (!error) {
      setSuccess(true)

      // reset form
      setFirstName("")
      setLastName("")
      setEmail("")
      setAge("")
      setGender("")
    } else {
      alert("Алдаа гарлаа")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-2">
          Шинэ хэрэглэгч
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Мэдээллээ оруулна уу
        </p>

        {/* NAME ROW */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-sm text-gray-500">Нэр</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Бат"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Овог</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Батболд"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Имэйл</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="example@email.com"
          />
        </div>

        {/* AGE + GENDER */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="text-sm text-gray-500">Нас</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="25"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Хүйс</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Сонгох</option>
              <option value="male">Эр</option>
              <option value="female">Эм</option>
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
        </button>

        {/* SUCCESS */}
        {success && (
          <p className="text-green-500 text-sm mt-4 text-center">
            ✔ Амжилттай бүртгэгдлээ
          </p>
        )}

      </div>
    </div>
  )
}