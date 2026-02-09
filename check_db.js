
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

        const commands = await prisma.commandQueue.findMany({
            where: { status: 'PENDING' },
            include: { order: true }
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
