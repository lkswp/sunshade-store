"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Trash2, Plus, Copy, Ticket } from "lucide-react"
import { format } from "date-fns"

interface Coupon {
    id: number
    code: string
    discount: number
    uses: number
    maxUses: number | null
    expiresAt: string | null
    active: boolean
    createdAt: string
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discount: "",
        maxUses: "",
        expiresAt: ""
    })

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons')
            const data = await res.json()
            setCoupons(data)
        } catch (error) {
            toast.error("Failed to load coupons")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const handleCreate = async () => {
        if (!newCoupon.code || !newCoupon.discount) {
            toast.error("Code and Discount are required")
            return
        }

        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCoupon)
            })

            if (!res.ok) throw new Error("Failed to create")

            toast.success("Coupon created!")
            setNewCoupon({ code: "", discount: "", maxUses: "", expiresAt: "" })
            fetchCoupons()
        } catch (error) {
            toast.error("Error creating coupon")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return

        try {
            const res = await fetch(`/api/admin/coupons?id=${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error("Failed to delete")

            toast.success("Coupon deleted")
            fetchCoupons()
        } catch (error) {
            toast.error("Error deleting coupon")
        }
    }

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast.success("Code copied!")
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Ticket className="size-8 text-primary" />
                Manage Coupons
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Create Form */}
                <Card className="bg-card/30 border-white/10 md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-white">Create New Coupon</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Code</label>
                            <Input
                                placeholder="SUMMER2024"
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                className="bg-black/20 border-white/10 text-white font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Discount (%)</label>
                            <Input
                                type="number"
                                placeholder="10"
                                value={newCoupon.discount}
                                onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Max Uses (Optional)</label>
                            <Input
                                type="number"
                                placeholder="100"
                                value={newCoupon.maxUses}
                                onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Expires At (Optional)</label>
                            <Input
                                type="date"
                                value={newCoupon.expiresAt}
                                onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                                className="bg-black/20 border-white/10 text-white" // Date input usually has own style
                            />
                        </div>
                        <Button onClick={handleCreate} className="w-full" variant="minecraft">
                            <Plus className="size-4 mr-2" /> Create Coupon
                        </Button>
                    </CardContent>
                </Card>

                {/* Coupons List */}
                <Card className="bg-card/30 border-white/10 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white">Active Coupons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-gray-400">Code</TableHead>
                                    <TableHead className="text-gray-400">Discount</TableHead>
                                    <TableHead className="text-gray-400">Uses</TableHead>
                                    <TableHead className="text-gray-400">Expires</TableHead>
                                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-400 py-8">Loading...</TableCell>
                                    </TableRow>
                                ) : coupons.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-400 py-8">No coupons found.</TableCell>
                                    </TableRow>
                                ) : (
                                    coupons.map((coupon) => (
                                        <TableRow key={coupon.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="font-mono font-bold text-primary flex items-center gap-2">
                                                {coupon.code}
                                                <Button variant="ghost" size="icon" className="h-4 w-4 text-gray-500 hover:text-white" onClick={() => copyCode(coupon.code)}>
                                                    <Copy className="size-3" />
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-white">{coupon.discount}%</TableCell>
                                            <TableCell className="text-gray-400">
                                                {coupon.uses} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}
                                            </TableCell>
                                            <TableCell className="text-gray-400">
                                                {coupon.expiresAt ? format(new Date(coupon.expiresAt), 'dd/MM/yyyy') : 'Never'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
