// database.js

// Importa o better-sqlite3
const Database = require('better-sqlite3');

// Abre (ou cria) o arquivo do banco de dados
// Se o arquivo não existir, o SQLite cria automaticamente
const db = new Database('basketstats.db');

// ─── INICIALIZAÇÃO ────────────────────────────────────
function init() {
  // Cria a tabela de jogadores se ela ainda não existir
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT    NOT NULL,
      age       INTEGER NOT NULL,
      position  TEXT    NOT NULL,
      ppg       REAL    NOT NULL,
      team      TEXT    NOT NULL
    )
  `);

  console.log('✅ Banco de dados inicializado');
}

// Exporta o db (pras queries) e o init (pro server.js chamar)
module.exports = { db, init };