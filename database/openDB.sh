#!/bin/bash

echo "🔍 Verificando status do MySQL..."
sudo systemctl status mysql --no-pager

echo "🚀 Iniciando MySQL..."
sudo systemctl start mysql

sleep 3

echo "✅ Status atual:"
sudo systemctl status mysql --no-pager | grep "Active"

echo "📊 Tentando conectar ao banco..."
mysql -u chat_user -pchat_password123 -e "SHOW DATABASES;" chat_db

if [ $? -eq 0 ]; then
    echo "🎉 MySQL está rodando e acessível!"
else
    echo "❌ Erro ao conectar ao MySQL"
fi