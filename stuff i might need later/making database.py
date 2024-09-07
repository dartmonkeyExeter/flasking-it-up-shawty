import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
connection = sqlite3.connect("C:/Users/aaron/Desktop/schol/data.db")
cursor = connection.cursor()

# Create the candidates table
cursor.execute("""
CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY,
    name TEXT,
    date_of_birth TEXT,
    location TEXT,
    email TEXT
)
""")

# Create the skills table
cursor.execute("""
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY,
    name TEXT
)
""")

# Create the candidate_skills table (many-to-many relationship)
cursor.execute("""
CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id INTEGER,
    skill_id INTEGER,
    rating INTEGER,
    FOREIGN KEY(candidate_id) REFERENCES candidates(id),
    FOREIGN KEY(skill_id) REFERENCES skills(id),
    PRIMARY KEY (candidate_id, skill_id)
)
""")

# Insert skills into the skills table (if they don't already exist)
skills = ['HTML', 'CSS', 'JavaScript', 'Python', 'Python Flask', 'C#.NET & ASP']
for skill in skills:
    cursor.execute("INSERT OR IGNORE INTO skills (name) VALUES (?)", (skill,))

# Commit changes and close the connection
connection.commit()
connection.close()
