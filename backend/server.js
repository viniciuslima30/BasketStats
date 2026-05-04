// server.js

// Importa o framework Express
const express = require('express');

// Importa o CORS — permite que o frontend acesse o backend
const cors = require('cors');

// Importa a função que conecta e inicializa o banco de dados
// (ainda vamos criar esse arquivo)
const database = require('./database');

// Cria a aplicação Express
const app = express();

// Define a porta — usa variável de ambiente se existir, senão usa 3000
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARES GLOBAIS ───────────────────────────────
// Habilita CORS para todas as rotas
app.use(cors());

// Permite que o Express entenda JSON no corpo das requisições
app.use(express.json());

// ─── ROTAS ────────────────────────────────────────────
// Importa e registra as rotas de jogadores
// (ainda vamos criar esse arquivo)
const playersRoutes = require('./routes/players');
app.use('/api/players', playersRoutes);

// ─── ROTA DE HEALTH CHECK ─────────────────────────────
// Rota simples pra confirmar que o servidor está no ar
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BasketStats API rodando!' });
});

// ─── INICIALIZAÇÃO ────────────────────────────────────
// Inicializa o banco de dados e só depois sobe o servidor
database.init();

app.listen(PORT, () => {
  console.log(`🏀 BasketStats rodando em http://localhost:${PORT}`);
});