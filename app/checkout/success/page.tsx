"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/i18n"

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart()
    const { t } = useLanguage()

    useEffect(() => {
        clearCart()
    }, [clearCart])

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="container flex-1 py-16 px-4 flex flex-col items-center justify-center text-center">
                <div className="size-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <CheckCircle className="size-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{t('checkout', 'success_title')}</h1>
                <p className="text-xl text-gray-400 max-w-md mb-8">
                    {t('checkout', 'success_msg')}
                </p>

                <div className="mt-8">
                    <Link href="/">
                        <Button size="lg" variant="minecraft">{t('checkout', 'return_home')}</Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    )
}
