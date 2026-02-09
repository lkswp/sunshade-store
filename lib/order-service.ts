
import { PrismaClient } from "@prisma/client"

// We need a separate instance or import to avoid "too many clients" in dev
const prisma = new PrismaClient()

export async function fulfillOrder(orderId: number) {
    const order = await prisma.order.findUnique({
        where: { id: orderId }
    })

    if (!order || order.status === 'COMPLETED' || !order.items) return

    const items = order.items as any[] // [{ product: ..., quantity: ... }]

    // Generate Commands
    for (const { product, quantity } of items) {
        const commands = product.commands as string[]
        if (commands && Array.isArray(commands)) {
            // Fetch username (we need to get user from order)
            const user = await prisma.user.findUnique({ where: { id: order.userId } })
            if (!user) continue

            for (let i = 0; i < quantity; i++) {
                for (const cmd of commands) {
                    await prisma.commandQueue.create({
                        data: {
                            command: cmd.replace(/{player}/g, user.username),
                            playerName: user.username,
                            serverScope: product.category,
                            orderId: order.id,
                            status: "PENDING"
                        }
                    })
                }
            }
        }
    }
}
