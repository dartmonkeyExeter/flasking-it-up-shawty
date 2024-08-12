import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('data.db')
cursor = conn.cursor()

cursor.execute("DELETE FROM candidates WHERE id = 6")
cursor.execute("DELETE FROM candidate_skills WHERE candidate_id = 6")

# Commit changes and close the connection
conn.commit()
conn.close()

