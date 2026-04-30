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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) throw loginError

        // 👇 USER ID авах
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData.user?.id

        // 👇 SESSION-д хадгалах
        if (userId) {
          sessionStorage.setItem("user_id", userId)
          console.log("User ID saved to sessionStorage:", userId)
        }

        // 👇 MODE шалгах
        const mode = sessionStorage.getItem("mode")

        if (mode === "client") {
          sessionStorage.removeItem("mode")
          router.push("/client")
        } else {
          router.push("/dashboard")
        }

      } else {
        // 📝 REGISTER
        const { error: registerError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (registerError) throw registerError

        alert("Бүртгэл амжилттай! Email баталгаажуулна уу.")
        router.push("/login")
      }

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

          <input
            type="email"
            placeholder="Имэйл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
            required
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            {loading ? "Түр хүлээнэ үү..." : isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "Бүртгэлгүй юу?" : "Аль хэдийн бүртгэлтэй юу?"}{" "}
          <a
            href={isLogin ? "/register" : "/login"}
            className="text-indigo-600"
          >
            {isLogin ? "Бүртгүүлэх" : "Нэвтрэх"}
          </a>
        </p>

      </div>
    </div>
  )
}