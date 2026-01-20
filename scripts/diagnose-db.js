const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey ? supabaseKey.length : 0);

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('\n--- 1. Testando SELECT simples na tabela products ---');
    const { data: d1, error: e1 } = await supabase.from('products').select('*').limit(1);
    if (e1) {
        console.error('❌ Falha no SELECT simples:');
        console.error(JSON.stringify(e1, null, 2));
    } else {
        console.log('✅ SELECT simples funcionou. Registros retornados:', d1.length);
        if (d1.length > 0) {
            console.log('Campos disponíveis no primeiro registro:', Object.keys(d1[0]));
        }
    }

    console.log('\n--- 2. Testando Query da Aplicação (active=true) ---');
    const { data: d2, error: e2 } = await supabase.from('products').select('*').eq('active', true).limit(1);
    if (e2) {
        console.error('❌ Falha na Query da Aplicação:');
        console.error(JSON.stringify(e2, null, 2));
    } else {
        console.log('✅ Query da Aplicação funcionou.');
    }

    // Tentar inserir se não existir nada
    if (!e1 && d1.length === 0) {
        console.log('\n--- 3. Tentativa de Inserção Teste (Pode falhar por RLS) ---');
        const { error: e3 } = await supabase.from('products').insert([{
            name: 'Produto Teste',
            price: 10,
            category: 'bolos',
            active: true,
            popular: false,
            description: 'Teste'
        }]);

        if (e3) {
            console.error('Erro na inserção:', e3);
        } else {
            console.log('Inserção de teste bem sucedida (ou aceita pelo banco).');
        }
    }
}

diagnose();
