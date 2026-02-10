import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(coupons)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { code, discount, uses, maxUses, expiresAt, active } = body

        if (!code || !discount) {
            return NextResponse.json({ error: "Code and Discount are required" }, { status: 400 })
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discount: parseFloat(discount),
                uses: uses || 0,
                maxUses: maxUses ? parseInt(maxUses) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                active: active ?? true
            }
        })

        return NextResponse.json(coupon)
    } catch (error) {
        console.error("Create Coupon Error:", error)
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 })
        }

        await prisma.coupon.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
    }
}
