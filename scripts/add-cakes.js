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

const cakes = [
    // --- CHANTININHO ---
    {
        name: "Bolo Chantininho - PP (Aprox. 8 fatias)",
        description: "12cm | 1,2kg. Decoração artesanal. Conservar em geladeira.",
        price: 95.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80"
    },
    {
        name: "Bolo Chantininho - P (Aprox. 14 fatias)",
        description: "14cm | 1,7kg. Decoração artesanal. Conservar em geladeira.",
        price: 125.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80"
    },
    {
        name: "Bolo Chantininho - M (Aprox. 25 fatias)",
        description: "18cm | 2,5kg. Decoração artesanal. Conservar em geladeira.",
        price: 220.00,
        category: "Bolos",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80"
    },
    {
        name: "Bolo Chantininho - G (Aprox. 30 fatias)",
        description: "20cm | 3,5kg. Decoração artesanal. Conservar em geladeira.",
        price: 270.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80"
    },
    {
        name: "Bolo Chantininho - GG (Aprox. 40 fatias)",
        description: "24cm | 4,5kg. Decoração artesanal. Conservar em geladeira.",
        price: 325.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80"
    },

    // --- NAKED CAKE ---
    {
        name: "Naked Cake - PP (Aprox. 8 fatias)",
        description: "12cm | 1,1kg. Bolo pelado com recheio aparente e acetato.",
        price: 80.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=800&q=80"
    },
    {
        name: "Naked Cake - P (Aprox. 15 fatias)",
        description: "16cm | 1,7kg. Bolo pelado com recheio aparente e acetato.",
        price: 125.00,
        category: "Bolos",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=800&q=80"
    },
    {
        name: "Naked Cake - M (Aprox. 25 fatias)",
        description: "18cm | 2,5kg. Bolo pelado com recheio aparente e acetato.",
        price: 225.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=800&q=80"
    },
    {
        name: "Naked Cake - G (Aprox. 35 fatias)",
        description: "20cm | 3,5kg. Bolo pelado com recheio aparente e acetato.",
        price: 280.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=800&q=80"
    },

    // --- TORTA BRIGADEIRUDA ---
    {
        name: "Torta Brigadeiruda - Pequena (1kg)",
        description: "10 fatias. Sabores: Beijinho, Crocante, Bem Casado, Chocolatudo, Redninho, Cenoura. (Informe sabor na obs)",
        price: 85.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
    },
    {
        name: "Torta Brigadeiruda - Média (1,5kg)",
        description: "15 fatias. Sabores: Beijinho, Crocante, Bem Casado, Chocolatudo, Redninho, Cenoura. (Informe sabor na obs)",
        price: 115.00,
        category: "Bolos",
        popular: true,
        image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
    },
    {
        name: "Torta Brigadeiruda - Grande (2kg)",
        description: "25 fatias. Sabores: Beijinho, Crocante, Bem Casado, Chocolatudo, Redninho, Cenoura. (Informe sabor na obs)",
        price: 140.00,
        category: "Bolos",
        image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
    }
]

async function seed() {
    console.log("🍰 Cadastrando Bolos e Tortas...")

    for (const p of cakes) {
        const { error } = await supabase.from('products').insert([
            { ...p, active: true }
        ])
        if (error) console.error(`❌ Erro em ${p.name}:`, error.message)
        else console.log(`✅ ${p.name} adicionado!`)
    }
}

seed()
