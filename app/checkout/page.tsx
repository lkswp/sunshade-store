"use client"

import { useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, CreditCard, ShoppingBag, CheckCircle, FileText } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function CheckoutPage() {
    const { t } = useLanguage()
    const { items, removeItem, total, clearCart, username } = useCart()
    const [isProcessing, setIsProcessing] = useState(false)
    const [coupon, setCoupon] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("pix")
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const [pixData, setPixData] = useState<{ code: string, base64: string } | null>(null)

    const handleCheckout = async () => {
        if (!agreedToTerms) {
            toast.error(t('checkout', 'terms_required_title'), {
                description: t('checkout', 'terms_required_msg'),
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            return
        }

        if (!username) {
            toast.error(t('checkout', 'username_required_title'), {
                description: t('checkout', 'username_required_msg'),
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            return
        }

        setIsProcessing(true)

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items,
                    username: username
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed')
            }

            setIsProcessing(false)
            setIsSuccess(true)
            clearCart()

            if (data.qrCode && data.qrCodeBase64) {
                setPixData({ code: data.qrCode, base64: data.qrCodeBase64 })
            }

            toast.success(t('checkout', 'success_title'), {
                description: t('checkout', 'success_msg'),
                style: { background: '#051405', borderColor: '#98D121', color: 'white' }
            })
        } catch (error) {
            setIsProcessing(false)
            toast.error(t('checkout', 'checkout_failed'), {
                description: error instanceof Error ? error.message : t('checkout', 'generic_error'),
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Navbar />
                <main className="container flex-1 py-16 px-4 flex flex-col items-center justify-center text-center">
                    {pixData ? (
                        <div className="max-w-md w-full bg-card/30 p-8 rounded-3xl border border-white/10 animate-in zoom-in duration-500">
                            <div className="size-16 bg-[#00BFA5]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <span className="text-3xl">💠</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">{t('checkout', 'scan_pay')}</h1>
                            <p className="text-gray-400 mb-6">{t('checkout', 'scan_desc')}</p>

                            <div className="bg-white p-4 rounded-xl mb-6 inline-block">
                                <img
                                    src={`data:image/jpeg;base64,${pixData.base64}`}
                                    alt="PIX QR Code"
                                    className="w-64 h-64"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-black/40 rounded-lg border border-white/5 break-all text-xs text-gray-400 font-mono">
                                    {pixData.code}
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-[#00BFA5] text-[#00BFA5] hover:bg-[#00BFA5]/10"
                                    onClick={() => {
                                        navigator.clipboard.writeText(pixData.code)
                                        toast.success(t('checkout', 'pix_copied'))
                                    }}
                                >
                                    {t('checkout', 'copy_pix')}
                                </Button>
                            </div>

                            <p className="mt-6 text-sm text-gray-500">
                                {t('checkout', 'paid_verify')}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="size-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                                <CheckCircle className="size-12 text-primary" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4">{t('checkout', 'success_title')}</h1>
                            <p className="text-xl text-gray-400 max-w-md mb-8">
                                {t('checkout', 'success_msg')}
                            </p>
                        </>
                    )}

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

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="container flex-1 py-16 px-4">
                <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                    <ShoppingBag className="size-8 text-primary" />
                    {t('checkout', 'title')}
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 rounded-3xl border border-white/5">
                        <p className="text-2xl text-gray-400 mb-6">{t('checkout', 'empty_cart')}</p>
                        <Link href="/store">
                            <Button variant="minecraft">{t('checkout', 'go_store')}</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card/30 rounded-3xl border border-white/5 overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <h2 className="font-bold text-lg text-white">{t('checkout', 'your_items')} ({items.length})</h2>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-white/5 transition-colors">
                                            <div className="size-20 bg-black/40 rounded-xl flex items-center justify-center text-3xl shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                                                {item.id.includes("rank") ? "👑" : item.id.includes("crate") ? "📦" : "💰"}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                                <p className="text-sm text-gray-400">{t('checkout', 'quantity')}: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white mb-2">${(item.price * item.quantity).toFixed(2)}</div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="size-4 mr-2" /> {t('checkout', 'remove')}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            <div className="bg-card/30 rounded-3xl border border-white/5 p-8 sticky top-24">
                                <h2 className="font-bold text-xl text-white mb-6">{t('checkout', 'order_summary')}</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>{t('checkout', 'subtotal')}</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>{t('checkout', 'taxes')}</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="h-px bg-white/10"></div>
                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>{t('checkout', 'total')}</span>
                                        <span className="text-primary">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <label className="text-sm font-bold text-gray-400 uppercase">Payment Method</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={() => setPaymentMethod("pix")}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "pix" ? "border-[#00BFA5] bg-[#00BFA5]/10 text-white" : "border-white/10 bg-black/20 text-gray-400 hover:bg-white/5"}`}
                                        >
                                            <span className="text-3xl">💠</span>
                                            <span className="text-lg font-bold">{t('checkout', 'pix_method')}</span>
                                            <span className="text-xs text-[#00BFA5] font-mono">{t('checkout', 'instant_approval')}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-8">
                                    <Input
                                        placeholder="Coupon Code"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        className="bg-black/20 border-white/10 text-white"
                                    />
                                    <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">Apply</Button>
                                </div>

                                {/* Terms Agreement Section */}
                                <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="mt-1 size-4 rounded border-white/30 bg-black/50 text-primary focus:ring-primary/50"
                                        />
                                        <label htmlFor="terms" className="text-sm text-gray-300 leading-snug cursor-pointer select-none">
                                            {t('checkout', 'terms_agreement')} <br />
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <span className="text-primary hover:underline cursor-pointer font-bold inline-flex items-center gap-1">
                                                        <FileText className="size-3" /> {t('checkout', 'terms_link')}
                                                    </span>
                                                </DialogTrigger>
                                                <DialogContent className="bg-[#1a0b2e] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold mb-4">{t('terms', 'title')}</DialogTitle>
                                                        <DialogDescription className="text-gray-400 mb-4">{t('terms', 'intro')}</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-6 text-sm text-gray-300 leading-relaxed pr-2">
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">{t('terms', 'section1_title')}</h3>
                                                            <p>{t('terms', 'section1_content')}</p>
                                                        </section>
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">{t('terms', 'section2_title')}</h3>
                                                            <p>{t('terms', 'section2_content')}</p>
                                                        </section>
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">{t('terms', 'section3_title')}</h3>
                                                            <p>{t('terms', 'section3_content')}</p>
                                                        </section>
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">{t('terms', 'section4_title')}</h3>
                                                            <p>{t('terms', 'section4_content')}</p>
                                                        </section>
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">{t('terms', 'section5_title')}</h3>
                                                            <p>{t('terms', 'section5_content')}</p>
                                                        </section>
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">{t('terms', 'section6_title')}</h3>
                                                            <p>{t('terms', 'section6_content')}</p>
                                                        </section>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </label>
                                    </div>
                                </div>

                                <Button
                                    className="w-full py-6 text-lg shadow-lg shadow-primary/20"
                                    variant="minecraft"
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? t('checkout', 'processing') : t('checkout', 'complete_purchase')}
                                </Button>

                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
