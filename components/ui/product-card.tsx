"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n"

interface ProductProps {
    id: string
    name: string
    price: number
    description: string
    image?: string
    onBuy: (id: string) => void
}

export function ProductCard({ id, name, price, description, image, onBuy }: ProductProps) {
    const { t } = useLanguage()

    return (
        <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(152,209,33,0.15)] border bg-card/50 backdrop-blur-sm border-white/5 hover:border-primary/50 group">
            <div className="aspect-square relative bg-gradient-to-br from-white/5 to-transparent p-6 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {image && (image.startsWith('http') || image.startsWith('/')) ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110"
                    />
                ) : (
                    <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(152,209,33,0.3)] transition-transform duration-500 group-hover:scale-125">
                        {/* Fallback icons based on id */}
                        {id.includes("rank") ? "👑" : id.includes("crate") ? "📦" : "💰"}
                    </div>
                )}
            </div>
            <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">{name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-gray-400">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="text-3xl font-extrabold text-white text-shadow-sm">
                    R${price.toFixed(2)}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full font-bold shadow-lg shadow-primary/10 group-hover:shadow-primary/30 transition-all" variant="minecraft" onClick={() => onBuy(id)}>
                    {t('store', 'add_to_cart')}
                </Button>
            </CardFooter>
        </Card>
    )
}
