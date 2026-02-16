
const API_URL = 'http://localhost:3000/api/products';
const SECRET = process.env.PLUGIN_SECRET || 'sunshade_secret_x7z9_secure_2026'; // From .env

async function testSync() {
    const product = {
        id: "kit_test_preview",
        name: "§b§lTest Kit",
        description: "§7A cool §etest kit",
        price: 10.0,
        category: "survival",
        image: null,
        commands: ["give %player% diamond 1"],
        active: true,
        previewItems: [
            { material: "DIAMOND_SWORD", amount: 1, name: "§cExcalibur", enchants: ["Sharpness V"] },
            { material: "GOLDEN_APPLE", amount: 64 }
        ]
    };

    console.log("Sending sync request...");
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SECRET}`
            },
            body: JSON.stringify(product)
        });

        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(data, null, 2));

        if (response.status === 200) {
            console.log("Sync successful!");
            if (data.product.name === "Test Kit" && data.product.description === "A cool test kit") {
                console.log("Color stripping: PASSED");
            } else {
                console.log("Color stripping: FAILED");
                console.log("Expected 'Test Kit', got", data.product.name);
            }

            if (data.product.previewItems && data.product.previewItems.length === 2) {
                console.log("Preview items sync: PASSED");
            } else {
                console.log("Preview items sync: FAILED");
            }
        } else {
            console.log("Sync failed!");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testSync();
