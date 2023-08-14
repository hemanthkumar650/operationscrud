#!/bin/bash

BACKUP_DIR=/path/to/backup/directory
REPO_DIR=/path/to/your/git/repo

cd $BACKUP_DIR

# Create a new backup
pg_dump -h hostname -U username -d database_name -f new_backup.sql

# Compare with the previous backup
if ! cmp -s new_backup.sql previous_backup.sql; then
    # Copy the new backup to the Git repository
    cp new_backup.sql $REPO_DIR/

    cd $REPO_DIR
    git add .
    git commit -m "Update database backup"
    git push origin master

    # Update the previous backup file
    cp new_backup.sql previous_backup.sql
else
    echo "No difference"
fi
