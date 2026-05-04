// routes/players.js

const express = require('express');

// Router é um mini-app Express — agrupa rotas relacionadas
const router = express.Router();

// Importa o controller — ele vai lidar com cada requisição
const playersController = require('../controllers/playersController');

// ─── ROTAS ────────────────────────────────────────────

// Lista todos os jogadores
router.get('/', playersController.getAll);

// Busca um jogador pelo ID
router.get('/:id', playersController.getById);

// Cadastra um novo jogador
router.post('/', playersController.create);

// Atualiza um jogador pelo ID
router.put('/:id', playersController.update);

// Deleta um jogador pelo ID
router.delete('/:id', playersController.remove);

module.exports = router;