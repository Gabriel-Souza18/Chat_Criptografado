# Guia da API - Chat Criptografado

## ✅ Configuração Concluída

### Banco de Dados MySQL
- **Banco:** chat_db
- **Usuário:** chat_user
- **Senha:** chat_password123
- **Porta:** 3306

### Servidor API
- **Porta:** 8080
- **Base URL:** http://localhost:8080/api

---

## 📋 Endpoints Disponíveis

### **Usuários**

#### 1. Criar novo usuário
```http
POST /api/users
Content-Type: application/json

{
  "username": "usuario1",
  "secretKey": "chave_secreta_base64",
  "publicKey": "chave_publica_base64"
}
```

#### 2. Listar todos os usuários
```http
GET /api/users
```

#### 3. Buscar usuário por ID
```http
GET /api/users/{id}
```

#### 4. Buscar usuário por username
```http
GET /api/users/username/{username}
```

---

### **Mensagens**

#### 1. Enviar mensagem no chat global
```http
POST /api/mensagens
Content-Type: application/json

{
  "conteudoCriptografado": "mensagem_criptografada_base64",
  "idUsuarioRemetente": "uuid-do-usuario"
}
```

#### 2. Buscar últimas 10 mensagens do chat global
```http
GET /api/mensagens/ultimas
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: TB_USER
- `id` - UUID (Primary Key)
- `username` - VARCHAR(255) UNIQUE
- `secret_key` - TEXT
- `public_key` - TEXT
- `created_at` - TIMESTAMP

### Tabela: TB_MENSAGE
- `id` - UUID (Primary Key)
- `conteudo_criptografado` - TEXT
- `id_usuario_remetente` - UUID
- `timestamp` - TIMESTAMP

---

## 🚀 Como Executar

### Opção 1: Usando Maven
```bash
cd /home/gabriel/Documentos/Chat/Chat_Criptografado/backend
mvn spring-boot:run
```

### Opção 2: Usando JAR compilado
```bash
cd /home/gabriel/Documentos/Chat/Chat_Criptografado/backend
mvn clean package -DskipTests
java -jar target/backend-1.0-SNAPSHOT.jar
```

---

## 📝 Próximos Passos Sugeridos

1. **Implementar Autenticação**
   - Adicionar JWT para segurança
   - Criar endpoint de login

2. **WebSockets para Chat em Tempo Real**
   - Configurar WebSocket para mensagens em tempo real
   - Notificações de novos usuários online

3. **Criptografia**
   - Implementar criptografia RSA no frontend
   - Troca de chaves públicas entre usuários

4. **Validações**
   - Adicionar validações de entrada (@Valid, @NotNull, etc.)
   - Tratamento de exceções personalizado

5. **Paginação**
   - Adicionar paginação para listagem de usuários
   - Melhorar query de mensagens com paginação

6. **Testes**
   - Criar testes unitários
   - Testes de integração com banco de dados

---

## 🔧 Configurações Importantes

O arquivo `application.properties` está configurado com:
- Hibernate DDL Auto: **update** (cria/atualiza tabelas automaticamente)
- SQL logging: **habilitado** (útil para debug)
- Porta do servidor: **8080**
- Context path: **/api**

---

## ⚠️ Observações

- As mensagens são enviadas diretamente para o chat global
- Não há necessidade de especificar destinatário nas queries
- As últimas 10 mensagens são retornadas em ordem decrescente por timestamp
- O banco de dados foi criado e configurado automaticamente

