"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n"

import { toast } from "sonner"
import { Copy, Check, ChevronRight, Star, Shield, Zap, Trophy, Users, Sword, Skull, Pickaxe, ShoppingBag } from "lucide-react"

// ... imports

export default function Home() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copyIp = () => {
    navigator.clipboard.writeText("play.sunshade.net")
    toast.success(t('hero', 'ip_copied'), {
      description: "IP: play.sunshade.net",
      style: {
        background: '#140518',
        borderColor: '#98D121',
        color: 'white',
      }
    })
  }

  const handleCopyIp = () => {
    navigator.clipboard.writeText("play.sunshade.net");
    setCopied(true);
    toast.success(t('hero', 'ip_copied'), {
      description: "IP: play.sunshade.net",
      style: {
        background: '#140518',
        borderColor: '#98D121',
        color: 'white',
      }
    });
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };
  // ...
  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <main>
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/hero-bg.png"
              alt="Minecraft background"
              fill
              className="object-cover opacity-80 blur-[2px]"
              priority
            />
            {/* Overlay Gradient for atmospheric depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#120b1e] z-10"></div>
            <div className="absolute inset-0 bg-black/20 z-10"></div>
          </motion.div>

          {/* Floating Particles (Simulated) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/20 rounded-full blur-sm animate-pulse duration-[3000ms]"></div>
            <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-500/20 rounded-full blur-md animate-bounce duration-[5000ms]"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/30 rounded-full blur-[1px] animate-ping duration-[4000ms]"></div>
          </div>

          <div className="relative z-20 container px-4 flex flex-col items-center">

            {/* Server Status / Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex items-center gap-2"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-green-400">Online & Stable</span>
            </motion.div>

            {/* Main Title - Staggered Reveal */}
            <div className="mb-2">
              <motion.h1
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-tight leading-none"
              >
                {t('hero', 'title_part1')}
              </motion.h1>
            </div>
            <div className="mb-8">
              <motion.h1
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#b9fbc0] to-primary drop-shadow-[0_0_30px_rgba(74,222,128,0.3)] tracking-tight leading-none"
              >
                {t('hero', 'title_part2')}
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-md"
            >
              {t('hero', 'description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-5 w-full justify-center items-center"
            >
              <Button
                size="lg"
                variant="minecraft"
                className="h-16 px-10 text-xl shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:shadow-[0_0_40px_rgba(74,222,128,0.6)] transition-all duration-300 hover:-translate-y-1"
                onClick={() => {
                  window.location.href = '/store';
                }}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  {t('hero', 'visit_store')}
                </div>
              </Button>

              <div className="relative group">
                <Button
                  size="lg"
                  className="h-16 px-8 text-lg bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white transition-all hover:scale-105 active:scale-95"
                  onClick={handleCopyIp}
                >
                  <div className="flex items-center gap-3">
                    {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6 text-gray-400 group-hover:text-white" />}
                    <span className="font-mono tracking-wider">play.sunshade.net</span>
                  </div>
                </Button>
                {/* Glow effect behind copy button */}
                <div className="absolute inset-0 bg-white/5 blur-xl -z-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest text-white/50">Scroll</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
            </motion.div>
          </motion.div>
        </section>

        {/* Servers Section */}
        <section className="py-32 relative bg-black/95 overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[500px] bg-primary/5 blur-[150px] rounded-full pointing-events-none opacity-50"></div>

          <div className="container px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                {t('features', 'why_choose')} <span className="text-primary">{t('features', 'servers')}</span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
                {t('features', 'servers_description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Survival RPG */}
              <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 p-4 bg-primary/10 w-fit rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Sword className="size-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t('features', 'survival_title')}</h3>
                <p className="text-white/50 leading-relaxed mb-8 h-24">
                  {t('features', 'survival_desc')}
                </p>
                <div className="flex items-center text-primary font-bold text-sm tracking-wide uppercase group-hover:gap-2 transition-all">
                  {t('features', 'join_now')} <ChevronRight className="size-4 ml-1" />
                </div>
              </div>

              {/* Semi-Anarchy */}
              <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 p-4 bg-red-500/10 w-fit rounded-xl group-hover:bg-red-500/20 transition-colors">
                  <Skull className="size-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t('features', 'anarchy_title')}</h3>
                <p className="text-white/50 leading-relaxed mb-8 h-24">
                  {t('features', 'anarchy_desc')}
                </p>
                <div className="flex items-center text-red-500 font-bold text-sm tracking-wide uppercase group-hover:gap-2 transition-all">
                  {t('features', 'join_now')} <ChevronRight className="size-4 ml-1" />
                </div>
              </div>

              {/* Rankup */}
              <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 opacity-75">
                <div className="absolute top-6 right-6 px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                  {t('features', 'dev_badge')}
                </div>
                <div className="mb-6 p-4 bg-purple-500/10 w-fit rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Pickaxe className="size-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t('features', 'rankup_title')}</h3>
                <p className="text-white/50 leading-relaxed mb-8 h-24">
                  {t('features', 'rankup_desc')}
                </p>
                <div className="flex items-center text-purple-500/50 font-bold text-sm tracking-wide uppercase cursor-not-allowed">
                  {t('features', 'coming_soon')}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
