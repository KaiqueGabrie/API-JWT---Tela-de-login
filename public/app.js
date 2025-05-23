// Simulação de API JWT
const API_BASE = 'https://jsonplaceholder.typicode.com'; // API de exemplo

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const loginBtn = document.getElementById('loginBtn');
const verificarStatusBtn = document.getElementById('verificarStatus');
const logoutBtn = document.getElementById('logout');
const statusDiv = document.getElementById('status');
const userInfoDiv = document.getElementById('userInfo');
const userEmailSpan = document.getElementById('userEmail');
const tokenExpirySpan = document.getElementById('tokenExpiry');

// Estado da aplicação
let currentUser = null;
let authToken = null;

// Funções utilitárias
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}

function setLoading(element, loading) {
  if (loading) {
    element.classList.add('loading');
    element.textContent = 'Carregando...';
  } else {
    element.classList.remove('loading');
  }
}

function generateMockJWT(email) {
  // Simulação de JWT (não usar em produção)
  const header = btoa(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const payload = btoa(JSON.stringify({
    email: email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hora
    iat: Math.floor(Date.now() / 1000)
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeJWT(token);
  if (!payload) return false;
  return payload.exp > Math.floor(Date.now() / 1000);
}

function updateUI() {
  if (currentUser && authToken && isTokenValid(authToken)) {
    // Usuário logado
    loginForm.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    userInfoDiv.classList.remove('hidden');
    
    const payload = decodeJWT(authToken);
    userEmailSpan.textContent = payload.email;
    tokenExpirySpan.textContent = new Date(payload.exp * 1000).toLocaleString('pt-BR');
    
    showStatus('Conectado com sucesso!', 'success');
  } else {
    // Usuário deslogado
    loginForm.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    userInfoDiv.classList.add('hidden');
    showStatus('Desconectado', 'info');
    currentUser = null;
    authToken = null;
  }
}

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  
  if (!email || !senha) {
    showStatus('Por favor, preencha todos os campos', 'error');
    return;
  }

  setLoading(loginBtn, true);
  
  try {
    // Simulação de login (substitua pela sua API real)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
    
    // Validação simples para demo
    if (email === 'admin@teste.com' && senha === '123456') {
      // Login bem-sucedido
      authToken = generateMockJWT(email);
      currentUser = { email };
      
      // Limpa o formulário
      emailInput.value = '';
      senhaInput.value = '';
      
      updateUI();
    } else {
      showStatus('Email ou senha incorretos', 'error');
    }
  } catch (error) {
    showStatus('Erro ao fazer login. Tente novamente.', 'error');
  } finally {
    setLoading(loginBtn, false);
    loginBtn.textContent = 'Fazer Login';
  }
});

verificarStatusBtn.addEventListener('click', () => {
  if (authToken && isTokenValid(authToken)) {
    const payload = decodeJWT(authToken);
    const timeLeft = payload.exp - Math.floor(Date.now() / 1000);
    const minutesLeft = Math.floor(timeLeft / 60);
    showStatus(`Token válido por mais ${minutesLeft} minutos`, 'success');
  } else {
    showStatus('Token inválido ou expirado', 'error');
    updateUI();
  }
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  authToken = null;
  updateUI();
  showStatus('Logout realizado com sucesso', 'info');
});

// Inicialização
updateUI();

// Adiciona informações de teste na tela
setTimeout(() => {
  if (!currentUser) {
    showStatus('Para testar: admin@teste.com / 123456', 'info');
  }
}, 1000);

// Verifica expiração do token periodicamente
setInterval(() => {
  if (authToken && !isTokenValid(authToken)) {
    showStatus('Token expirado. Faça login novamente.', 'error');
    updateUI();
  }
}, 30000); // Verifica a cada 30 segundos