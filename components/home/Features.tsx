"use client"

import { useLanguage } from "@/lib/i18n"
import { Sword, Skull, Pickaxe } from "lucide-react"
import { ServerCard } from "./ServerCard"

export function Features() {
    const { t } = useLanguage()

    return (
        <section className="py-32 relative bg-black/95 overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[500px] bg-primary/5 blur-[150px] rounded-full pointing-events-none opacity-50"></div>

            <div className="container px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                        {t('features', 'why_choose')} <span className="text-primary">{t('features', 'servers')}</span>
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
                        {t('features', 'servers_description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Survival RPG */}
                    <ServerCard
                        title={t('features', 'survival_title')}
                        description={t('features', 'survival_desc')}
                        icon={Sword}
                        colorClass="text-primary"
                        bgFormatClass="bg-primary/10"
                        buttonText={t('features', 'join_now')}
                    />

                    {/* Semi-Anarchy */}
                    <ServerCard
                        title={t('features', 'anarchy_title')}
                        description={t('features', 'anarchy_desc')}
                        icon={Skull}
                        colorClass="text-red-500"
                        bgFormatClass="bg-red-500/10"
                        buttonText={t('features', 'join_now')}
                    />

                    {/* Rankup */}
                    <ServerCard
                        title={t('features', 'rankup_title')}
                        description={t('features', 'rankup_desc')}
                        icon={Pickaxe}
                        colorClass="text-purple-500"
                        bgFormatClass="bg-purple-500/10"
                        buttonText={t('features', 'coming_soon')}
                        badge={t('features', 'dev_badge')}
                        disabled={true}
                    />
                </div>
            </div>
        </section>
    )
}
