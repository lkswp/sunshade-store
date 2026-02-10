"use client"

import { useState, useEffect, useRef } from "react"
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
    const { items, removeItem, total, clearCart, username } = useCart()
    const [email, setEmail] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [couponCode, setCouponCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [couponApplied, setCouponApplied] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CHECKOUT_PRO'>('PIX')
    const [pixData, setPixData] = useState<{ qrCode: string, qrCodeBase64: string, ticketUrl: string } | null>(null)
    const [pixPaymentId, setPixPaymentId] = useState<string | null>(null)
    const pollingRef = useRef<NodeJS.Timeout | null>(null)

    // PIX Payment Polling - check every 5 seconds if payment was approved
    useEffect(() => {
        if (pixData && pixPaymentId) {
            pollingRef.current = setInterval(async () => {
                try {
                    const res = await fetch(`/api/checkout/check-status?paymentId=${pixPaymentId}`)
                    const data = await res.json()

                    if (data.status === 'PAID') {
                        // Payment confirmed!
                        if (pollingRef.current) clearInterval(pollingRef.current)
                        clearCart()
                        toast.success("Pagamento Confirmado! ✅", {
                            description: "Seus itens serão entregues em instantes.",
                            style: { background: '#051405', borderColor: '#98D121', color: 'white' }
                        })
                        setTimeout(() => {
                            window.location.href = '/checkout/success'
                        }, 2000)
                    } else if (data.status === 'REJECTED') {
                        if (pollingRef.current) clearInterval(pollingRef.current)
                        toast.error("Pagamento Rejeitado", {
                            style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
                        })
                        setPixData(null)
                        setPixPaymentId(null)
                    }
                } catch (e) {
                    // Ignore polling errors, will retry
                }
            }, 5000) // Check every 5 seconds
        }

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current)
        }
    }, [pixData, pixPaymentId, clearCart])

    const finalTotal = Math.max(0, total - (total * (discount / 100)))

    const handleApplyCoupon = async () => {
        if (!couponCode) return
        setIsProcessing(true)
        try {
            const res = await fetch(`/api/checkout/validate-coupon?code=${couponCode}`)
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Cupom inválido")

            setDiscount(data.discount)
            setCouponApplied(true)
            toast.success(`Cupom aplicado: ${data.discount}% de desconto!`, {
                style: { background: '#051405', borderColor: '#98D121', color: 'white' }
            })
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao aplicar cupom")
            setDiscount(0)
            setCouponApplied(false)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCheckout = async () => {
        if (!agreedToTerms) {
            toast.error("Termos Necessários", {
                description: "Você precisa aceitar os termos para continuar.",
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            return
        }

        if (!username) {
            toast.error("Username Necessário", {
                description: "Por favor, digite seu nick do Minecraft.",
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            return
        }

        if (paymentMethod === 'CHECKOUT_PRO' && !email) {
            toast.error("Email Necessário", {
                description: "Por favor, informe um email para o Mercado Pago.",
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            return
        }

        if (paymentMethod === 'CHECKOUT_PRO' && !/\S+@\S+\.\S+/.test(email)) {
            toast.error("Email Inválido", {
                description: "Por favor, informe um email válido.",
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            return
        }

        setIsProcessing(true)
        setPixData(null)

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items,
                    username: username,
                    email: email,
                    paymentMethod: paymentMethod,
                    couponCode: couponApplied ? couponCode : null // Send coupon if applied
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Falha no Checkout')
            }

            if (data.url) {
                // Redirect to Mercado Pago
                window.location.href = data.url
            } else if (data.pixData) {
                // Show PIX Modal + start polling
                setPixData(data.pixData)
                setPixPaymentId(data.pixData.paymentId?.toString() || null)
                setIsProcessing(false)
                toast.success("QR Code Gerado!", {
                    description: "Escaneie o código para pagar.",
                    style: { background: '#051405', borderColor: '#98D121', color: 'white' }
                })
            } else {
                throw new Error("Resposta inválida do servidor")
            }

        } catch (error) {
            setIsProcessing(false)
            toast.error("Erro no Checkout", {
                description: error instanceof Error ? error.message : "Erro genérico",
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
        }
    }

    const copyPix = () => {
        if (pixData?.qrCode) {
            navigator.clipboard.writeText(pixData.qrCode)
            toast.success("Código PIX Copiado!", {
                style: { background: '#051405', borderColor: '#98D121', color: 'white' }
            })
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="container flex-1 py-16 px-4">
                <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                    <ShoppingBag className="size-8 text-primary" />
                    Checkout
                </h1>

                {/* PIX MODAL if pixData exists */}
                <Dialog open={!!pixData} onOpenChange={(open) => {
                    if (!open) setPixData(null) // Allow closing
                }}>
                    <DialogContent className="bg-[#1a0b2e] border-white/10 text-white sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl font-bold text-primary flex items-center justify-center gap-2">
                                <span className="text-3xl">💠</span> Pagamento via PIX
                            </DialogTitle>
                            <DialogDescription className="text-center text-gray-400">
                                Escaneie o QR Code ou copie o código abaixo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-6 py-4">
                            {pixData?.qrCodeBase64 && (
                                <div className="bg-white p-4 rounded-xl">
                                    <img
                                        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                        alt="PIX QR Code"
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>
                            )}

                            <div className="w-full space-y-2">
                                <p className="text-xs text-center text-gray-500 uppercase tracking-widest">Copia e Cola</p>
                                <div className="flex gap-2">
                                    <Input
                                        value={pixData?.qrCode || ''}
                                        readOnly
                                        className="bg-black/50 border-white/10 font-mono text-xs text-gray-300"
                                    />
                                    <Button onClick={copyPix} variant="outline" size="icon" className="shrink-0 border-white/10 hover:bg-white/10">
                                        <CheckCircle className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-sm text-yellow-500 animate-pulse">
                                    Aguardando pagamento...
                                </p>
                                <p className="text-xs text-gray-500">
                                    Assim que pagar, você receberá seus itens em até 5 minutos.
                                </p>
                            </div>

                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => window.location.href = '/checkout/success'}
                            >
                                Já Paguei
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 rounded-3xl border border-white/5">
                        <p className="text-2xl text-gray-400 mb-6">Seu carrinho está vazio</p>
                        <Link href="/store">
                            <Button variant="minecraft">Ir para Loja</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card/30 rounded-3xl border border-white/5 overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <h2 className="font-bold text-lg text-white">Seus Itens ({items.length})</h2>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-white/5 transition-colors">
                                            <div className="size-20 bg-black/40 rounded-xl flex items-center justify-center text-3xl shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                                                {item.id.includes("rank") ? "👑" : item.id.includes("crate") ? "📦" : "💰"}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                                <p className="text-sm text-gray-400">Quantidade: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white mb-2">R${(item.price * item.quantity).toFixed(2)}</div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="size-4 mr-2" /> Remover
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
                                <h2 className="font-bold text-xl text-white mb-6">Resumo do Pedido</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>R${total.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Desconto ({discount}%)</span>
                                            <span>-R${(total * (discount / 100)).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-white/10"></div>
                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-primary">R${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="mb-8 space-y-3">
                                    <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Forma de Pagamento</label>

                                    <div
                                        onClick={() => setPaymentMethod('PIX')}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'PIX' ? 'border-primary bg-primary/10' : 'border-white/10 bg-black/20 hover:bg-white/5'}`}
                                    >
                                        <div className="text-2xl">💠</div>
                                        <div>
                                            <div className="font-bold text-white">PIX (Instantâneo)</div>
                                            <div className="text-xs text-gray-400">Gerar QR Code agora</div>
                                        </div>
                                        {paymentMethod === 'PIX' && <div className="ml-auto text-primary"><CheckCircle className="size-5" /></div>}
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('CHECKOUT_PRO')}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'CHECKOUT_PRO' ? 'border-primary bg-primary/10' : 'border-white/10 bg-black/20 hover:bg-white/5'}`}
                                    >
                                        <div className="text-2xl">💳</div>
                                        <div>
                                            <div className="font-bold text-white">Mercado Pago</div>
                                            <div className="text-xs text-gray-400">Cartão, Boleto, PayPal</div>
                                        </div>
                                        {paymentMethod === 'CHECKOUT_PRO' && <div className="ml-auto text-primary"><CheckCircle className="size-5" /></div>}
                                    </div>
                                </div>

                                {/* Email Input for Checkout Pro */}
                                {paymentMethod === 'CHECKOUT_PRO' && (
                                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2 block">Email para Pagamento</label>
                                        <Input
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-black/20 border-white/10 text-white"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Necessário para liberar o pagamento no Mercado Pago.</p>
                                    </div>
                                )}

                                <div className="flex gap-2 mb-8">
                                    <Input
                                        placeholder="CUPOM DE DESCONTO"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="bg-black/20 border-white/10 text-white"
                                        disabled={couponApplied}
                                    />
                                    <Button
                                        variant="outline"
                                        className="border-white/10 text-gray-300 hover:bg-white/5"
                                        onClick={handleApplyCoupon}
                                        disabled={couponApplied || !couponCode || isProcessing}
                                    >
                                        {couponApplied ? <CheckCircle className="size-4 text-green-500" /> : "Aplicar"}
                                    </Button>
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
                                            Eu aceito os <br />
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <span className="text-primary hover:underline cursor-pointer font-bold inline-flex items-center gap-1">
                                                        <FileText className="size-3" /> Termos de Serviço
                                                    </span>
                                                </DialogTrigger>
                                                <DialogContent className="bg-[#1a0b2e] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold mb-4">Termos de Serviço</DialogTitle>
                                                        <DialogDescription className="text-gray-400 mb-4">Leia com atenção antes de comprar.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-6 text-sm text-gray-300 leading-relaxed pr-2">
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">1. Entregas</h3>
                                                            <p>As entregas são automáticas e ocorrem em até 5 minutos após a confirmação do pagamento.</p>
                                                        </section>
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">2. Reembolsos</h3>
                                                            <p>Por se tratar de bens digitais, não oferecemos reembolsos após a ativação dos itens no jogo, exceto em casos de falha técnica comprovada.</p>
                                                        </section>
                                                        <section>
                                                            <h3 className="text-white font-bold text-base mb-2">3. Regras</h3>
                                                            <p>O uso de itens para violar as regras do servidor resultará em banimento sem reembolso.</p>
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
                                    {isProcessing ? "Processando..." : "Finalizar Compra"}
                                </Button>

                                <div className="mt-4 flex justify-center gap-4 opacity-50">
                                    <CreditCard className="size-6 text-white" />
                                    <span className="text-3xl">💠</span>
                                    <span className="text-2xl">📄</span>
                                </div>
                                <p className="text-center text-xs text-gray-500 mt-2">
                                    Seguro via Mercado Pago
                                </p>

                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
