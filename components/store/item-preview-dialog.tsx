"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/lib/i18n"
import { getTranslatedMaterial, getTranslatedEnchantment, getItemIconUrl } from "@/lib/minecraft-data"
import Image from "next/image"

interface Item {
    material: string
    amount: number
    name?: string
    enchants?: string[]
}

interface ItemPreviewDialogProps {
    items: Item[]
    productName: string
}

export function ItemPreviewDialog({ items, productName }: ItemPreviewDialogProps) {
    const { t } = useLanguage()

    if (!items || items.length === 0) return null

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm z-20">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">{t('store', 'preview_items') || 'Preview Items'}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a2e] border-[#2d2d44] text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <span className="text-primary">📦</span> {productName}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider text-xs">{t('store', 'contents') || 'Contents'}</h4>
                    <ScrollArea className="h-[300px] w-full pr-4">
                        <div className="grid grid-cols-1 gap-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-primary/20 transition-colors">
                                    <div className="h-10 w-10 rounded-md bg-[#0f0f1a] flex items-center justify-center border border-white/5 relative overflow-hidden group/item">
                                        <Image
                                            src={getItemIconUrl(item.material)}
                                            alt={item.material}
                                            fill
                                            className="object-contain p-1"
                                            unoptimized
                                        />
                                        <div className="absolute bottom-0 right-0 bg-black/80 px-1 rounded-tl-sm text-[10px] font-bold text-white z-10">
                                            {item.amount}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate text-white">
                                            {item.name ? item.name : getTranslatedMaterial(item.material)}
                                        </p>
                                        {item.enchants && item.enchants.length > 0 && (
                                            <p className="text-xs text-primary/80 truncate">
                                                {item.enchants.map(e => getTranslatedEnchantment(e)).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
