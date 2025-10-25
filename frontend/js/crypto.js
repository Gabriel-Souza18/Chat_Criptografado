// Funções de criptografia RSA usando Web Crypto API

/**
 * Gera um par de chaves RSA (pública e privada)
 * @returns {Promise<CryptoKeyPair>} Par de chaves gerado
 */
async function generateKeyPair() {
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );
        return keyPair;
    } catch (error) {
        console.error("Erro ao gerar par de chaves:", error);
        throw error;
    }
}

/**
 * Exporta a chave pública para formato Base64
 * @param {CryptoKey} publicKey - Chave pública
 * @returns {Promise<string>} Chave pública em Base64
 */
async function exportPublicKey(publicKey) {
    try {
        const exported = await window.crypto.subtle.exportKey("spki", publicKey);
        const exportedAsBase64 = arrayBufferToBase64(exported);
        return exportedAsBase64;
    } catch (error) {
        console.error("Erro ao exportar chave pública:", error);
        throw error;
    }
}

/**
 * Exporta a chave privada para formato Base64
 * @param {CryptoKey} privateKey - Chave privada
 * @returns {Promise<string>} Chave privada em Base64
 */
async function exportPrivateKey(privateKey) {
    try {
        const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
        const exportedAsBase64 = arrayBufferToBase64(exported);
        return exportedAsBase64;
    } catch (error) {
        console.error("Erro ao exportar chave privada:", error);
        throw error;
    }
}

/**
 * Importa uma chave pública do formato Base64
 * @param {string} base64Key - Chave pública em Base64
 * @returns {Promise<CryptoKey>} Chave pública importada
 */
async function importPublicKey(base64Key) {
    try {
        const binaryKey = base64ToArrayBuffer(base64Key);
        const publicKey = await window.crypto.subtle.importKey(
            "spki",
            binaryKey,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["encrypt"]
        );
        return publicKey;
    } catch (error) {
        console.error("Erro ao importar chave pública:", error);
        throw error;
    }
}

/**
 * Importa uma chave privada do formato Base64
 * @param {string} base64Key - Chave privada em Base64
 * @returns {Promise<CryptoKey>} Chave privada importada
 */
async function importPrivateKey(base64Key) {
    try {
        const binaryKey = base64ToArrayBuffer(base64Key);
        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            binaryKey,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["decrypt"]
        );
        return privateKey;
    } catch (error) {
        console.error("Erro ao importar chave privada:", error);
        throw error;
    }
}

/**
 * Criptografa uma mensagem usando a chave pública
 * @param {string} message - Mensagem a ser criptografada
 * @param {CryptoKey} publicKey - Chave pública para criptografia
 * @returns {Promise<string>} Mensagem criptografada em Base64
 */
async function encryptMessage(message, publicKey) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            publicKey,
            data
        );
        
        return arrayBufferToBase64(encrypted);
    } catch (error) {
        console.error("Erro ao criptografar mensagem:", error);
        throw error;
    }
}

/**
 * Descriptografa uma mensagem usando a chave privada
 * @param {string} encryptedMessage - Mensagem criptografada em Base64
 * @param {CryptoKey} privateKey - Chave privada para descriptografia
 * @returns {Promise<string>} Mensagem descriptografada
 */
async function decryptMessage(encryptedMessage, privateKey) {
    try {
        const encryptedData = base64ToArrayBuffer(encryptedMessage);
        
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedData
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error("Erro ao descriptografar mensagem:", error);
        throw error;
    }
}

/**
 * Converte ArrayBuffer para Base64
 * @param {ArrayBuffer} buffer - Buffer a ser convertido
 * @returns {string} String Base64
 */
function arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return window.btoa(binary);
}

/**
 * Converte Base64 para ArrayBuffer
 * @param {string} base64 - String Base64
 * @returns {ArrayBuffer} ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Salva a chave privada no localStorage
 * @param {string} userId - ID do usuário
 * @param {string} privateKeyBase64 - Chave privada em Base64
 */
function savePrivateKey(userId, privateKeyBase64) {
    try {
        localStorage.setItem(`privateKey_${userId}`, privateKeyBase64);
    } catch (error) {
        console.error("Erro ao salvar chave privada:", error);
        throw error;
    }
}

/**
 * Recupera a chave privada do localStorage
 * @param {string} userId - ID do usuário
 * @returns {string|null} Chave privada em Base64 ou null se não existir
 */
function getPrivateKey(userId) {
    try {
        return localStorage.getItem(`privateKey_${userId}`);
    } catch (error) {
        console.error("Erro ao recuperar chave privada:", error);
        return null;
    }
}

/**
 * Remove a chave privada do localStorage
 * @param {string} userId - ID do usuário
 */
function removePrivateKey(userId) {
    try {
        localStorage.removeItem(`privateKey_${userId}`);
    } catch (error) {
        console.error("Erro ao remover chave privada:", error);
    }
}
