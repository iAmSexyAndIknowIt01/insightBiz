"use client"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="text-center py-32 px-6 relative overflow-hidden">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
      >
        Таны бизнесийн
        <span className="text-indigo-600"> өгөгдөл </span>
        таны өсөлтийн түлхүүр
      </motion.h1>

      <p className="text-gray-600 max-w-xl mx-auto mb-10 text-lg">
        InsightBiz ашиглан хэрэглэгчдийн зан төлөвийг ойлгож,
        илүү ухаалаг шийдвэр гаргаж орлогоо өсгө
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl glow-light">
          Үнэгүй эхлэх
        </button>

        <button className="border px-8 py-4 rounded-xl">
          Demo үзэх
        </button>
      </div>

      {/* Dashboard preview */}
      <div className="mt-20 max-w-4xl mx-auto glass-light p-6 rounded-2xl shadow-lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl">
            <p className="text-gray-500 text-sm">Customers</p>
            <p className="text-2xl font-bold">1,240</p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <p className="text-gray-500 text-sm">Revenue</p>
            <p className="text-2xl font-bold">₮8.2M</p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <p className="text-gray-500 text-sm">Growth</p>
            <p className="text-2xl font-bold text-green-500">+22%</p>
          </div>
        </div>
      </div>

    </section>
  )
}