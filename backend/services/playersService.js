// services/playersService.js

// Importa a conexão com o banco de dados
const { db } = require('../database');

// ─── VALIDAÇÃO ────────────────────────────────────────
// Função auxiliar que valida os dados antes de salvar
function validate(data) {
  const positions = ['Armador', 'Ala', 'Pivô'];

  if (!data.name || data.name.trim() === '') {
    throw new Error('Nome é obrigatório');
  }

  if (!data.age || data.age < 15 || data.age > 50) {
    throw new Error('Idade deve ser entre 15 e 50 anos');
  }

  if (!positions.includes(data.position)) {
    throw new Error('Posição deve ser Armador, Ala ou Pivô');
  }

  if (data.ppg === undefined || data.ppg < 0) {
    throw new Error('Pontos por jogo deve ser um número positivo');
  }

  if (!data.team || data.team.trim() === '') {
    throw new Error('Time é obrigatório');
  }
}

// ─── LISTAR TODOS ─────────────────────────────────────
function getAll() {
  // .all() retorna todos os registros como array
  return db.prepare('SELECT * FROM players').all();
}

// ─── BUSCAR POR ID ────────────────────────────────────
function getById(id) {
  // .get() retorna um único registro ou undefined
  return db.prepare('SELECT * FROM players WHERE id = ?').get(id);
}

// ─── CADASTRAR ────────────────────────────────────────
function create(data) {
  // Valida antes de qualquer coisa
  validate(data);

  const stmt = db.prepare(`
    INSERT INTO players (name, age, position, ppg, team)
    VALUES (@name, @age, @position, @ppg, @team)
  `);

  // .run() executa o INSERT e retorna info da operação
  const result = stmt.run(data);

  // Busca e retorna o jogador recém criado
  return getById(result.lastInsertRowid);
}

// ─── ATUALIZAR ────────────────────────────────────────
function update(id, data) {
  // Verifica se o jogador existe antes de atualizar
  const exists = getById(id);
  if (!exists) return null;

  validate(data);

  const stmt = db.prepare(`
    UPDATE players
    SET name = @name,
        age = @age,
        position = @position,
        ppg = @ppg,
        team = @team
    WHERE id = @id
  `);

  stmt.run({ ...data, id });

  // Retorna o jogador atualizado
  return getById(id);
}

// ─── DELETAR ──────────────────────────────────────────
function remove(id) {
  const exists = getById(id);
  if (!exists) return null;

  db.prepare('DELETE FROM players WHERE id = ?').run(id);

  // Retorna o jogador deletado pra confirmar
  return exists;
}

module.exports = { getAll, getById, create, update, remove };