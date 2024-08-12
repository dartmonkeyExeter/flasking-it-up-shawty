import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
connection = sqlite3.connect("C:/Users/aaron/Desktop/schol/data.db")
cursor = connection.cursor()

# cheeky program to allow adding candidates to the database and skills
'''
while True:
    name = input("Name: ")
    date_of_birth = input("Date of Birth: ")
    location = input("Location: ")
    email = input("Email: ")

    cursor.execute("INSERT INTO candidates (name, date_of_birth, location, email) VALUES (?, ?, ?, ?)", (name, date_of_birth, location, email))
    # get most recent candidate ID
    cursor.execute("SELECT MAX(id) FROM candidates")
    candidateID = cursor.fetchone()[0]

    # Adding skills
    skills = input("Enter the candidate's skills, separated by commas: ").split(',')

    for skill in skills:
        skill = skill.strip()  # Remove any leading/trailing spaces

        # Check if the skill already exists in the skills table
        cursor.execute("SELECT id FROM skills WHERE name = ?", (skill,))
        skillID = cursor.fetchone()

        if skillID is None:
            # If the skill doesn't exist, insert it and get the new skill ID
            cursor.execute("INSERT INTO skills (name) VALUES (?)", (skill,))
            skillID = cursor.lastrowid
            print("skill added!")
        else:
            # If the skill exists, get the existing skill ID
            print("skill exists!")
            skillID = skillID[0]

        # Insert into candidate_skills table
        rating = int(input(f"Enter your rating for {skill} (1-5): "))
        cursor.execute("INSERT INTO candidate_skills (candidate_id, skill_id, rating) VALUES (?, ?, ?)", 
                    (candidateID, skillID, rating))

    connection.commit()
    print("Candidate added successfully")
    add_another = input("Would you like to add another candidate? (y/n): ")
    if add_another.lower() == "n":
        break
'''

connection.close()
