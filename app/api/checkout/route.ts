
import { NextResponse } from "next/server"
import { PRODUCTS_DATA } from "@/lib/products"
import { PrismaClient } from "@prisma/client"

// Initialize Prisma
const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { items, username } = body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
        }
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        // 1. Calculate Total & Validate Items
        let total = 0
        const validItems: (typeof PRODUCTS_DATA[0] & { quantity: number })[] = []

        for (const item of items) {
            const product = PRODUCTS_DATA.find(p => p.id === item.id)
            if (product) {
                total += product.price * (item.quantity || 1)
                validItems.push({ ...product, quantity: item.quantity || 1 })
            }
        }

        // 2. Database Operations (Transaction)
        const result = await prisma.$transaction(async (tx) => {
            // Find or Create User
            let user = await tx.user.findUnique({
                where: { username }
            })

            if (!user) {
                user = await tx.user.create({
                    data: { username }
                })
            }

            // Create Order
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    total: total,
                    status: "COMPLETED", // Simplified for demo (skipping payment gateway integration)
                }
            })

            // Create Commands
            for (const item of validItems) {
                for (let i = 0; i < item.quantity; i++) {
                    for (const cmd of item.commands) {
                        await tx.commandQueue.create({
                            data: {
                                command: cmd.replace("{player}", username),
                                playerName: username,
                                serverScope: item.category,
                                orderId: order.id,
                                status: "PENDING"
                            }
                        })
                    }
                }
            }

            return order
        })

        return NextResponse.json({ success: true, orderId: result.id })

    } catch (error) {
        console.error("Checkout Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
