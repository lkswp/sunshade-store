"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface Translations {
    [key: string]: {
        [key: string]: string | any;
    };
}

const translations: Translations = {
    pt: {
        nav: {
            home: "Início",
            store: "Loja",
            rules: "Regras",
            discord: "Discord",
            cart: "Carrinho",
        },
        hero: {
            title_part1: "A AVENTURA",
            title_part2: "ESPERA",
            description: "Junte-se à melhor experiência de Minecraft. Encantamentos personalizados, biomas únicos e uma comunidade que parece casa.",
            copy_ip: "Copiar IP: jogar.sunshade.net",
            visit_store: "Visitar Loja",
            ip_copied: "IP Copiado!",
            status_online: "Online e Estável",
            scroll_indicator: "Role",
        },
        features: {
            why_choose: "Explore Nossos",
            servers: "Servidores",
            servers_description: "Escolha seu caminho. Cada servidor oferece uma maneira única de jogar, projetada para diversão e estabilidade.",
            survival_title: "Survival RPG",
            survival_desc: "Classes únicas, quests épicas, biomas inexplorados e guerras de clãs intensas. Uma experiência RPG completa no Minecraft.",
            anarchy_title: "Semi-Anarquia",
            anarchy_desc: "PVP frenético, Raids e liberdade quase total. Construa, destrua e conquiste em um mundo vanilla sem regras estritas.",
            rankup_title: "Rankup OP",
            rankup_desc: "Em Desenvolvimento. Prepare-se para uma jornada de evolução, mineração e economia como você nunca viu.",
            join_now: "Jogar Agora",
            dev_badge: "DEV",
            coming_soon: "Em Breve",
        },
        store: {
            title_prefix: "Loja",
            title_suffix: "SunShade",
            subtitle: "Melhore sua experiência com ranks, caixas e moedas. Todas as compras ajudam o servidor!",
            select_server: "Selecione o Servidor",
            select_server_desc: "Escolha onde você quer receber seus itens",
            survival_rpg: "Survival RPG",
            survival_desc_short: "Quests, masmorras e loot épico.",
            semi_anarchy: "Semi-Anarquia",
            anarchy_desc_short: "Raids, PvP e sem proteção de terreno.",
            global_items: "Itens Globais",
            step1: "Identifique-se",
            step1_desc: "Digite seu Nick do Minecraft",
            step1_placeholder: "Digite seu Nick",
            shopping_as: "Comprando como:",
            continue: "Continuar",
            step2: "Escolha seu item",
            add_to_cart: "ADICIONAR AO CARRINHO",
            success_title: "Sucesso!",
            success_msg: "Compra iniciada para o usuário",
            error_title: "Erro",
            error_msg: "Falha ao processar pedido.",
            no_products: "Nenhum produto encontrado para este servidor.",
        },
        products: {
            rank_vip_name: "Rank VIP",
            rank_vip_desc: "Obtenha vantagens básicas como voar no lobby, chat colorido e 1 kit exclusivo.",
            rank_mvp_name: "Rank MVP",
            rank_mvp_desc: "Todas as vantagens VIP + /heal, /feed e 2 kits exclusivos.",
            rank_elite_name: "Rank ELITE",
            rank_elite_desc: "O status supremo. Todas as vantagens anteriores + fila prioritária e efeitos de partículas especiais.",
            crate_common_name: "Chave da Caixa Comum",
            crate_common_desc: "Abra uma caixa comum para itens aleatórios.",
            crate_legendary_name: "Chave da Caixa Lendária",
            crate_legendary_desc: "Abra uma caixa lendária para itens de alto nível.",
            coins_1000_name: "1000 Coins",
            coins_1000_desc: "Moeda do jogo para gastar na loja interna.",
            rpg_key_common_name: "Chave RPG",
            rpg_key_common_desc: "Abra uma caixa RPG para armas e armaduras personalizadas.",
            claim_blocks_1000_name: "1000 Blocos de Terreno",
            claim_blocks_1000_desc: "Expanda seu território e proteja suas construções.",
            pet_dragon_name: "Pet Dragão",
            pet_dragon_desc: "Um dragão voável para viajar pelo mundo.",
            tnt_kit_name: "Kit TNT Raider",
            tnt_kit_desc: "64x TNT e Isqueiro. Perfeito para raids.",
            obsidian_stack_name: "Pack de Obsidian",
            obsidian_stack_desc: "64x Obsidian para fortificar sua base.",
            priority_queue_name: "Fila Prioritária",
            priority_queue_desc: "Pule a fila quando o servidor estiver cheio.",
        },
        rules: {
            title: "Regras Oficiais - SunShade",
            section1_title: "1. Comportamento e Chat",
            section1_list: [
                "Respeito Mútuo: Ofensas, racismo, homofobia ou qualquer discurso de ódio resultarão em BANIMENTO PERMANENTE.",
                "Spam/Flood: Não polua o chat com mensagens repetitivas ou uso excessivo de CAPS LOCK.",
                "Divulgação: É estritamente proibido divulgar outros servidores ou links suspeitos.",
            ],
            section2_title: "2. Jogabilidade e Fair Play",
            section2_list: [
                "Clientes Hackers: O uso de killaura, fly, x-ray, autoclicker ou qualquer mod que dê vantagem desleal é proibido.",
                "Macros: O uso de macros para automação (exceto chat simples) é proibido.",
                "Anti-Jogo: Atrapalhar propositalmente eventos ou abusar de mecânicas para prejudicar o servidor não será tolerado.",
            ],
            section3_title: "3. Bugs e Exploits",
            section3_list: [
                "Encontrou um bug (duplicação, erro em skill, falha no mapa)? Reporte imediatamente à Staff.",
                "O uso de falhas para obter vantagem (dupar itens, atravessar paredes) resultará em Reset de Conta ou Banimento.",
            ],
            section4_title: "4. Economia e Comércio",
            section4_list: [
                "Comércio Real (RMT): É proibido vender itens, coins ou contas do jogo por dinheiro real fora da loja oficial do servidor.",
                "Roubo/Scam: Em trocas não seguras pelo sistema do jogo, a Staff não se responsabiliza por itens perdidos, mas punirá golpistas reincidentes.",
            ],
            section5_title: "5. Contas e Clãs",
            section5_list: [
                "Multi-contas: O uso de contas fakes para farmar eventos, kills ou burlar banimentos é proibido.",
                "Nicks Impróprios: Nomes ofensivos ou com apologia a crimes serão banidos até a troca do nick.",
            ],
        },
        discord: {
            title: "Entre no nosso Discord!",
            subtitle: "Conecte-se com a comunidade, obtenha suporte e fique atualizado com as últimas notícias.",
            join_btn: "Entrar no Servidor",
        },
        footer: {
            desc: "A melhor aventura de Minecraft espera por você. Junte-se a nós hoje e comece sua jornada!",
            terms: "Termos de Serviço",
            privacy: "Política de Privacidade",
            rights: "Todos os direitos reservados.",
            affiliation: "Não afiliado à Mojang Studios.",
        },
        checkout: {
            title: "Checkout",
            empty_cart: "Seu carrinho está vazio.",
            go_store: "Ir para a Loja",
            your_items: "Seus Itens",
            quantity: "Quantidade",
            remove: "Remover",
            order_summary: "Resumo do Pedido",
            subtotal: "Subtotal",
            taxes: "Taxas",
            total: "Total",
            payment_method: "Método de Pagamento",
            credit_card: "Cartão de Crédito",
            paypal: "PayPal",
            coupon_placeholder: "Cupom de Desconto",
            apply: "Aplicar",
            complete_purchase: "Finalizar Compra",
            processing: "Processando...",
            terms_agreement: "Ao finalizar a compra, você concorda com nossos",
            terms_link: "Termos de Serviço",
            success_title: "Obrigado!",
            success_msg: "Seu pedido foi processado corretamente. Você deve receber seus itens no jogo em breve.",
            return_home: "Voltar ao Início",
            scan_pay: "Escaneie para Pagar",
            scan_desc: "Abra seu app do banco e escaneie o QR Code.",
            pix_copied: "Código PIX Copiado!",
            copy_pix: "Copiar Código PIX",
            paid_verify: "Após o pagamento, verifique seus itens no jogo!",
            terms_required_title: "Termos Necessários",
            terms_required_msg: "Por favor, aceite os Termos de Serviço para continuar.",
            username_required_title: "Nick Necessário",
            username_required_msg: "Por favor, volte à loja e digite seu nick do Minecraft.",
            checkout_failed: "Erro no Checkout",
            generic_error: "Algo deu errado. Tente novamente.",
            pix_method: "PIX (Mercado Pago)",
            instant_approval: "APROVAÇÃO IMEDIATA",
        },
        terms: {
            title: "Termos e Condições de Compra - SunShade",
            intro: "Ao realizar qualquer doação ou compra de pacotes VIP em nossa loja, você (o Usuário) declara ter lido, compreendido e aceitado integralmente os termos descritos abaixo. Caso não concorde com qualquer um dos pontos, pedimos que não prossiga com a aquisição.",
            section1_title: "1. Natureza do Serviço e Bens Digitais",
            section1_content: "1.1. Todos os pacotes VIPs comercializados no SunShade são bens inteiramente digitais e intangíveis. 1.2. O objetivo da compra é conceder vantagens dentro do jogo e apoiar a manutenção do servidor. 1.3. A entrega do produto é automática ou semi-automática. Ao receber as vantagens no jogo, o serviço é considerado como 'prestado e consumido'.",
            section2_title: "2. Validade e Alterações dos Pacotes (VIP Mensal)",
            section2_content: "2.1. Duração: Salvo menção explícita em contrário na descrição do produto, os pacotes VIP possuem duração de 30 (trinta) dias corridos, contados a partir da ativação. Após este período, as vantagens expiram automaticamente. 2.2. Direito de Modificação: A administração do SunShade reserva-se o direito de alterar, a qualquer momento e sem aviso prévio: O valor cobrado pelos pacotes VIP; O conteúdo, itens, permissões e vantagens inclusas em cada pacote; O nome e a hierarquia dos cargos. 2.3. Alterações nos benefícios podem ser aplicadas retroativamente (afetando VIPs já ativos) caso seja necessário para o balanceamento da economia, justiça ou jogabilidade do servidor.",
            section3_title: "3. Política de Reembolso (No Refund Policy)",
            section3_content: "3.1. Todas as compras são finais. Devido à natureza digital do produto, NÃO oferecemos reembolsos, trocas ou devoluções sob nenhuma circunstância. 3.2. Isso inclui, mas não se limita a: Arrependimento da compra; Problemas de desempenho no computador do usuário; Insatisfação com as vantagens; Perda de itens por morte ou erros. 3.3. Chargebacks/Contestações: Qualquer tentativa de estorno forçado resultará no banimento permanente da conta.",
            section4_title: "4. Encerramento das Atividades",
            section4_content: "4.1. O SunShade é um serviço privado que pode ser encerrado, reiniciado ou entrar em manutenção a qualquer momento. 4.2. Cláusula de Risco: O usuário reconhece que o servidor pode fechar definitivamente a qualquer momento. Caso isso ocorra, não haverá indenização ou reembolso. O valor pago é considerado uma doação.",
            section5_title: "5. Conduta e Banimentos",
            section5_content: "5.1. A aquisição de um pacote VIP não torna o usuário imune às regras. 5.2. Caso o usuário VIP viole as regras e seja punido, ele perderá o acesso às vantagens. 5.3. Em caso de banimento permanente, o VIP é cancelado imediatamente sem reembolso.",
            section6_title: "6. Isenção de Responsabilidade",
            section6_content: "6.1. O SunShade não é afiliado, associado ou endossado pela Mojang AB, Microsoft ou qualquer uma de suas parceiras. 6.2. Minecraft é uma marca registrada da Mojang AB.",
        }
    },
    en: {
        nav: {
            home: "Home",
            store: "Store",
            rules: "Rules",
            discord: "Discord",
            cart: "Cart",
        },
        hero: {
            title_part1: "ADVENTURE",
            title_part2: "AWAITS",
            description: "Join the ultimate Minecraft experience. Custom enchants, unique biomes, and a community that feels like home.",
            copy_ip: "Copy IP: play.sunshade.net",
            visit_store: "Visit Store",
            ip_copied: "IP Copied!",
            status_online: "Online & Stable",
            scroll_indicator: "Scroll",
        },
        features: {
            why_choose: "Explore Our",
            servers: "Servers",
            servers_description: "Choose your path. Each server offers a unique way to play, designed for stability and fun.",
            survival_title: "Survival RPG",
            survival_desc: "Unique classes, epic quests, unexplored biomes, and intense clan wars. A complete RPG experience in Minecraft.",
            anarchy_title: "Semi-Anarchy",
            anarchy_desc: "Frenzied PvP, Raids, and near-total freedom. Build, destroy, and conquer in a vanilla world with loose rules.",
            rankup_title: "Rankup OP",
            rankup_desc: "In Development. Prepare for a journey of evolution, mining, and economy like you've never seen before.",
            join_now: "Play Now",
            dev_badge: "DEV",
            coming_soon: "Coming Soon",
        },
        store: {
            title_prefix: "SunShade",
            title_suffix: "Store",
            subtitle: "Upgrade your experience with ranks, crates, and coins. All purchases support the server!",
            select_server: "Select Server",
            select_server_desc: "Choose where to receive your items",
            survival_rpg: "Survival RPG",
            survival_desc_short: "Quests, dungeons, and epic loot.",
            semi_anarchy: "Semi-Anarchy",
            anarchy_desc_short: "Raiding, PvP, and no grief protection.",
            global_items: "Global Items",
            step1: "Identify Yourself",
            step1_desc: "Enter Minecraft Username",
            step1_placeholder: "Enter Username",
            shopping_as: "Shopping as:",
            continue: "Continue",
            step2: "Choose your item",
            add_to_cart: "ADD TO CART",
            success_title: "Success!",
            success_msg: "Purchase initiated for user",
            error_title: "Error",
            error_msg: "Failed to process request.",
            no_products: "No products found for this server.",
        },
        products: {
            rank_vip_name: "VIP Rank",
            rank_vip_desc: "Get basic perks like fly in lobby, colored chat, and 1 exclusive kit.",
            rank_mvp_name: "MVP Rank",
            rank_mvp_desc: "All VIP perks + /heal, /feed, and 2 exclusive kits.",
            rank_elite_name: "ELITE Rank",
            rank_elite_desc: "The ultimate status. All previous perks + priority queue and special particle effects.",
            crate_common_name: "Common Crate Key",
            crate_common_desc: "Open a common crate for random loot.",
            crate_legendary_name: "Legendary Crate Key",
            crate_legendary_desc: "Open a legendary crate for high-tier loot.",
            coins_1000_name: "1000 Coins",
            coins_1000_desc: "In-game currency to spend at the shop.",
            rpg_key_common_name: "RPG Crate Key",
            rpg_key_common_desc: "Open a RPG crate for custom weapons and armor.",
            claim_blocks_1000_name: "1000 Claim Blocks",
            claim_blocks_1000_desc: "Expand your territory and protect your builds.",
            pet_dragon_name: "Pet Dragon",
            pet_dragon_desc: "A flyable dragon pet to travel the world.",
            tnt_kit_name: "Raider TNT Kit",
            tnt_kit_desc: "64x TNT and Flint & Steel. Perfect for raids.",
            obsidian_stack_name: "Obsidian Stack",
            obsidian_stack_desc: "64x Obsidian to fortify your base.",
            priority_queue_name: "Priority Queue",
            priority_queue_desc: "Skip the queue when the server is full.",
        },
        rules: {
            title: "Server Rules",
            section1_title: "1. Respect & Behavior",
            section1_list: [
                "Be respectful to all players and staff members.",
                "No hate speech, discrimination, or harassment.",
                "Keep chat clean and appropriate.",
            ],
            section2_title: "2. Gameplay",
            section2_list: [
                "No cheating, hacking, or exploiting bugs.",
                "No griefing in claimed areas.",
                "PvP is allowed only in designated areas.",
            ],
        },
        discord: {
            title: "Join our Discord!",
            subtitle: "Connect with the community, get support, and stay updated with the latest news.",
            join_btn: "Join Server",
        },
        footer: {
            desc: "The ultimate Minecraft adventure awaits. Join us today and start your journey!",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            rights: "All rights reserved.",
            affiliation: "Not affiliated with Mojang Studios.",
        },
        checkout: {
            title: "Checkout",
            empty_cart: "Your cart is empty.",
            go_store: "Go to Store",
            your_items: "Your Items",
            quantity: "Quantity",
            remove: "Remove",
            order_summary: "Order Summary",
            subtotal: "Subtotal",
            taxes: "Taxes",
            total: "Total",
            payment_method: "Payment Method",
            credit_card: "Credit Card",
            paypal: "PayPal",
            coupon_placeholder: "Coupon Code",
            apply: "Apply",
            complete_purchase: "Complete Purchase",
            processing: "Processing...",
            terms_agreement: "By completing the purchase, you agree to our",
            terms_link: "Terms of Service",
            success_title: "Thank You!",
            success_msg: "Your order has been processed correctly. You should receive your items in-game shortly.",
            return_home: "Return to Home",
            scan_pay: "Scan to Pay",
            scan_desc: "Open your bank app and scan the QR Code.",
            pix_copied: "PIX Code Copied!",
            copy_pix: "Copy PIX Code",
            paid_verify: "Once paid, you will receive your items verify in-game!",
            terms_required_title: "Terms Required",
            terms_required_msg: "Please agree to the Terms of Service to proceed.",
            username_required_title: "Username Required",
            username_required_msg: "Please go back to the store and enter your Minecraft username.",
            checkout_failed: "Checkout Failed",
            generic_error: "Something went wrong. Please try again.",
            pix_method: "PIX (Mercado Pago)",
            instant_approval: "INSTANT APPROVAL",
        },
        terms: {
            title: "Terms and Conditions of Purchase - SunShade",
            intro: "By making any donation or purchasing VIP packages in our store, you (the User) declare to have read, understood, and fully accepted the terms described below. If you do not agree with any of the points, we ask that you do not proceed with the acquisition.",
            section1_title: "1. Nature of Service and Digital Goods",
            section1_content: "1.1. All VIP packages sold on SunShade are entirely digital and intangible goods. 1.2. The purpose of the purchase is to grant in-game advantages and support server maintenance. 1.3. Delivery is automatic or semi-automatic. Upon receiving the in-game perks, the service is considered 'rendered and consumed'.",
            section2_title: "2. Validity and Changes to Packages (Monthly VIP)",
            section2_content: "2.1. Duration: Unless explicitly stated otherwise, VIP packages last for 30 (thirty) calendar days from activation. After this period, perks expire automatically. 2.2. Right to Modify: SunShade administration reserves the right to alter, at any time and without prior notice: The price charged; The content, items, permissions, and perks included; The name and hierarchy of ranks. 2.3. Changes to benefits may be applied retroactively if necessary for economy balancing or fairness.",
            section3_title: "3. No Refund Policy",
            section3_content: "3.1. All purchases are final. Due to the digital nature of the product, we DO NOT offer refunds, exchanges, or returns under any circumstances. 3.2. This includes, but is not limited to: Buyer's remorse; Performance issues on the user's computer; Dissatisfaction with perks; Loss of items due to death or errors. 3.3. Chargebacks/Disputes: Any attempt at a forced chargeback will result in a permanent and non-reversible ban.",
            section4_title: "4. Termination of Activities",
            section4_content: "4.1. SunShade is a private service that may be terminated, reset, or enter maintenance at any time. 4.2. Risk Clause: The user acknowledges that the server may close permanently at any time. If this occurs, there will be no compensation or refund. The amount paid is considered a donation.",
            section5_title: "5. Conduct and Bans",
            section5_content: "5.1. Purchasing a VIP package does not make the user immune to rules. 5.2. If a VIP user violates rules and is punished, they lose access to purchased perks during the punishment. 5.3. In case of a permanent ban, VIP is cancelled immediately without refund.",
            section6_title: "6. Disclaimer",
            section6_content: "6.1. SunShade is not affiliated, associated, or endorsed by Mojang AB, Microsoft, or any of their partners. 6.2. Minecraft is a registered trademark of Mojang AB.",
        }
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (section: string, key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('pt');

    useEffect(() => {
        // Check local storage or browser preference
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang) {
            setLanguage(savedLang);
        } else {
            const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
            setLanguage(browserLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (section: string, key: string) => {
        return translations[language][section]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
