"use client"
import { motion } from "framer-motion"

export default function Problem() {
  return (
    <section className="py-28 px-6 text-center">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-6"
      >
        Та бизнесээ таамгаар удирдаж байна уу?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-gray-600 max-w-2xl mx-auto text-lg"
      >
        Аль бүтээгдэхүүн ашигтай, аль хэрэглэгч үнэ цэнэтэйг мэдэхгүйгээр
        бизнесээ удирдах нь эрсдэлтэй.
      </motion.p>

    </section>
  )
}