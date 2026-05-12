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
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        const { data: userData } = await supabase.auth.getUser()

        if (!userData.user) {
          throw new Error("User олдсонгүй")
        }

        const userId = userData.user.id

        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        console.log("✅ user_id:", data.user_id)
        console.log("✅ company_id:", data.company_id)

        sessionStorage.setItem("user_id", data.user_id)
        sessionStorage.setItem("company_id", data.company_id)

        router.push("/dashboard")
        return
      }

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
    <div className="min-h-screen flex items-center justify-center px-6 bg-linear-to-br from-indigo-50 via-white to-purple-50">

      <div className="w-full max-w-md">

        {/* 🔥 LOGO (CLICKABLE) */}
        <div className="text-center mb-8">
          <h1
            onClick={() => router.push("/")}
            className="text-3xl font-extrabold cursor-pointer bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition"
          >
            InsightBiz
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? "Системд нэвтрэх" : "Шинэ бүртгэл үүсгэх"}
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8 space-y-5">

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode("user")}
                  className={`flex-1 py-2 rounded-lg text-sm transition ${
                    mode === "user"
                      ? "bg-white shadow font-medium"
                      : "text-gray-500"
                  }`}
                >
                  👤 User
                </button>

                <button
                  type="button"
                  onClick={() => setMode("company")}
                  className={`flex-1 py-2 rounded-lg text-sm transition ${
                    mode === "company"
                      ? "bg-white shadow font-medium"
                      : "text-gray-500"
                  }`}
                >
                  🏢 Company
                </button>
              </div>
            )}

            {!isLogin && mode === "company" && (
              <input
                placeholder="Компанийн нэр"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="input"
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
                className="input"
              />
            )}

            <input
              type="email"
              placeholder="Имэйл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />

            <input
              type="password"
              placeholder="Нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] transition shadow-md"
            >
              {loading
                ? "Түр хүлээнэ үү..."
                : isLogin
                ? "Нэвтрэх"
                : "Бүртгүүлэх"}
            </button>

          </form>

          {/* SWITCH */}
          <p className="text-sm text-center text-gray-500">
            {isLogin ? "Бүртгэлгүй юу?" : "Бүртгэлтэй юу?"}{" "}
            <span
              onClick={() =>
                router.push(isLogin ? "/register" : "/login")
              }
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              {isLogin ? "Бүртгүүлэх" : "Нэвтрэх"}
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}