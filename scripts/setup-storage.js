const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Ler .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const env = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        env[key.trim()] = value.trim()
    }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Faltam variáveis de ambiente (URL ou KEY)")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStorage() {
    console.log("🔍 Verificando Storage do Supabase...")

    // 1. Listar Buckets existentes
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error("❌ Erro ao listar buckets:", error.message)
        return
    }

    console.log("📦 Buckets encontrados:", buckets.map(b => b.name))

    const bucketName = 'products'
    const existingBucket = buckets.find(b => b.name === bucketName)

    if (existingBucket) {
        console.log(`✅ O bucket '${bucketName}' já existe!`)
    } else {
        console.log(`⚠️ O bucket '${bucketName}' NÃO existe. Tentando criar...`)
        // Tentar criar (pode falhar se a chave ANON não tiver permissão, o que é comum)
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760 // 10MB
        })

        if (createError) {
            console.error("❌ Falha ao criar bucket (provavelmente permissão):", createError.message)
            console.log("💡 DICA: Crie manualmente um bucket 'products' publico no https://app.supabase.com")
        } else {
            console.log("✅ Bucket 'products' criado com sucesso!")
        }
    }
}

checkStorage()
