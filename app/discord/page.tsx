"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"

export default function DiscordPage() {
    const { t } = useLanguage()

    useEffect(() => {
        // Simulating a redirect to a real Discord invite
        window.location.href = "https://discord.sunshade.com.br"
    }, [])

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="container flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                <div className="bg-[#5865F2]/10 p-12 rounded-full mb-8 animate-pulse shadow-[0_0_50px_rgba(88,101,242,0.2)]">
                    {/* Discord Logo SVG */}
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(88,101,242,0.8)]">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1892.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.1023.2462.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.5382-9.6752-3.5484-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" fill="#5865F2" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4 text-[#5865F2] drop-shadow-[0_0_8px_rgba(88,101,242,0.8)]">{t('discord', 'title')}</h1>
                <p className="text-gray-300 mb-8 text-xl max-w-lg leading-relaxed">
                    {t('discord', 'subtitle')}
                </p>
                <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/30 px-8 py-6 text-lg">
                    {t('discord', 'join_btn')}
                </Button>
            </main>
            <Footer />
        </div>
    )
}
