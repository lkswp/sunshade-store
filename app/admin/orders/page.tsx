"use client"

import { useEffect, useState } from "react"
import { getRecentOrders } from "@/app/actions/admin" // We might need a better action for full list + search
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { format } from "date-fns"

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchOrders = async () => {
            // Re-using getRecentOrders for now, but in real app we need pagination
            const data = await getRecentOrders()
            setOrders(data)
            setLoading(false)
        }
        fetchOrders()
    }, [])

    const filteredOrders = orders.filter(order =>
        order.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Orders Management</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 size-4 text-gray-400" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-8 bg-zinc-900 border-zinc-800 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900 overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-800/50">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-gray-400">Order ID</TableHead>
                            <TableHead className="text-gray-400">User</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Total</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400 font-mono text-xs">Payment ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-medium text-white">#{order.id}</TableCell>
                                    <TableCell className="text-gray-300">{order.user?.username}</TableCell>
                                    <TableCell className="text-gray-400">
                                        {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell className="text-emerald-400 font-bold">
                                        R${order.total.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-500' :
                                            order.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                                                'bg-red-500/20 text-red-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">
                                        {order.paymentId || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
