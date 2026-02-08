"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export interface PlayerInputProps {
    onPlayerSet: (username: string) => void
    initialUsername?: string
}

export function PlayerInput({ onPlayerSet, initialUsername = "" }: PlayerInputProps) {
    const [username, setUsername] = React.useState(initialUsername)
    const [debouncedName, setDebouncedName] = React.useState(initialUsername)
    const { t } = useLanguage()

    // Debounce input to avoid flickering images
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(username)
        }, 500)
        return () => clearTimeout(timer)
    }, [username])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (username.length > 2) {
            onPlayerSet(username)
        }
    }

    // MHF_Steve is a valid default skin
    const skinUrl = debouncedName.length > 2
        ? `https://minotar.net/helm/${debouncedName}/64.png`
        : "https://minotar.net/helm/MHF_Steve/64.png"

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6 items-center bg-card/50 p-6 rounded-xl border border-white/5 backdrop-blur-sm shadow-xl">
            <div className="relative shrink-0">
                <div className="size-20 rounded-xl overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(152,209,33,0.3)] bg-black/40 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={skinUrl}
                        alt="Player Skin"
                        className="h-full w-full object-cover rendering-pixelated transition-transform hover:scale-110 duration-300"
                        style={{ imageRendering: "pixelated" }}
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
                </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
                <label htmlFor="username" className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                    {t('store', 'step1_desc')}
                </label>
                <div className="flex gap-3">
                    <Input
                        id="username"
                        placeholder={t('store', 'step1_placeholder')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="font-mono bg-black/20 border-white/10 focus-visible:ring-primary h-12 text-lg text-white"
                        autoComplete="off"
                    />
                    <Button type="submit" variant="minecraft" className="h-12 px-8 shadow-lg shadow-primary/10">
                        {t('store', 'continue')}
                    </Button>
                </div>
            </div>
        </form>
    )
}
