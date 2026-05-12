import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Problem from "../components/Problem"
import Features from "../components/Features"
import CTA from "../components/CTA"
import Footer from "../components/Footer"
import Logos from "@/components/Logos"

export default function Home() {
  return (
    <main className="bg-linear-to-br from-indigo-50 via-white to-purple-50 text-gray-900">
      <Navbar />
      <Hero />
      <Logos />
      <Problem />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}