BACKUP_DIR="/home/hemanth"
REPO_DIR="https://github.com/hemanthkumar650/operationscrud.git"
PG_HOST="127.0.0.1"
PG_USER="postgres"
PG_DB="postgres"


NEW_BACKUP_FILENAME="schema_backup_$(date +%Y%m%d%H%M%S).sql"

pg_dump -h "$PG_HOST" -U "$PG_USER" -d "$PG_DB" --schema-only -f "$BACKUP_DIR/$NEW_BACKUP_FILENAME"

if [ -f "$BACKUP_DIR/previous_schema_backup.sql" ]; then
    if ! cmp -s "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$BACKUP_DIR/previous_schema_backup.sql"; then
    
        cp "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$REPO_DIR/"

        cd "$REPO_DIR"
        git add "$NEW_BACKUP_FILENAME"
        git commit -m "Update schema backup"
        git push origin master

        cp "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$BACKUP_DIR/previous_schema_backup.sql"
    else
        echo "No difference"
    fi
else
    echo "No previous schema backup found. Saving the new schema backup as the previous backup."
    cp "$BACKUP_DIR/$NEW_BACKUP_FILENAME" "$BACKUP_DIR/previous_schema_backup.sql"
fi
