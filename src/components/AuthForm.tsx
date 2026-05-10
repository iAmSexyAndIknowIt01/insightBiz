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

        // 👉 user авах
        const { data: userData } = await supabase.auth.getUser()

        if (!userData.user) {
          throw new Error("User олдсонгүй")
        }

        const userId = userData.user.id

        // 👉 API дуудах (user_id дамжуулна)
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        // 🔥 LOG (хадгалахаас өмнө)
        console.log("✅ user_id:", data.user_id)
        console.log("✅ company_id:", data.company_id)

        // 👉 session хадгалах
        sessionStorage.setItem("user_id", data.user_id)
        sessionStorage.setItem("company_id", data.company_id)

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

      alert(
        mode === "company"
          ? `🎉 Компани бүртгэгдлээ!\nCode: ${data.company_code}`
          : "🎉 Амжилттай бүртгэгдлээ!"
      )

      router.push("/login")

    } catch (err: any) {
      setError(err.message || "Алдаа гарлаа")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white">

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode("user")}
                className={`flex-1 p-2 border rounded ${mode === "user" ? "bg-indigo-600 text-white" : ""}`}>
                👤 User
              </button>

              <button type="button" onClick={() => setMode("company")}
                className={`flex-1 p-2 border rounded ${mode === "company" ? "bg-indigo-600 text-white" : ""}`}>
                🏢 Company
              </button>
            </div>
          )}

          {!isLogin && mode === "company" && (
            <input
              placeholder="Компанийн нэр"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
          )}

          {!isLogin && mode === "user" && (
            <input
              placeholder="Company code"
              value={companyCode}
              onChange={(e) =>
                setCompanyCode(e.target.value.replace(/\D/g, ""))
              }
              maxLength={5}
              className="w-full px-4 py-3 border rounded-xl"
            />
          )}

          <input
            type="email"
            placeholder="Имэйл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            {loading ? "Түр хүлээнэ үү..." : isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>

        </form>
      </div>
    </div>
  )
}