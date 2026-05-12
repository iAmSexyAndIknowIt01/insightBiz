"use client"
import { motion } from "framer-motion"

const features = [
  {
    title: "📊 Data Analytics",
    desc: "Орлого, хэрэглэгч, өсөлтийг realtime хар",
  },
  {
    title: "🎯 Smart Decision",
    desc: "Дата дээр суурилсан шийдвэр гарга",
  },
  {
    title: "💰 Revenue Growth",
    desc: "Орлогоо тогтвортой өсгө",
  },
]

export default function Features() {
  return (
    <section className="py-28 px-6">

      <h2 className="text-4xl font-bold text-center mb-16">
        Яагаад InsightBiz вэ?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>

    </section>
  )
}