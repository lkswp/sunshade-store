import { ChevronRight, LucideIcon } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface ServerCardProps {
    title: string
    description: string
    icon: LucideIcon
    colorClass: string
    bgFormatClass: string
    buttonText: string
    onJoin?: () => void
    badge?: string
    disabled?: boolean
}

export function ServerCard({
    title,
    description,
    icon: Icon,
    colorClass,
    bgFormatClass,
    buttonText,
    onJoin,
    badge,
    disabled = false
}: ServerCardProps) {
    return (
        <div className={cn(
            "group relative bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
            disabled ? "opacity-75" : "hover:bg-white/10"
        )}>
            {badge && (
                <div className={cn(
                    "absolute top-6 right-6 px-3 py-1 text-xs font-bold rounded-full border",
                    // We might need to adjust this dynamic class generation or pass full classes
                    "bg-purple-500/20 text-purple-400 border-purple-500/30" // specific for dev badge for now, can be made generic if needed
                )}>
                    {badge}
                </div>
            )}

            <div className={cn(
                "mb-6 p-4 w-fit rounded-xl transition-colors",
                bgFormatClass,
                "group-hover:bg-opacity-30"
            )}>
                <Icon className={cn("size-8", colorClass)} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

            <p className="text-white/50 leading-relaxed mb-8 h-24">
                {description}
            </p>

            <div className={cn(
                "flex items-center font-bold text-sm tracking-wide uppercase transition-all",
                colorClass,
                !disabled && "group-hover:gap-2",
                disabled && "cursor-not-allowed opacity-50"
            )}>
                {buttonText}
                {!disabled && <ChevronRight className="size-4 ml-1" />}
            </div>
        </div>
    )
}
