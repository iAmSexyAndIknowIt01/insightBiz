"use client"

import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()

  return (
    <div className="fixed top-4 left-0 w-full flex justify-center z-50 px-4">
      
      <nav className="
        flex items-center justify-between
        w-full max-w-5xl
        px-6 py-3
        rounded-full
        backdrop-blur-xl
        bg-white/70
        border border-white/30
        shadow-lg
      ">

        {/* LOGO */}
        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          InsightBiz
        </h1>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 text-gray-600 hover:text-black transition"
          >
            Нэвтрэх
          </button>

          <button
            onClick={() => router.push("/register")}
            className="
              bg-gradient-to-r from-indigo-600 to-purple-600
              text-white px-5 py-2
              rounded-full
              shadow-md
              hover:scale-105
              transition
            "
          >
            Эхлэх
          </button>
        </div>

      </nav>
    </div>
  )
}