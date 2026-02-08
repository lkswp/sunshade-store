export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: 'ranks' | 'keys' | 'unbans'
    image: string // path to image or placeholder
    features?: string[]
}

export const PRODUCTS: Product[] = [
    {
        id: 'rank-vip',
        name: 'VIP Rank',
        description: 'Start your journey with essential perks.',
        price: 5.00,
        category: 'ranks',
        image: '/images/ranks/vip.png',
        features: ['/fly command', 'White chat color', '1 Home point', 'Priority queue']
    },
    {
        id: 'rank-mvp',
        name: 'MVP Rank',
        description: 'Dominate the server with enhanced abilities.',
        price: 15.00,
        category: 'ranks',
        image: '/images/ranks/mvp.png',
        features: ['/fly & /feed', 'Gold chat color', '3 Home points', 'Join full server', 'Exclusive kit']
    },
    {
        id: 'rank-sungod',
        name: 'SunGod Rank',
        description: 'The ultimate power on SunShade.',
        price: 50.00,
        category: 'ranks',
        image: '/images/ranks/sungod.png',
        features: ['All previous perks', 'Rainbow chat', 'Unlimited homes', '/god mode (decorative)', 'Custom prefix']
    },
    {
        id: 'key-common',
        name: 'Common Crate Key',
        description: 'A chance to win useful items.',
        price: 1.00,
        category: 'keys',
        image: '/images/keys/common.png',
    },
    {
        id: 'key-legendary',
        name: 'Legendary Crate Key',
        description: 'High chance for top-tier loot.',
        price: 5.00,
        category: 'keys',
        image: '/images/keys/legendary.png',
    }
]

export async function getProducts(category?: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    if (category) {
        return PRODUCTS.filter(p => p.category === category)
    }
    return PRODUCTS
}
