import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('data.db')
cursor = conn.cursor()

alter_query = "ALTER TABLE candidates DROP COLUMN hidden"
cursor.execute(alter_query)

alter_query = "ALTER TABLE candidates ADD COLUMN visible INTEGER DEFAULT 0"
cursor.execute(alter_query)

# Commit changes and close the connection
conn.commit()
conn.close()

