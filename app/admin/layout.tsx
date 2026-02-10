import Link from "next/link"
import { LayoutDashboard, ShoppingCart, LogOut } from "lucide-react"
import { logoutAdmin } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-800">
                    <h1 className="text-xl font-bold">Sunshade Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-zinc-800">
                            <LayoutDashboard className="size-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-zinc-800">
                            <ShoppingCart className="size-4" />
                            Orders
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <form action={logoutAdmin}>
                        <Button variant="destructive" className="w-full gap-2">
                            <LogOut className="size-4" />
                            Logout
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    )
}
