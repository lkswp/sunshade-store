"use client"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { useLanguage } from "@/lib/i18n"

export default function RulesPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="container flex-1 py-12 px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow-[0_0_10px_rgba(152,209,33,0.3)]">{t('rules', 'title')}</h1>

                <div className="space-y-6 text-gray-300">
                    {[1, 2, 3, 4, 5].map((sectionNum) => {
                        const titleKey = `section${sectionNum}_title`;
                        const listKey = `section${sectionNum}_list`;
                        // Colors for different sections to make it pop
                        const colors = ['text-primary', 'text-secondary', 'text-blue-400', 'text-yellow-400', 'text-purple-400'];
                        const colorClass = colors[(sectionNum - 1) % colors.length];

                        return (
                            <section key={sectionNum} className="bg-card/50 p-8 rounded-2xl border border-white/5 shadow-lg backdrop-blur-sm hover:bg-card/70 transition-colors">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className={colorClass}>#</span> {t('rules', titleKey)}
                                </h2>
                                <ul className="list-disc pl-5 space-y-3 text-lg leading-relaxed">
                                    {(t('rules', listKey) as string[]).map((rule, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: rule.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                                    ))}
                                </ul>
                            </section>
                        )
                    })}
                </div>
            </main>
            <Footer />
        </div>
    )
}
