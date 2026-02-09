
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function forceApprove(orderId) {
    try {
        console.log(`Finding Order #${orderId}...`);
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            console.error("Order not found!");
            return;
        }

        if (order.status === 'PAID') {
            console.log("Order is already PAID.");
            return;
        }

        console.log("Updating Order Status to PAID...");
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' }
        });

        console.log("Generating Commands...");
        const items = order.items;
        const user = await prisma.user.findUnique({ where: { id: order.userId } });

        if (!user) {
            console.error("User not found!");
            return;
        }

        let commandCount = 0;

        for (const item of items) {
            const product = item.product;
            const quantity = item.quantity;
            const commands = product.commands;

            if (commands && Array.isArray(commands)) {
                for (let i = 0; i < quantity; i++) {
                    for (const cmd of commands) {
                        const finalCommand = cmd.replace(/{player}/g, user.username);
                        await prisma.commandQueue.create({
                            data: {
                                command: finalCommand,
                                playerName: user.username,
                                serverScope: product.category,
                                orderId: order.id,
                                status: "PENDING"
                            }
                        });
                        console.log(` + Created Command: ${finalCommand}`);
                        commandCount++;
                    }
                }
            }
        }

        console.log(`\n✅ Success! Order #${orderId} is PAID.`);
        console.log(`🚀 Generated ${commandCount} commands for player ${user.username}.`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

// Change the ID here if needed, defaulting to 6 based on conversation
forceApprove(6);
