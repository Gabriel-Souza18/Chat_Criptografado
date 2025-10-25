const API_BASE_URL = 'http://localhost:8080/api';

// Alternar entre abas
function showTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
    clearStatus();
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    
    const loginButton = document.getElementById('loginButton');
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showStatus('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    try {
        loginButton.disabled = true;
        loginButton.classList.add('loading');
        showStatus('Autenticando...', 'info');
        
        console.log('🔄 Buscando usuário:', username);
        
        // Buscar usuário pelo username
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }
        
        const users = await response.json();
        console.log('✅ Usuários encontrados:', users);
        
        const user = users.find(u => u.username === username);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        
        console.log('✅ Usuário encontrado:', user);
        
        // Verificar se a chave privada existe no localStorage
        const privateKeyBase64 = getPrivateKey(user.id);
        
        if (!privateKeyBase64) {
            throw new Error('Chave privada não encontrada. Faça login no mesmo navegador onde você se registrou.');
        }
        
        console.log('✅ Chave privada encontrada no localStorage');
        
        // Importar chave privada para verificar se está válida
        const privateKey = await importPrivateKey(privateKeyBase64);
        
        console.log('✅ Chave privada importada com sucesso');
        
        // Salvar sessão
        sessionStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            username: user.username,
            publicKey: user.publicKey
        }));
        
        showStatus('Login realizado com sucesso! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('❌ Erro no login:', error);
        showStatus(error.message || 'Erro ao fazer login', 'error');
        loginButton.disabled = false;
        loginButton.classList.remove('loading');
    }
}

// Registro
async function handleRegister(e) {
    e.preventDefault();
    
    const registerButton = document.getElementById('registerButton');
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    
    if (!username || !password || !confirmPassword) {
        showStatus('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showStatus('As senhas não coincidem', 'error');
        return;
    }
    
    if (password.length < 6) {
        showStatus('A senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    try {
        registerButton.disabled = true;
        registerButton.classList.add('loading');
        showStatus('Gerando chaves RSA...', 'info');
        
        console.log('🔄 Gerando par de chaves RSA...');
        
        // Gerar par de chaves RSA
        const keyPair = await generateKeyPair();
        
        console.log('✅ Par de chaves gerado');
        
        showStatus('Exportando chaves...', 'info');
        
        // Exportar chaves
        const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);
        const privateKeyBase64 = await exportPrivateKey(keyPair.privateKey);
        
        console.log('✅ Chaves exportadas');
        
        showStatus('Criando usuário...', 'info');
        
        console.log('🔄 Enviando dados para o backend...');
        
        // Enviar para o backend
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                publicKey: publicKeyBase64,
                secretKey: password // Por enquanto, enviando senha como secretKey
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro do backend:', errorText);
            throw new Error(errorText || 'Erro ao criar usuário');
        }
        
        const user = await response.json();
        
        console.log('✅ Usuário criado:', user);
        
        // Salvar chave privada no localStorage
        savePrivateKey(user.id, privateKeyBase64);
        
        console.log('✅ Chave privada salva no localStorage');
        
        // Salvar sessão
        sessionStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            username: user.username,
            publicKey: user.publicKey
        }));
        
        showStatus('Usuário criado com sucesso! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('❌ Erro no registro:', error);
        showStatus(error.message || 'Erro ao criar usuário', 'error');
        registerButton.disabled = false;
        registerButton.classList.remove('loading');
    }
}

// Funções auxiliares
function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = 'status-message show ' + type;
}

function clearStatus() {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';
}

// Verificar se já está logado
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
});
