"use server"

import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function loginAdmin(password: string) {
    if (password === process.env.ADMIN_PASSWORD) {
        // Set cookie with the secret as value (simple auth)
        // In real app, use JWT or Session ID
        const secret = process.env.ADMIN_SECRET || "default_secret_if_not_set";
        // Note: middleware checks against ADMIN_SECRET. 
        // Ideally ADMIN_PASSWORD is what user types, and we set a session cookie.
        // Let's assume ADMIN_SECRET is the session token we expect.

        (await cookies()).set("admin_session", secret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/"
        })
        return { success: true }
    }
    return { success: false, error: "Invalid Password" }
}

export async function logoutAdmin() {
    (await cookies()).delete("admin_session")
    redirect("/admin/login")
}

export async function getAdminStats() {
    // 1. Total Revenue (Paid Orders)
    const paidOrders = await prisma.order.findMany({
        where: { status: "PAID" },
        select: { total: true }
    })
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0)

    // 2. Total Orders Count
    const totalOrdersCount = await prisma.order.count()

    // 3. Pending Orders Count
    const pendingOrdersCount = await prisma.order.count({
        where: { status: "PENDING" }
    })

    // 4. Visitors (Today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const visitorsToday = await prisma.visit.count({
        where: {
            createdAt: {
                gte: today
            }
        }
    })

    // 5. Revenue Chart Data (Last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const revenueDataRaw = await prisma.order.findMany({
        where: {
            status: "PAID",
            createdAt: { gte: thirtyDaysAgo }
        },
        select: {
            createdAt: true,
            total: true
        }
    })

    // Aggregating by day
    const revenueByDay: Record<string, number> = {}
    revenueDataRaw.forEach(order => {
        const day = order.createdAt.toISOString().split('T')[0]
        revenueByDay[day] = (revenueByDay[day] || 0) + order.total
    })

    const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue
    })).sort((a, b) => a.date.localeCompare(b.date))

    return {
        totalRevenue,
        totalOrdersCount,
        pendingOrdersCount,
        visitorsToday,
        chartData
    }
}

export async function getRecentOrders() {
    return await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })
}
