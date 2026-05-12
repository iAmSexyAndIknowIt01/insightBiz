"use client"
import { motion } from "framer-motion"

export default function CTA() {
  return (
    <section className="py-32 px-6 text-center">

      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl md:text-5xl font-bold mb-6"
      >
        Бизнесээ дараагийн түвшинд аваач 🚀
      </motion.h2>

      <p className="text-gray-600 mb-10">
        Одоо эхэл — 7 хоног үнэгүй
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl shadow-xl"
      >
        Үнэгүй эхлэх
      </motion.button>

    </section>
  )
}