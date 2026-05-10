"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Props = {
  type: "login" | "register"
}

export default function AuthForm({ type }: Props) {
  const isLogin = type === "login"
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [mode, setMode] = useState<"user" | "company">("user")

  const [companyName, setCompanyName] = useState("")
  const [companyCode, setCompanyCode] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validate = () => {
    if (!email.includes("@")) return "Имэйл буруу байна"
    if (password.length < 6) return "Нууц үг хамгийн багадаа 6 тэмдэгт"

    if (!isLogin) {
      if (mode === "company" && !companyName.trim()) {
        return "Компанийн нэр оруулна уу"
      }

      if (mode === "user") {
        if (!companyCode) return "Company code оруулна уу"
        if (companyCode.length !== 5)
          return "Company code 5 оронтой байх ёстой"
      }
    }

    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    try {
      // ======================
      // 🔐 LOGIN
      // ======================
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push("/dashboard")
        return
      }

      // ======================
      // 📝 REGISTER
      // ======================
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          mode,
          company_name: companyName,
          company_code: companyCode,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      if (mode === "company") {
        alert(
          `🎉 Компани амжилттай бүртгэгдлээ!\n\nТаны код: ${data.company_code}`
        )
      } else {
        alert("🎉 Амжилттай бүртгэгдлээ!")
      }

      router.push("/login")

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md glass-light p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* MODE */}
          {!isLogin && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("user")
                  setError("")
                }}
                className={`flex-1 p-2 border rounded ${
                  mode === "user" ? "bg-indigo-600 text-white" : ""
                }`}
              >
                👤 User
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("company")
                  setError("")
                }}
                className={`flex-1 p-2 border rounded ${
                  mode === "company" ? "bg-indigo-600 text-white" : ""
                }`}
              >
                🏢 Company
              </button>
            </div>
          )}

          {/* COMPANY NAME */}
          {!isLogin && mode === "company" && (
            <input
              placeholder="Компанийн нэр"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
          )}

          {/* COMPANY CODE */}
          {!isLogin && mode === "user" && (
            <input
              placeholder="Company code (5 оронтой)"
              value={companyCode}
              onChange={(e) =>
                setCompanyCode(e.target.value.replace(/\D/g, ""))
              }
              maxLength={5}
              className="w-full px-4 py-3 border rounded-xl"
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Имэйл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading
              ? "Түр хүлээнэ үү..."
              : isLogin
              ? "Нэвтрэх"
              : "Бүртгүүлэх"}
          </button>

        </form>
      </div>
    </div>
  )
}