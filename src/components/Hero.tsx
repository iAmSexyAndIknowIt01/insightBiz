"use client"

export default function Hero() {
  // 👉 dummy logos (дараа нь real logo image сольж болно)
  const logos = [
    "Google",
    "Amazon",
    "Meta",
    "Netflix",
    "Apple",
    "Tesla",
    "Stripe",
    "Shopify",
  ]

  return (
    <section className="pt-40 pb-32 px-6 text-center relative overflow-hidden">

      {/* background glow */}
      <div className="absolute -top-25 left-1/2 -translate-x-1/2 w-200 h-200 bg-indigo-400 opacity-20 blur-[200px]" />

      {/* TITLE */}
      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
        Data ашиглан
        <br />
        <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          бизнесээ өсгө
        </span>
      </h1>

      {/* DESC */}
      <p className="text-gray-600 max-w-xl mx-auto mb-10 text-lg">
        InsightBiz ашиглан бизнесийн шийдвэрээ дата дээр суурилуул
      </p>

      {/* CTA */}
      <div className="flex justify-center gap-4 flex-wrap mb-16">
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition">
          🚀 Үнэгүй эхлэх
        </button>

        <button className="border px-8 py-4 rounded-xl hover:bg-gray-100 transition">
          ▶ Demo үзэх
        </button>
      </div>

      {/* 🔥 LOGO CAROUSEL */}
      <div className="relative overflow-hidden">

        {/* fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-linear-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-24 bg-linear-to-l from-white to-transparent z-10" />

        <div className="flex gap-10 animate-scroll whitespace-nowrap">
          {/* double render for infinite loop */}
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="px-6 py-3 bg-white rounded-xl shadow text-gray-700 font-semibold"
            >
              {logo}
            </div>
          ))}
        </div>

      </div>

    </section>
  )
}