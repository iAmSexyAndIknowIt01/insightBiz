"use client"

import { useRouter } from "next/navigation"

export default function Footer() {
  const router = useRouter()

  return (
    <footer className="relative mt-32">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-linear-to-tr from-indigo-100 via-white to-purple-100 opacity-70 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* 🚀 CTA BOX */}
        <div className="mb-16 rounded-3xl bg-linear-to-r from-indigo-600 to-purple-600 text-white p-10 md:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Бизнесээ өсгөхөд бэлэн үү? 🚀
            </h2>
            <p className="text-white/80">
              InsightBiz ашиглан өгөгдөл дээр суурилсан шийдвэр гарга
            </p>
          </div>

          <button
            onClick={() => router.push("/register")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            Үнэгүй эхлэх
          </button>
        </div>

        {/* 🔗 MAIN GRID */}
        <div className="grid md:grid-cols-4 gap-10 pb-14">

          {/* BRAND */}
          <div>
            <h2 className="text-xl font-bold mb-4 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              InsightBiz
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              ЖДҮ-д зориулсан data-driven платформ. Орлогоо өсгөж,
              хэрэглэгчээ илүү сайн ойлго.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="hover:text-indigo-600 cursor-pointer transition">
                Features
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition">
                Pricing
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition">
                Demo
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="hover:text-indigo-600 cursor-pointer transition">
                About
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition">
                Contact
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition">
                Careers
              </li>
            </ul>
          </div>

          {/* 📩 NEWSLETTER */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>

            <p className="text-gray-600 text-sm mb-4">
              Шинэ боломж, update-уудыг эхэлж мэдээрэй
            </p>

            <div className="flex items-center bg-white border rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">

              <input
                type="email"
                placeholder="Имэйл хаяг"
                className="px-4 py-2 w-full text-sm outline-none"
              />

              <button className="bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 transition">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* 🔻 BOTTOM */}
        <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          © 2026 InsightBiz. All rights reserved.
        </div>

      </div>
    </footer>
  )
}