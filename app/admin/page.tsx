"use client"

import { useEffect, useState } from "react"
import { getAdminStats, getRecentOrders } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, Clock } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from "date-fns"

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const statsData = await getAdminStats()
            const ordersData = await getRecentOrders()
            setStats(statsData)
            setRecentOrders(ordersData)
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return <div className="text-white">Loading Dashboard...</div>
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                        <DollarSign className="size-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R${stats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
                        <ShoppingBag className="size-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrdersCount}</div>
                        <p className="text-xs text-gray-500">All time orders</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Visitors Today</CardTitle>
                        <Users className="size-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.visitorsToday}</div>
                        <p className="text-xs text-gray-500">Unique sessions (approx)</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Pending Orders</CardTitle>
                        <Clock className="size-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingOrdersCount}</div>
                        <p className="text-xs text-gray-500">Awaiting payment</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Revenue (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(str) => format(new Date(str), "MMM dd")}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$${value}`}
                                />
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="col-span-1 bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b border-zinc-800 pb-2 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {order.user?.username || `User #${order.userId}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {format(new Date(order.createdAt), "MMM dd, HH:mm")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-white">R${order.total.toFixed(2)}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-500' :
                                            order.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                                                'bg-red-500/20 text-red-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentOrders.length === 0 && (
                                <p className="text-gray-500 text-sm">No orders found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
