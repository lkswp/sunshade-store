"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/i18n"

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const pathname = usePathname()
    const { language, setLanguage, t } = useLanguage()
    const { items } = useCart()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleLanguage = () => {
        setLanguage(language === 'pt' ? 'en' : 'pt')
    }

    const uniqueItemsCount = items.length
    const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md transition-all duration-300",
                isScrolled ? "shadow-md shadow-primary/5 py-2" : "py-4"
            )}
        >
            <div className="container flex items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                    <div className="relative size-12 drop-shadow-lg">
                        <Image
                            src="/logo.png"
                            alt="SunShade Logo"
                            fill
                            className="object-contain rendering-pixelated"
                        />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-white hidden sm:block">
                        SUN<span className="text-primary">SHADE</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide uppercase text-gray-300">
                    <Link
                        href="/"
                        className={cn(
                            "transition-all duration-200 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(152,209,33,0.8)]",
                            pathname === "/" ? "text-primary drop-shadow-[0_0_8px_rgba(152,209,33,0.8)]" : ""
                        )}
                    >
                        {t('nav', 'home')}
                    </Link>
                    <Link
                        href="/store"
                        className={cn(
                            "transition-all duration-200 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(152,209,33,0.8)]",
                            pathname === "/store" ? "text-primary drop-shadow-[0_0_8px_rgba(152,209,33,0.8)]" : ""
                        )}
                    >
                        {t('nav', 'store')}
                    </Link>
                    <Link
                        href="/rules"
                        className={cn(
                            "transition-all duration-200 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(152,209,33,0.8)]",
                            pathname === "/rules" ? "text-primary drop-shadow-[0_0_8px_rgba(152,209,33,0.8)]" : ""
                        )}
                    >
                        {t('nav', 'rules')}
                    </Link>
                    <Link
                        href="/discord"
                        className={cn(
                            "transition-all duration-200 hover:text-[#5865F2] hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.8)]",
                            pathname === "/discord" ? "text-[#5865F2] drop-shadow-[0_0_8px_rgba(88,101,242,0.8)]" : ""
                        )}
                    >
                        {t('nav', 'discord')}
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-white hover:bg-primary/20 font-mono">
                        {language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
                    </Button>

                    <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/20 text-white">
                        <Menu className="size-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>

                    <Link href={items.length > 0 ? "/checkout" : "/store"}>
                        <Button variant="minecraft" className={cn("hidden md:flex gap-2 shadow-lg shadow-primary/20 transition-all", items.length > 0 ? "animate-pulse" : "")}>
                            <ShoppingCart className="size-4" />
                            {items.length > 0 ? (
                                <span>{t('nav', 'cart')} ({totalItemsCount})</span>
                            ) : (
                                <span>{t('nav', 'store')}</span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
