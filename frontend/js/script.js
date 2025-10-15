// Configurações da API
const API_BASE_URL = 'http://localhost:8080';
let currentUser = null;
let messagePolling = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    loadGlobalMessages();
    startMessagePolling();
    setupEventListeners();
});

// Simulação de usuário logado (substituir por autenticação real)
function initializeUser() {
    // Em uma aplicação real, isso viria do login
    currentUser = {
        id: 1,
        name: 'Usuário Teste',
        avatar: 'UT'
    };
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').textContent = currentUser.avatar;
}

// Carregar mensagens globais
async function loadGlobalMessages(isPolling = false) {
    try {
        if (!isPolling) {
            console.log('🔄 Carregando mensagens de:', `${API_BASE_URL}/mensages/all`);
            updatePollingStatus('connecting');
        }
        
        const response = await fetch(`${API_BASE_URL}/mensages/all`);
        
        if (!response.ok) {
            const errorText = await response.text();
            if (!isPolling) {
                console.error('Error response text:', errorText);
            }
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        const responseText = await response.text();
        if (!isPolling) {
            console.log('✅ Mensagens carregadas:', responseText);
        }
        
        // Atualizar status para online
        updatePollingStatus('online');
        
        // Como o backend retorna uma String simples, vamos criar uma mensagem fake
        displayMessages([{
            id: 1,
            senderName: 'Sistema',
            content: responseText,
            timestamp: new Date(),
            encrypted: false,
            recipientId: 'global'
        }]);
        
    } catch (error) {
        updatePollingStatus('offline');
        
        if (!isPolling) {
            console.error('❌ Erro ao carregar mensagens:', error);
            showError(`Erro ao carregar mensagens: ${error.message}`);
        } else {
            // Durante polling, apenas log silencioso
            console.warn('⚠️ Erro no polling (tentativa automática):', error.message);
        }
    }
}

// Exibir mensagens na tela
function displayMessages(messages) {
    const container = document.getElementById('messagesContainer');
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="message">
                <div class="message-author">Sistema</div>
                <div class="message-text">Nenhuma mensagem ainda. Seja o primeiro a enviar!</div>
                <div class="message-time">--:--</div>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        const isEncrypted = message.encrypted && !message.isForCurrentUser;
        const isPrivate = message.recipientId && message.recipientId !== 'global';
        
        messageDiv.className = 'message';
        if (isEncrypted) messageDiv.classList.add('encrypted');
        if (isPrivate) messageDiv.classList.add('private');
        
        const displayText = isEncrypted ? '🔒 Mensagem criptografada' : message.content;
        
        messageDiv.innerHTML = `
            <div class="message-author">
                ${message.senderName}
                ${isPrivate ? '<span class="message-status">Privada</span>' : ''}
                ${isEncrypted ? '<span class="message-status">Criptografada</span>' : ''}
            </div>
            <div class="message-text">${displayText}</div>
            <div class="message-time">${formatTime(message.timestamp)}</div>
        `;
        
        container.appendChild(messageDiv);
    });
    
    container.scrollTop = container.scrollHeight;
}

// Enviar mensagem
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const recipient = document.getElementById('recipient');
    const sendButton = document.getElementById('sendButton');
    
    const content = messageInput.value.trim();
    if (!content) {
        alert('Por favor, digite uma mensagem!');
        return;
    }

    // Desabilitar botão durante o envio
    sendButton.disabled = true;
    sendButton.textContent = 'Enviando...';

    try {
        console.log('Enviando mensagem para:', `${API_BASE_URL}/mensages/add`);
        
        const messageData = {
            content: content,
            recipientId: recipient.value === 'global' ? null : parseInt(recipient.value),
            senderId: currentUser.id,
            encrypted: recipient.value !== 'global'
        };
        
        console.log('Dados da mensagem:', messageData);

        const response = await fetch(`${API_BASE_URL}/mensages/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const responseText = await response.text();
        console.log('Success response:', responseText);
        
        // Limpar campo de mensagem
        messageInput.value = '';
        
        // Mostrar mensagem de sucesso
        showSuccess(responseText);
        
        console.log('Mensagem enviada com sucesso!');
        
    } catch (error) {
        console.error('Erro completo:', error);
        console.error('Stack trace:', error.stack);
        showError(`Erro ao enviar mensagem: ${error.message}`);
    } finally {
        // Reabilitar botão
        sendButton.disabled = false;
        sendButton.textContent = 'Enviar Mensagem';
    }
}

// Mostrar sucesso
function showSuccess(message) {
    const container = document.getElementById('messagesContainer');
    const successDiv = document.createElement('div');
    successDiv.className = 'message';
    successDiv.style.background = '#d4edda';
    successDiv.style.borderLeft = '4px solid #28a745';
    
    successDiv.innerHTML = `
        <div class="message-author" style="color: #28a745;">✓ Sucesso</div>
        <div class="message-text">${message}</div>
        <div class="message-time">${formatTime(new Date())}</div>
    `;
    
    container.appendChild(successDiv);
    container.scrollTop = container.scrollHeight;
}

// Polling para atualizar mensagens automaticamente
function startMessagePolling() {
    // Buscar mensagens a cada 3 segundos
    messagePolling = setInterval(() => {
        loadGlobalMessages(true); // true = isPolling
    }, 3000);
    console.log('✅ Polling iniciado: buscando mensagens a cada 3 segundos');
}

// Parar polling (útil quando usuário sair da página)
function stopMessagePolling() {
    if (messagePolling) {
        clearInterval(messagePolling);
    }
}

// Formatar hora
function formatTime(timestamp) {
    if (!timestamp) return '--:--';
    
    const date = new Date(timestamp);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
}

// Atualizar status do polling
function updatePollingStatus(status, message) {
    const statusElement = document.getElementById('pollingStatus');
    if (statusElement) {
        switch (status) {
            case 'online':
                statusElement.innerHTML = '🟢 Online';
                statusElement.style.color = '#28a745';
                break;
            case 'offline':
                statusElement.innerHTML = '🔴 Offline';
                statusElement.style.color = '#dc3545';
                break;
            case 'connecting':
                statusElement.innerHTML = '🔄 Conectando...';
                statusElement.style.color = '#ffc107';
                break;
            case 'error':
                statusElement.innerHTML = `⚠️ ${message || 'Erro'}`;
                statusElement.style.color = '#fd7e14';
                break;
        }
    }
}

// Mostrar erro
function showError(message) {
    const container = document.getElementById('messagesContainer');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message';
    errorDiv.style.background = '#f8d7da';
    errorDiv.style.borderLeft = '4px solid #dc3545';
    
    errorDiv.innerHTML = `
        <div class="message-author" style="color: #dc3545;">❌ Erro</div>
        <div class="message-text">${message}</div>
        <div class="message-time">${formatTime(new Date())}</div>
    `;
    
    container.appendChild(errorDiv);
    container.scrollTop = container.scrollHeight;
}

// Event listeners adicionais
function setupEventListeners() {
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Limpar polling quando a página for fechada
window.addEventListener('beforeunload', stopMessagePolling);

// Função para testar conectividade
async function testConnection() {
    console.log('Testando conectividade...');
    try {
        const response = await fetch(`${API_BASE_URL}/mensages/all`);
        console.log('Teste - Status:', response.status);
        console.log('Teste - Headers:', [...response.headers.entries()]);
        const text = await response.text();
        console.log('Teste - Response:', text);
    } catch (error) {
        console.error('Teste - Erro:', error);
    }
}

// Executar teste ao carregar a página
setTimeout(testConnection, 2000);