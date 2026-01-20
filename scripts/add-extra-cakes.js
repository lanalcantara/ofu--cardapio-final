const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) env[key.trim()] = value.trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const products = [
    // --- BENTÔ CAKE ---
    {
        name: "Bentô Cake (Personalizado)",
        description: "Mini bolinho na marmita (aprox. 10cm/300g) com frase divertida/meme. Massa: Baunilha ou Chocolate. Recheio: Ninho, Choc ou Doce de Leite.",
        price: 40.00,
        category: "Bolos",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1557308536-ee471ef2c39a?w=800&q=80"
    },

    // --- BOLO VULCÃO TRADICIONAL ---
    {
        name: "Bolo Vulcão Tradicional - P (1,5kg)",
        description: "Sabores: Chocolate, Ninho, Bem Casado, Paçoca, Churros, Doce de Leite.",
        price: 50.00,
        category: "Bolos",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1623334044303-241021148842?w=800&q=80"
    },
    {
        name: "Bolo Vulcão Tradicional - M (2,0kg)",
        description: "Sabores: Chocolate, Ninho, Bem Casado, Paçoca, Churros, Doce de Leite.",
        price: 70.00,
        category: "Bolos",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1623334044303-241021148842?w=800&q=80"
    },

    // --- BOLO VULCÃO ESPECIAL ---
    {
        name: "Bolo Vulcão Especial - P (1,5kg)",
        description: "Sabores: Oreo, Doce de Leite c/ Crocante, Maracujá, Limão, Ninho c/ Nutella, Cenoura c/ Chocolate.",
        price: 60.00,
        category: "Bolos",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80"
    },
    {
        name: "Bolo Vulcão Especial - M (2,0kg)",
        description: "Sabores: Oreo, Doce de Leite c/ Crocante, Maracujá, Limão, Ninho c/ Nutella, Cenoura c/ Chocolate.",
        price: 80.00,
        category: "Bolos",
        popular: false,
        image_url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80"
    }
]

async function seed() {
    console.log("🌋 Cadastrando Vulcões e Bentôs...")

    for (const p of products) {
        const { error } = await supabase.from('products').insert([
            { ...p, active: true }
        ])
        if (error) console.error(`❌ Erro em ${p.name}:`, error.message)
        else console.log(`✅ ${p.name} adicionado!`)
    }
}

seed()
