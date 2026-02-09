
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const products = await prisma.product.findMany();
        console.log("=== Products ===");
        console.log(`Total: ${products.length}`);
        products.forEach(p => {
            console.log(`- ${p.name} (${p.category}) [Img: ${p.image}]`);
        });

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { commands: true }
        });

        console.log("\n=== Last 5 Orders ===");
        if (orders.length === 0) {
            console.log("No orders found.");
        } else {
            orders.forEach(o => {
                console.log(`[Order #${o.id}] Status: ${o.status} | Total: ${o.total} | Payment: ${o.paymentMethod} (${o.paymentId})`);
                console.log(`   Commands Generated: ${o.commands.length}`);
                if (o.commands.length > 0) {
                    o.commands.forEach(c => console.log(`   - [${c.status}] ${c.command}`));
                }
            });
        }

        const commands = await prisma.commandQueue.findMany({
            where: { status: 'PENDING' }
        });

        console.log("\n=== Pending Commands (Ready for Plugin) ===");
        console.log(`Total Pending: ${commands.length}`);
        if (commands.length > 0) {
            console.log(JSON.stringify(commands, null, 2));
        } else {
            console.log("No pending commands found. Try making a purchase on the site first!");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
