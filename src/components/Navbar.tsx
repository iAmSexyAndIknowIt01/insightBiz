"use client"

import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()

  const handleClientClick = () => {
    sessionStorage.setItem("mode", "client")
    router.push("/login")
  }

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50 glass-light">
      
      <h1 className="text-xl font-bold">InsightBiz</h1>

      <div className="flex items-center gap-3">
        
        <button
          onClick={handleClientClick}
          className="px-4 py-2 text-gray-700 hover:text-black"
        >
          My Client
        </button>
        
        <a
          href="/login"
          className="px-4 py-2 text-gray-700 hover:text-black"
        >
          Нэвтрэх
        </a>

        <a
          href="/register"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          Бүртгүүлэх
        </a>

      </div>
    </nav>
  )
}