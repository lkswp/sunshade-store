
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

        // 1. Calculate Total & Validate Items from DB
        const itemIds = items.map((i: any) => i.id)
        const dbProducts = await prisma.product.findMany({
            where: {
                id: { in: itemIds },
                active: true
            }
        })

        let total = 0
        const validItems: { product: typeof dbProducts[0], quantity: number }[] = []

        for (const item of items) {
            const product = dbProducts.find(p => p.id === item.id)
            if (product) {
                const quantity = item.quantity || 1
                total += product.price * quantity
                validItems.push({ product, quantity })
            }
        }

        if (validItems.length === 0) {
            return NextResponse.json({ error: "No valid items found" }, { status: 400 })
        }

        // 2. Database Operations (Transaction)
        const result = await prisma.$transaction(async (tx: any) => {
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
                    status: "COMPLETED",
                }
            })

            // Create Commands
            for (const { product, quantity } of validItems) {
                const commands = product.commands as string[] // Type assertion for JSON
                if (commands && Array.isArray(commands)) {
                    for (let i = 0; i < quantity; i++) {
                        for (const cmd of commands) {
                            await tx.commandQueue.create({
                                data: {
                                    command: cmd.replace(/{player}/g, username),
                                    playerName: username,
                                    serverScope: product.category,
                                    orderId: order.id,
                                    status: "PENDING"
                                }
                            })
                        }
                    }
                }
            }

            return order
        })

        return NextResponse.json({ success: true, orderId: result.id })

    } catch (error) {
        console.error("Checkout Error:", error)
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
    }
}
