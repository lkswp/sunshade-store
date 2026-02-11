"use client"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Hero } from "@/components/home/Hero"
import { Features } from "@/components/home/Features"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
