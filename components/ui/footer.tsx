"use client" // Must be client for useLanguage

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n"

export function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="w-full border-t border-white/5 bg-[#0d0312] py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

            <div className="container flex flex-col md:flex-row items-center justify-between gap-8 px-4 text-center md:text-left relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative size-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                        <Image
                            src="/logo.png"
                            alt="SunShade Logo"
                            fill
                            className="object-contain rendering-pixelated"
                        />
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-xl font-bold text-white tracking-wide">SUN<span className="text-primary">SHADE</span></h3>
                        <p className="text-sm text-gray-500 max-w-xs mt-1">
                            {t('footer', 'desc')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center md:items-end">
                    <div className="flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/terms" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                            {t('footer', 'terms')}
                        </Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                            {t('footer', 'privacy')}
                        </Link>
                        <Link href="/rules" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                            {t('nav', 'rules')}
                        </Link>
                    </div>
                    <div className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} SunShade Network. {t('footer', 'rights')}
                        <br />
                        {t('footer', 'affiliation')}
                    </div>
                </div>
            </div>
        </footer>
    )
}
