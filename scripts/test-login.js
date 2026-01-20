const fetch = require('node-fetch'); // Em ambiente node puro precisa disso, mas vou usar o fetch nativo do node 18+

async function testLogin() {
    console.log("🔐 Testando login com ofuedoceria@gmail.com...");

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'ofuedoceria@gmail.com',
                password: 'doceofue2025'
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log("✅ Login SUCESSO! O servidor aceitou as credenciais.");
        } else {
            console.log("❌ Login FALHOU.", data);
            console.log("Status:", response.status);
        }

    } catch (error) {
        console.error("❌ Erro ao conectar com servidor:", error.message);
        console.log("O servidor (npm run dev) está rodando?");
    }
}

testLogin();
