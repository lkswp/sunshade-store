
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testWebhook() {
    console.log("🔄 Resetting Order #6 to PENDING for test...");

    try {
        // 1. Reset Order
        await prisma.order.update({
            where: { id: 6 },
            data: { status: 'PENDING' }
        });
        console.log("✅ Order #6 is now PENDING.");

        // 2. Simulate Webhook Request
        const payload = {
            type: "payment",
            data: { id: "144768140649" } // The real ID from the previous purchase
        };

        console.log("\n🚀 Sending Simulated Webhook to https://sunshade.com.br ...");

        const response = await fetch("https://sunshade.com.br/api/webhooks/mercadopago", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            console.error("❌ Webhook Failed! Response:", await response.text());
            return;
        }

        console.log("✅ Webhook sent successfully.");
        console.log("⏳ Waiting 3 seconds for database update...");

        await new Promise(r => setTimeout(r, 3000));

        // 3. Check Result
        const order = await prisma.order.findUnique({
            where: { id: 6 },
            include: { commands: true }
        });

        console.log(`\n🧐 Result: Order #6 Status is [${order.status}]`);
        if (order.status === 'PAID') {
            console.log("🎉 SUCCESS! The webhook logic is working correctly.");
        } else {
            console.log("⚠️ FAILED. The order is still PENDING. Check Vercel Logs.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testWebhook();
