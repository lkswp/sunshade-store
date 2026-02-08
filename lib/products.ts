export type ProductData = {
    id: string
    price: number
    category: 'global' | 'survival' | 'anarchy'
    image?: string
    commands: string[]
}

export const PRODUCTS_DATA: ProductData[] = [
    // Global Items
    {
        id: "rank_vip",
        price: 4.99,
        category: 'global',
        commands: [
            "lp user {player} parent add vip",
            "broadcast &a{player} &fjust bought &bVIP Rank&f!"
        ]
    },
    {
        id: "rank_mvp",
        price: 9.99,
        category: 'global',
        commands: [
            "lp user {player} parent add mvp",
            "broadcast &a{player} &fjust bought &6MVP Rank&f!"
        ]
    },
    {
        id: "coins_1000",
        price: 0.99,
        category: 'global',
        commands: [
            "eco give {player} 1000",
            "msg {player} &aYou received 1000 Coins!"
        ]
    },

    // Survival RPG Items
    {
        id: "rpg_key_common",
        price: 1.99,
        category: 'survival',
        commands: [
            "crate give {player} rpg_common 1",
            "msg {player} &aYou received 1 RPG Key!"
        ]
    },
    {
        id: "claim_blocks_1000",
        price: 2.99,
        category: 'survival',
        commands: [
            "acb {player} 1000",
            "msg {player} &aYou received 1000 Claim Blocks!"
        ]
    },
    {
        id: "pet_dragon",
        price: 14.99,
        category: 'survival',
        commands: [
            "pet give {player} dragon",
            "broadcast &a{player} &fadoped a &5Dragon Pet&f!"
        ]
    },

    // Semi-Anarchy Items
    {
        id: "tnt_kit",
        price: 4.99,
        category: 'anarchy',
        commands: [
            "kit give {player} tnt_raider",
            "msg {player} &cReceived TNT Raider Kit!"
        ]
    },
    {
        id: "obsidian_stack",
        price: 3.99,
        category: 'anarchy',
        commands: [
            "give {player} obsidian 64",
            "msg {player} &8Received 64 Obsidian."
        ]
    },
    {
        id: "priority_queue",
        price: 5.99,
        category: 'anarchy',
        commands: [
            "lp user {player} permission set queue.priority true",
            "msg {player} &bYou now have Priority Queue access!"
        ]
    },
]
