BACKUP_DIR="/home/hemanth"
REPO_DIR="https://github.com/hemanthkumar650/operationscrud.git"
PG_HOST="127.0.0.1"
PG_USER="postgres"
PG_DB="postgres"


NEW_BACKUP_FILENAME="backup_$(date +%Y%m%d%H%M%S).sql"

pg_dump -h "$PG_HOST" -U "$PG_USER" -d "$PG_DB" -f "$BACKUP_DIR/$NEW_BACKUP_FILENAME"

if [ -f "$BACKUP_DIR/previous_backup.sql" ]; then
    if ! cmp -s "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$BACKUP_DIR/previous_backup.sql"; then
    
        cp "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$REPO_DIR/"

        cd "$REPO_DIR"
        git add "$NEW_BACKUP_FILENAME"
        git commit -m "Update database backup"
        git push origin master

        cp "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$BACKUP_DIR/previous_backup.sql"
    else
        echo "No difference"
    fi
else
    echo "No previous backup found. Saving the new backup as the previous backup."
    cp "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$BACKUP_DIR/previous_backup.sql"
fi
