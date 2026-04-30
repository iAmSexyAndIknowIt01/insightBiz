"use client"
import { motion } from "framer-motion"

const features = [
  {
    title: "Хэрэглэгчээ ойлго",
    desc: "Хэн хамгийн их үйлчлүүлж байгааг мэд",
  },
  {
    title: "Орлогоо өсгө",
    desc: "Зөв үед хямдрал зарла",
  },
  {
    title: "Шийдвэрээ сайжруул",
    desc: "Дата дээр суурилсан сонголт хий",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <h2 className="text-4xl font-bold text-center mb-16">
        Танд ямар ашигтай вэ?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="glass-light p-6 rounded-2xl"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}