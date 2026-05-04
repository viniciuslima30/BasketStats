// controllers/playersController.js

// Importa o service — onde fica a lógica de verdade
const playersService = require('../services/playersService');

// ─── LISTAR TODOS ─────────────────────────────────────
function getAll(req, res) {
  try {
    const players = playersService.getAll();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
}

// ─── BUSCAR POR ID ────────────────────────────────────
function getById(req, res) {
  try {
    // req.params.id vem da URL — ex: /api/players/3
    const player = playersService.getById(req.params.id);

    // Se não encontrou, retorna 404
    if (!player) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogador' });
  }
}

// ─── CADASTRAR ────────────────────────────────────────
function create(req, res) {
  try {
    // req.body contém os dados enviados pelo cliente
    const newPlayer = playersService.create(req.body);
    res.status(201).json(newPlayer);
  } catch (error) {
    // O service pode lançar erros de validação
    res.status(400).json({ error: error.message });
  }
}

// ─── ATUALIZAR ────────────────────────────────────────
function update(req, res) {
  try {
    const updatedPlayer = playersService.update(req.params.id, req.body);

    if (!updatedPlayer) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }

    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ─── DELETAR ──────────────────────────────────────────
function remove(req, res) {
  try {
    const deleted = playersService.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }

    res.json({ message: 'Jogador deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar jogador' });
  }
}

module.exports = { getAll, getById, create, update, remove };