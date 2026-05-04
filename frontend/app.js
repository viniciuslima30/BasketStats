// app.js

// URL base da API — facilita trocar depois se precisar
const API_URL = 'http://localhost:3000/api/players';

// ─── INICIALIZAÇÃO ────────────────────────────────────
// Roda automaticamente quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
  loadPlayers();
});

// ─── CARREGAR JOGADORES ───────────────────────────────
async function loadPlayers() {
  try {
    const position = document.getElementById('filter-position').value;
    const sortBy   = document.getElementById('sort-by').value;

    // Busca todos os jogadores na API
    const response = await fetch(API_URL);
    let players    = await response.json();

    // ── Filtro por posição (feito no frontend) ──
    if (position) {
      players = players.filter(p => p.position === position);
    }

    // ── Ordenação ──
    if (sortBy === 'ppg') {
      players.sort((a, b) => b.ppg - a.ppg);
    } else if (sortBy === 'name') {
      players.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'age') {
      players.sort((a, b) => a.age - b.age);
    }

    renderPlayers(players);

  } catch (error) {
    console.error('Erro ao carregar jogadores:', error);
  }
}

// ─── RENDERIZAR JOGADORES ─────────────────────────────
function renderPlayers(players) {
  const list    = document.getElementById('players-list');
  const empty   = document.getElementById('empty-message');
  const count   = document.getElementById('players-count');

  // Limpa a lista antes de renderizar
  list.innerHTML = '';

  // Atualiza o contador
  count.textContent = `(${players.length})`;

  // Se não há jogadores, mostra mensagem
  if (players.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  // Cria um card pra cada jogador
  players.forEach(player => {
    const card = document.createElement('div');
    card.className = 'player-card';

    // innerHTML monta o HTML do card com os dados do jogador
    card.innerHTML = `
      <h3>${player.name}</h3>

      <div class="player-info">
        <span>🎂 <strong>${player.age}</strong> anos</span>
        <span>📍 <strong>${player.position}</strong></span>
        <span>🏀 <strong>${player.team}</strong></span>
      </div>

      <div class="ppg-badge">⭐ ${player.ppg} PPG</div>

      <div class="card-actions">
        <button class="btn-edit" onclick="editPlayer(${player.id})">Editar</button>
        <button class="btn-delete" onclick="deletePlayer(${player.id})">Deletar</button>
      </div>
    `;

    list.appendChild(card);
  });
}

// ─── SALVAR JOGADOR (cria ou edita) ───────────────────
async function savePlayer() {
  // Coleta os dados do formulário
  const id   = document.getElementById('player-id').value;
  const data = {
    name    : document.getElementById('name').value.trim(),
    age     : Number(document.getElementById('age').value),
    position: document.getElementById('position').value,
    ppg     : Number(document.getElementById('ppg').value),
    team    : document.getElementById('team').value.trim(),
  };

  // Validação básica no frontend
  if (!data.name || !data.age || !data.position || !data.team) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    // Se tem ID é edição (PUT), senão é cadastro (POST)
    const method = id ? 'PUT' : 'POST';
    const url    = id ? `${API_URL}/${id}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Erro: ${error.error}`);
      return;
    }

    // Limpa o formulário e recarrega a lista
    cancelEdit();
    loadPlayers();

  } catch (error) {
    console.error('Erro ao salvar jogador:', error);
  }
}

// ─── EDITAR JOGADOR ───────────────────────────────────
async function editPlayer(id) {
  try {
    // Busca os dados atuais do jogador
    const response = await fetch(`${API_URL}/${id}`);
    const player   = await response.json();

    // Preenche o formulário com os dados do jogador
    document.getElementById('player-id').value   = player.id;
    document.getElementById('name').value         = player.name;
    document.getElementById('age').value          = player.age;
    document.getElementById('position').value     = player.position;
    document.getElementById('ppg').value          = player.ppg;
    document.getElementById('team').value         = player.team;

    // Atualiza o título e os botões
    document.getElementById('form-title').textContent = 'Editar Jogador';
    document.getElementById('btn-save').textContent   = 'Salvar';
    document.getElementById('btn-cancel').classList.remove('hidden');

    // Rola a página até o formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Erro ao carregar jogador:', error);
  }
}

// ─── DELETAR JOGADOR ──────────────────────────────────
async function deletePlayer(id) {
  // Pede confirmação antes de deletar
  if (!confirm('Tem certeza que deseja deletar este jogador?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadPlayers();
  } catch (error) {
    console.error('Erro ao deletar jogador:', error);
  }
}

// ─── CANCELAR EDIÇÃO ──────────────────────────────────
function cancelEdit() {
  // Limpa todos os campos
  document.getElementById('player-id').value    = '';
  document.getElementById('name').value         = '';
  document.getElementById('age').value          = '';
  document.getElementById('position').value     = '';
  document.getElementById('ppg').value          = '';
  document.getElementById('team').value         = '';

  // Volta o formulário pro estado inicial
  document.getElementById('form-title').textContent = 'Cadastrar Jogador';
  document.getElementById('btn-save').textContent   = 'Cadastrar';
  document.getElementById('btn-cancel').classList.add('hidden');
}