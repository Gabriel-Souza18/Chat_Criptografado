// Configurações da API
const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;
let messagePolling = null;
let usersCache = []; // Cache para armazenar usuários e evitar múltiplas requisições

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    loadUsers(true).then(() => {
        // Carregar mensagens depois que os usuários estiverem carregados
        loadPrivateMessages();
    }); // Mostrar logs na inicialização
    startMessagePolling();
    setupEventListeners();
});

// Simulação de usuário logado (substituir por autenticação real)
function initializeUser() {
    // Em uma aplicação real, isso viria do login
    currentUser = {
        id: '1b2b123e-e402-44fb-b30b-a60440948bb9',
        name: 'gabriel_souza',
        avatar: 'G'
    };
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').textContent = currentUser.avatar;
}

// Carregar usuários do banco de dados
async function loadUsers(showLogs = true) {
    try {
        if (showLogs) {
            console.log('🔄 Carregando usuários de:', `${API_BASE_URL}/users`);
        }
        
        const response = await fetch(`${API_BASE_URL}/users`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${await response.text()}`);
        }
        
        const users = await response.json();
        if (showLogs) {
            console.log('✅ Usuários carregados:', users);
        }
        
        // Salvar usuários no cache para busca de nomes
        usersCache = users;
        
        populateRecipientSelect(users, showLogs);
        
    } catch (error) {
        if (showLogs) {
            console.error('❌ Erro ao carregar usuários:', error);
            showError(`Erro ao carregar usuários: ${error.message}`);
        } else {
            console.warn('⚠️ Erro silencioso ao atualizar usuários:', error.message);
        }
    }
}

// Popular select de destinatários com usuários do banco
function populateRecipientSelect(users, showLogs = true) {
    if (showLogs) {
        console.log('🔧 Populando select com usuários:', users);
        console.log('🔧 Usuário atual:', currentUser);
    }
    
    const recipientSelect = document.getElementById('recipient');
    
    if (!recipientSelect) {
        console.error('❌ Elemento select#recipient não encontrado!');
        return;
    }
    
    // Salvar valor selecionado atualmente
    const currentSelection = recipientSelect.value;
    
    // Limpar opções existentes
    recipientSelect.innerHTML = '';
    
    // Adicionar placeholder
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Selecione um destinatário...';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    recipientSelect.appendChild(placeholderOption);
    
    // Verificar se temos usuários
    if (!users || users.length === 0) {
        const noUsersOption = document.createElement('option');
        noUsersOption.value = '';
        noUsersOption.textContent = 'Nenhum usuário encontrado';
        noUsersOption.disabled = true;
        recipientSelect.appendChild(noUsersOption);
        if (showLogs) {
            console.log('⚠️ Nenhum usuário para adicionar ao select');
        }
        return;
    }
    
    // Adicionar usuários do banco (exceto o usuário atual)
    let addedUsers = 0;
    let currentSelectionStillExists = false;
    
    users.forEach(user => {
        if (showLogs) {
            console.log(`🔧 Verificando usuário: ${user.id} vs ${currentUser.id}`);
        }
        
        if (user.id !== currentUser.id) {
            const option = document.createElement('option');
            option.value = user.id;
            // Usar username ou name, dependendo do que o backend retorna
            option.textContent = user.username || user.name || user.id;
            recipientSelect.appendChild(option);
            addedUsers++;
            
            // Verificar se a seleção anterior ainda existe
            if (user.id === currentSelection) {
                currentSelectionStillExists = true;
            }
            
            if (showLogs) {
                console.log(`✅ Usuário adicionado: ${option.textContent} (ID: ${user.id})`);
            }
        } else if (showLogs) {
            console.log(`⏭️ Usuário atual ignorado: ${user.id}`);
        }
    });
    
    // Restaurar seleção anterior se ainda existir
    if (currentSelectionStillExists && currentSelection) {
        recipientSelect.value = currentSelection;
        if (showLogs) {
            console.log(`🔄 Seleção anterior restaurada: ${currentSelection}`);
        }
    } else {
        // Se não havia seleção ou a seleção não existe mais, selecionar placeholder
        recipientSelect.value = '';
    }
    
    if (showLogs) {
        console.log(`✅ Total de usuários adicionados ao select: ${addedUsers}`);
    }
}

// Buscar nome do usuário pelo ID
function getUserNameById(userId) {
    if (!userId) return 'Usuário Desconhecido';
    
    // Verificar se é o usuário atual
    if (userId === currentUser.id) {
        return currentUser.name + ' (Você)';
    }
    
    // Buscar no cache de usuários
    const user = usersCache.find(u => u.id === userId);
    if (user) {
        return user.username || user.name || `Usuário ${userId.substring(0, 8)}`;
    }
    
    // Se não encontrou, retornar uma versão encurtada do ID
    return `Usuário ${userId.substring(0, 8)}`;
}

// Carregar mensagens privadas
async function loadPrivateMessages(isPolling = false) {
    try {
        if (!isPolling) {
            console.log('🔄 Carregando mensagens de:', `${API_BASE_URL}/mensagens/ultimas`);
            updatePollingStatus('connecting');
        }
        
        const response = await fetch(`${API_BASE_URL}/mensagens/ultimas`);
        
        if (!response.ok) {
            const errorText = await response.text();
            if (!isPolling) {
                console.error('Error response text:', errorText);
            }
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        const messages = await response.json(); // Backend retorna JSON diretamente
        if (!isPolling) {
            console.log('✅ Mensagens carregadas do backend:', messages);
        }
        
        // Atualizar status para online
        updatePollingStatus('online');
        
        // Converter formato do backend para o formato do frontend
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            senderName: getUserNameById(msg.idUsuarioRemetente), // Buscar nome real do usuário
            content: msg.conteudoCriptografado,
            timestamp: new Date(msg.timestamp),
            encrypted: true, // Todas as mensagens do backend são criptografadas
            recipientId: 'private'
        }));
        
        if (!isPolling) {
            console.log('📋 Mensagens formatadas:', formattedMessages);
        }
        
        displayMessages(formattedMessages);
        
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
    
    // Ordenar mensagens por timestamp (mais antigas primeiro, mais recentes embaixo)
    const sortedMessages = [...messages].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB; // Ordem crescente: mais antigas primeiro
    });
    
    console.log('📋 Mensagens ordenadas:', sortedMessages);
    
    sortedMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        const isEncrypted = message.encrypted;
        const isPrivate = true; // Todas as mensagens são privadas agora
        
        messageDiv.className = 'message';
        if (isEncrypted) messageDiv.classList.add('encrypted');
        if (isPrivate) messageDiv.classList.add('private');
        
        // Mostrar o conteúdo criptografado como está no banco
        const displayText = message.content || 'Conteúdo não disponível';
        
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
    const recipientId = recipient.value;
    
    if (!content) {
        alert('Por favor, digite uma mensagem!');
        return;
    }
    
    // Remover validação de destinatário por enquanto, pois o backend não usa
    // if (!recipientId) {
    //     alert('Por favor, selecione um destinatário!');
    //     return;
    // }

    // Desabilitar botão durante o envio
    sendButton.disabled = true;
    sendButton.textContent = 'Enviando...';

    try {
        console.log('Enviando mensagem para:', `${API_BASE_URL}/mensagens`);
        
        const messageData = {
            conteudoCriptografado: content, // Backend espera este campo
            idUsuarioRemetente: currentUser.id // Backend espera este campo
        };
        
        console.log('Dados da mensagem:', messageData);

        const response = await fetch(`${API_BASE_URL}/mensagens`, {
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

        const responseData = await response.json(); // Backend retorna o objeto MensageModel
        console.log('Success response:', responseData);
        
        // Limpar campo de mensagem
        messageInput.value = '';
        
        // Mostrar mensagem de sucesso
        showSuccess(`Mensagem enviada com sucesso! ID: ${responseData.id}`);
        
        // Recarregar mensagens para mostrar a nova
        loadPrivateMessages();
        
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
        loadPrivateMessages(true); // true = isPolling
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
    
    // Atualizar lista de usuários quando clicar no select de destinatários
    const recipientSelect = document.getElementById('recipient');
    if (recipientSelect) {
        recipientSelect.addEventListener('focus', function() {
            console.log('🔄 Select de destinatários focado - atualizando lista de usuários...');
            loadUsers(false); // false = sem logs detalhados
        });
        
        recipientSelect.addEventListener('click', function() {
            console.log('🔄 Select de destinatários clicado - atualizando lista de usuários...');
            loadUsers(false); // false = sem logs detalhados
        });
    }
}

// Limpar polling quando a página for fechada
window.addEventListener('beforeunload', stopMessagePolling);

// Função para testar conectividade
async function testConnection() {
    console.log('Testando conectividade...');
    try {
        const response = await fetch(`${API_BASE_URL}/mensagens/ultimas`);
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