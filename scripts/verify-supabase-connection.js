const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler .env.local manualmente para garantir que temos as chaves
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

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: URL ou Key não encontradas no .env.local');
  process.exit(1);
}

// Check for suspicious key format
if (supabaseKey.startsWith('sb_')) {
    console.log('⚠️  Aviso: A chave ANON parece estar num formato incomum (começa com "sb_"). O Supabase geralmente usa chaves JWT que começam com "eyJ".');
    console.log('   Tentando conectar mesmo assim...');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log(`📡 Tentando conectar ao Supabase em: ${supabaseUrl}`);
  
  // Tentar buscar 1 produto para validar conexão e tabela
  const { data, error } = await supabase
    .from('products')
    .select('count', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Falha na conexão ou tabela não encontrada:');
    console.error(JSON.stringify(error, null, 2));
    
    if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
        console.log('\n💡 DICA: O erro parece ser de AUTENTICAÇÃO. Verifique se a chave ANON KEY (Public) está correta.');
        console.log('   Ela deve começar com "eyJ..." e pode ser encontrada em Settings > API no painel do Supabase.');
    } else if (error.code === '42P01') {
        console.log('\n💡 DICA: A conexão funcionou, mas a tabela "products" NÃO EXISTE.');
        console.log('   Você precisa criar as tabelas no banco de dados.');
    }
  } else {
    console.log('✅ Conexão bem-sucedida!');
    console.log('   Tabela "products" encontrada.');
  }
}

checkConnection();
