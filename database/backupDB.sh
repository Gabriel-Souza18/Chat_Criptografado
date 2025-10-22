#!/bin/bash

BACKUP_DIR="/home/$USER/backups_chat"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/chat_db_backup_$DATE.sql"

echo "💾 Criando backup do banco chat_db..."
mkdir -p $BACKUP_DIR

mysqldump -u chat_user -pchat_password123 chat_db > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup criado: $BACKUP_FILE"
    
    # Manter apenas os últimos 7 backups
    ls -t $BACKUP_DIR/chat_db_backup_*.sql | tail -n +8 | xargs rm -f
    echo "🧹 Backups antigos removidos (mantidos últimos 7)"
else
    echo "❌ Erro ao criar backup"
fi