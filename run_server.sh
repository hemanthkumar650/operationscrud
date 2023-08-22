BACKUP_DIR="/home/hemanth/operationscrud"
REPO_DIR="/home/hemanth/operationscrud"
PG_HOST="127.0.0.1"
PG_USER="postgres"
PG_DB="postgres"

BACKUP_FILENAME="schema_backup.sql"
PREVIOUS_BACKUP_FILENAME="previous_backup_schema.sql"  

TEMP_BACKUP_FILENAME="$BACKUP_DIR/temp_backup.sql"

pg_dump -h "$PG_HOST" -U "$PG_USER" -d "$PG_DB" --schema-only -f "$TEMP_BACKUP_FILENAME"

if [ -f "$BACKUP_DIR/$BACKUP_FILENAME" ]; then
    if ! cmp -s "$TEMP_BACKUP_FILENAME" "$BACKUP_DIR/$PREVIOUS_BACKUP_FILENAME"; then  
        cp "$TEMP_BACKUP_FILENAME" "$REPO_DIR/"
        git -C "$REPO_DIR" add "$BACKUP_FILENAME"
        git -C "$REPO_DIR" commit -m "Update schema backup"
        git -C "$REPO_DIR" push origin master
        mv "$TEMP_BACKUP_FILENAME" "$BACKUP_DIR/$BACKUP_FILENAME"
        mv "$BACKUP_DIR/$PREVIOUS_BACKUP_FILENAME" "$BACKUP_DIR/previous_backup_schema.sql"  
    else
        echo "No difference"
        rm "$TEMP_BACKUP_FILENAME"
    fi
else
    echo "No previous schema backup found. Saving the new schema backup as the previous backup."
    cp "$TEMP_BACKUP_FILENAME" "$BACKUP_DIR/$BACKUP_FILENAME"
    cp "$BACKUP_DIR/$BACKUP_FILENAME" "$BACKUP_DIR/$PREVIOUS_BACKUP_FILENAME"  
fi
