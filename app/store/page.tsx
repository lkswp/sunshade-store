"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { PlayerInput } from "@/components/features/PlayerInput"
import { useLanguage } from "@/lib/i18n"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    image?: string | null
    commands: any
}

export default function StorePage() {
    const [selectedServer, setSelectedServer] = useState<'survival' | 'anarchy' | null>(null)
    const { t } = useLanguage()
    const { addItem, username, setUsername } = useCart()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products')
                if (!res.ok) throw new Error('Failed to fetch products')
                const data = await res.json()
                setProducts(data)
            } catch (error) {
                console.error("Error loading products:", error)
                toast.error("Failed to load products. Please try again later.", {
                    style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
                })
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleAddToCart = (productId: string) => {
        if (!selectedServer) {
            toast.error(t('store', 'select_server') + "!", {
                description: t('store', 'select_server_desc'),
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        if (!username) {
            toast.error(t('store', 'step1_placeholder') + "!", {
                description: t('store', 'step1_desc'),
                style: { background: '#200505', borderColor: '#C41E3A', color: 'white' }
            })
            // Scroll to username input
            const inputElement = document.getElementById('username-section');
            if (inputElement) inputElement.scrollIntoView({ behavior: 'smooth' });
            return
        }

        const product = products.find(p => p.id === productId)
        if (product) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || undefined,
            })
            toast.success(t('store', 'add_to_cart'), {
                description: `${product.name} ${t('store', 'success_msg').replace('Compra iniciada para o usuário', 'adicionado ao carrinho').replace('Purchase initiated for user', 'added to cart')}`,
                style: { background: '#051405', borderColor: '#98D121', color: 'white' },
                action: {
                    label: t('nav', 'cart'),
                    onClick: () => window.location.href = '/checkout'
                }
            })
        }
    }

    const filteredProducts = products.filter(p => p.category === 'global' || p.category === selectedServer)

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="container flex-1 py-16 px-4">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl">
                            {t('store', 'title_prefix')}<span className="text-primary">{t('store', 'title_suffix')}</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {t('store', 'subtitle')}
                        </p>
                    </div>

                    {/* Step 1: Server Selector */}
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/10 blur-3xl opacity-20 -z-10 rounded-full"></div>
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                <span className="bg-primary text-black rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                                {t('store', 'select_server')}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Survival Card */}
                                <button
                                    onClick={() => setSelectedServer('survival')}
                                    className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${selectedServer === 'survival' ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(152,209,33,0.3)]' : 'border-white/10 bg-card/50 hover:border-primary/50 hover:bg-card/80'}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="text-4xl">🏰</div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${selectedServer === 'survival' ? 'text-primary' : 'text-white group-hover:text-primary'} transition-colors`}>{t('store', 'survival_rpg')}</h3>
                                            <p className="text-sm text-gray-400 mt-1">{t('store', 'survival_desc_short')}</p>
                                        </div>
                                        {selectedServer === 'survival' && (
                                            <div className="absolute top-4 right-4 text-primary animate-in zoom-in spin-in-90 duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Anarchy Card */}
                                <button
                                    onClick={() => setSelectedServer('anarchy')}
                                    className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${selectedServer === 'anarchy' ? 'border-secondary bg-secondary/10 shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'border-white/10 bg-card/50 hover:border-secondary/50 hover:bg-card/80'}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="text-4xl">💣</div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${selectedServer === 'anarchy' ? 'text-secondary' : 'text-white group-hover:text-secondary'} transition-colors`}>{t('store', 'semi_anarchy')}</h3>
                                            <p className="text-sm text-gray-400 mt-1">{t('store', 'anarchy_desc_short')}</p>
                                        </div>
                                        {selectedServer === 'anarchy' && (
                                            <div className="absolute top-4 right-4 text-secondary animate-in zoom-in spin-in-90 duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Identify */}
                    <div id="username-section" className={`max-w-3xl mx-auto transition-all duration-500 ${selectedServer ? 'opacity-100 translate-y-0' : 'opacity-50 grayscale pointer-events-none'}`}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-20 -z-10 rounded-full"></div>
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                <span className="bg-primary text-black rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                                {t('store', 'step1')}
                            </h2>
                            <PlayerInput onPlayerSet={setUsername} initialUsername={username} />
                            {username && (
                                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-center font-medium animate-in fade-in slide-in-from-top-2">
                                    {t('store', 'shopping_as')} <span className="font-bold underline">{username}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Browse Items */}
                    <div className={`relative transition-all duration-500 ${selectedServer && username ? 'opacity-100 translate-y-0' : 'opacity-50 blur-sm pointer-events-none'}`}>
                        <div className="absolute inset-0 bg-secondary/10 blur-3xl opacity-10 -z-10"></div>
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                            <span className="bg-primary text-black rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                            {t('store', 'step2')}
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            </div>
                        ) : selectedServer ? (
                            <div className="space-y-10">
                                {/* Category Label */}
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-bold uppercase tracking-widest text-gray-400">
                                        {selectedServer === 'survival' ? t('store', 'survival_rpg') : t('store', 'semi_anarchy')}
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            {...product}
                                            image={product.image || undefined}
                                            onBuy={handleAddToCart}
                                        />
                                    )) : (
                                        <div className="col-span-full text-center py-10 text-gray-500">
                                            {t('store', 'no_products')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500 border-2 border-dashed border-white/10 rounded-3xl">
                                <p className="text-xl">{t('store', 'select_server_desc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
