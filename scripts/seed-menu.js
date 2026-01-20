const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Ler .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) env[key.trim()] = value.trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const products = [
    // --- BROWNIES E CUPCAKES ---
    {
        name: "Mini Brownies",
        description: "Deliciosos mini brownies nos sabores Ninho ou Chocolate. Pedido mínimo: 20 unidades.",
        price: 2.50,
        category: "Brownies",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80"
    },
    {
        name: "Cupcakes Recheados",
        description: "Massas: Baunilha, Chocolate, Cenoura. Recheios: Ninho, Chocolate, Doce de Leite. Pedido mínimo: 6 unidades.",
        price: 5.00,
        category: "Cupcakes",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80"
    },

    // --- LEMBRANCINHAS ---
    {
        name: "Lembrancinha Brownie (Adesivo)",
        description: "Brownie embalado individualmente com adesivo personalizado. Perfeito para festas.",
        price: 3.00,
        category: "Lembrancinhas",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&q=80"
    },
    {
        name: "Lembrancinha Brownie (Fita Cetim)",
        description: "Brownie embalado com laço de fita de cetim. Elegância para seu evento.",
        price: 4.00,
        category: "Lembrancinhas",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&q=80"
    },
    {
        name: "Palha Italiana (Adesivo)",
        description: "Palha italiana (Ninho, Chocolate ou Doce de Leite) com adesivo. Pedido min: 10un.",
        price: 3.50,
        category: "Lembrancinhas",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=800&q=80"
    },
    {
        name: "Palha Italiana (Fita Cetim)",
        description: "Palha italiana com laço de fita de cetim. Pedido min: 10un.",
        price: 4.50,
        category: "Lembrancinhas",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=800&q=80"
    },

    // --- BRIGADEIROS PERSONALIZADOS ---
    {
        name: "Brigadeiros Coloridos",
        description: "Brigadeiros com decoração colorida. Sabores variados.",
        price: 2.50,
        category: "Brigadeiros Gourmet",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80"
    },
    {
        name: "Brigadeiros Metalizados/Glitter",
        description: "Brigadeiros com acabamento luxuoso metalizado ou glitter.",
        price: 3.00,
        category: "Brigadeiros Gourmet",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80"
    },
    {
        name: "Brigadeiros Personalizados (Aplique)",
        description: "Brigadeiros com apliques de pasta americana personalizados no tema da festa.",
        price: 3.50,
        category: "Brigadeiros Gourmet",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=800&q=80"
    },
    {
        name: "Brigadeiros Diferenciados 18g",
        description: "Sabores Especiais: Brulée, Caramelo Salgado, Ferrero, Oreo, Pistache, etc. (Verificar disponibilidade).",
        price: 2.80,
        category: "Brigadeiros Gourmet",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&q=80"
    },

    // --- DOCINHOS (SIMPLES) ---
    {
        name: "Docinho Tradicional 16g",
        description: "Sabores clássicos: Brigadeiro, Beijinho, Bem Casado, Cajuzinho, Paçoca. O cento da festa!",
        price: 1.70,
        category: "Docinhos",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1599389731422-3860d4bde207?w=800&q=80"
    },
    {
        name: "Docinho Especial 16g",
        description: "Sabores: Churros, Ninho, Ninho c/ Nutella, Surpresa de Uva, Ouriço.",
        price: 1.90,
        category: "Docinhos",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1599389731422-3860d4bde207?w=800&q=80"
    },

    // --- TABULEIROS / PRESENTES ---
    {
        name: "Tabuleiro de Brownie 16un (Simples)",
        description: "20x20cm (16 fatias). Sabores: Blondie, Chocolate, Nesquik, Farinha Láctea. Sem cobertura.",
        price: 35.00,
        category: "Presentes",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=80"
    },
    {
        name: "Tabuleiro de Brownie 16un (Com Cobertura)",
        description: "20x20cm (16 fatias). Coberturas: Ninho, Chocolate, Doce de Leite, Oreo, Nutella (+R$5).",
        price: 45.00,
        category: "Presentes",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=80"
    },
    {
        name: "Tabuleiro de Brownie 25un (Simples)",
        description: "25x25cm (25 fatias). Ideal para dividir com a família toda.",
        price: 60.00,
        category: "Presentes",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=80"
    },
    {
        name: "Tabuleiro de Brownie 25un (Com Cobertura)",
        description: "25x25cm (25 fatias) com cobertura generosa. O presente perfeito.",
        price: 75.00,
        category: "Presentes",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=80"
    }
]

async function seed() {
    console.log("🌱 Iniciando cadastro de produtos do cardápio...")
    let count = 0

    for (const p of products) {
        const { error } = await supabase.from('products').insert([
            { ...p, active: true }
        ])
        if (error) console.error(`Erro ao inserir ${p.name}:`, error.message)
        else {
            console.log(`✅ ${p.name} cadastrado!`)
            count++
        }
    }
    console.log(`✨ Concluído! ${count} produtos adicionados.`)
}

seed()
