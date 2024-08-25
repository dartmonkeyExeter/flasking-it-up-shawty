from flask import Flask, redirect, url_for, render_template, request, session
import sqlite3
import os

os.chdir("C:/Users/aaron/Desktop/schol")

app = Flask(__name__)
app.secret_key = "secret_key"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/candidates/<int:candidate_id>/")
def candidate(candidate_id):
    # Establish database connection
    with sqlite3.connect("data.db") as connection:
        cursor = connection.cursor()

        if "loggedin" in session:
            cursor.execute("SELECT * FROM candidates WHERE id = ?", (candidate_id,))
        else:
            cursor.execute(
                "SELECT * FROM candidates WHERE id = ? AND visible = 1", (candidate_id,)
            )

        candidate = cursor.fetchone()

        if candidate is None:
            return redirect(
                url_for("candidates")
            )  # Redirect to candidates page if candidate not found

        # Extract candidate details
        cName = candidate[1]
        cDOB = candidate[2]
        cLocation = candidate[3]
        cEmail = candidate[4]

        file_exts = ["png", "jpg", "jpeg", "jfif", "webp"]
        base_path = "static/candidate images/"
        image_filename = None

        for ext in file_exts:
            candidate_image = f"{cName}.{ext}"
            if os.path.exists(os.path.join(base_path, candidate_image)):
                print(candidate_image)
                image_filename = candidate_image
                break

        if image_filename is None:
            image_filename = "default.png"
        cursor.execute(
            "SELECT skills.name, candidate_skills.rating FROM candidate_skills JOIN skills ON candidate_skills.skill_id = skills.id WHERE candidate_skills.candidate_id = ?",
            (candidate_id,),
        )
        skills = cursor.fetchall()

    # Render template with candidate details
    return render_template(
        "candidate_page.html",
        candidateName=cName,
        candidateDOB=cDOB,
        candidateLocation=cLocation,
        candidateEmail=cEmail,
        candidateSkills=skills,
        candidateImage=image_filename,
    )


@app.route("/candidates/")  # show all candidates from SQL database
def candidates():
    # Establish database connection
    with sqlite3.connect("data.db") as connection:
        cursor = connection.cursor()
        if "loggedin" in session:
            cursor.execute("SELECT * FROM candidates")
        else:
            cursor.execute("SELECT * FROM candidates WHERE visible = 1")
        candidates = cursor.fetchall()

    filenames = []
    exts = ["png", "jpg", "jpeg", "jfif", "webp"]
    image_filename = None

    for candidate in candidates:
        for ext in exts:
            if os.path.exists(f"static/candidate images/{candidate[1]}.{ext}"):
                image_filename = f"{candidate[1]}.{ext}"
                break
        if image_filename is None:
            filenames.append("default.png")
        else:
            filenames.append(image_filename)
        image_filename = None

    print(filenames)

    # Render template with candidate details
    return render_template(
        "candidates.html", candidates=candidates, filenames=filenames
    )


@app.route("/login/", methods=["GET", "POST"])
def login():
    if "loggedin" in session:
        return redirect(url_for("editlist"))

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        with sqlite3.connect("data.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM users WHERE username = ? AND password = ?",
                (username, password),
            )
            account = cursor.fetchone()

        if account:
            session["loggedin"] = True
            session["id"] = account[0]
            session["username"] = account[1]
            return render_template("soyourefinallyawake.html")
        else:
            return render_template(
                "login_page.html", error="Invalid username or password."
            )

    return render_template("login_page.html")

@app.route("/logout/")
def logout():
    session.pop("loggedin", None)
    session.pop("id", None)
    session.pop("username", None)
    return redirect(url_for("login"))


@app.route(
    "/register/", methods=["GET", "POST"]
)  # this is for registering a new CANDIDATE, not a new admin.
def register():
    if request.method == "POST":
        name = request.form["name"]
        dob = request.form["date_of_birth"]
        location = request.form["location"]
        email = request.form["email"]
        skills = request.form.getlist("skills[]")
        ratings = request.form.getlist("ratings[]")

        # no idea how im gonna do this but gotta get the image, upload it into static/candidate images, and then save the filename as the candidate name
        image = request.files["img"]
        file_ext = image.filename.split(".")[-1]
        image.save(f"static/candidate images/{name}.{file_ext}")
        # maybe thisll work who knows really

        with sqlite3.connect("data.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO candidates (name, date_of_birth, location, email) VALUES (?, ?, ?, ?)",
                (name, dob, location, email),
            )
            candidate_id = cursor.lastrowid

            for skill, rating in zip(skills, ratings):
                skill = skill.strip()

                cursor.execute("SELECT id FROM skills WHERE name = ?", (skill,))
                skillID = cursor.fetchone()

                if skillID is None:
                    cursor.execute("INSERT INTO skills (name) VALUES (?)", (skill,))
                    skillID = cursor.lastrowid
                else:
                    skillID = skillID[0]

                cursor.execute("INSERT INTO candidate_skills (candidate_id, skill_id, rating) VALUES (?, ?, ?)",(candidate_id, skillID, rating),)

            connection.commit()

        return redirect(url_for("candidates"))
    return render_template("register_page.html")


@app.route("/editlist/", methods=["GET", "POST"])
def editlist():
    if "loggedin" not in session:
        return redirect(url_for("login"))

    max_candidate_id = 0

    if request.method == "POST":
        with sqlite3.connect("data.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM candidates WHERE location LIKE ? OR name LIKE ? OR email LIKE ? OR id IN (SELECT id FROM skills WHERE name LIKE ?)",
                (f"%{request.form['query']}%", f"%{request.form['query']}%", f"%{request.form['query']}%", f"%{request.form['query']}%"),
            )
            candidates = cursor.fetchall()
    else:
        with sqlite3.connect("data.db") as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM candidates")
            candidates = cursor.fetchall()

    try:
        max_candidate_id = max([candidate[0] for candidate in candidates])
    except ValueError:
        max_candidate_id = 0
    # Get all image filenames, create a dictionary with candidate name as key and image filename as value
    files = {}
    for candidate in candidates:
        name = candidate[1]
        file_exts = ["png", "jpg", "jpeg", "jfif", "webp"]
        base_path = "static/candidate images/"
        image_filename = None

        for ext in file_exts:
            candidate_image = f"{name}.{ext}"
            if os.path.exists(os.path.join(base_path, candidate_image)):
                image_filename = candidate_image
                break

        if image_filename is None:
            image_filename = "default.png"

        files[name] = image_filename

    return render_template("edit_list.html", candidates=candidates, filenames=files, candidate_max=max_candidate_id)


@app.route("/edit/")
def editredirect():
    if "loggedin" not in session:
        return redirect(url_for("login"))

    return redirect(url_for("editlist"))


@app.route("/edit/<int:candidate_id>/", methods=["GET", "POST"])
def edit(candidate_id):
    if "loggedin" not in session:
        return redirect(url_for("login"))

    with sqlite3.connect("data.db") as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM candidates WHERE id = ?", (candidate_id,))
        candidate = cursor.fetchone()

        if candidate is None:
            return redirect(url_for("edit"))

        cName = candidate[1]
        cDOB = candidate[2]
        cLocation = candidate[3]
        cEmail = candidate[4]

        cursor.execute(
            "SELECT skills.name, candidate_skills.rating FROM candidate_skills JOIN skills ON candidate_skills.skill_id = skills.id WHERE candidate_skills.candidate_id = ?",
            (candidate_id,),
        )
        skills = cursor.fetchall()
        skill_data = [{"name": skill[0], "rating": skill[1]} for skill in skills]

    if request.method == "POST":
        name = request.form["name"]
        dob = request.form["date_of_birth"]
        location = request.form["location"]
        email = request.form["email"]
        skills = request.form.getlist("skills[]")
        ratings = request.form.getlist("ratings[]")
        visible = request.form.get("visible")
        visible = 1 if visible == "on" else 0

        exts = ["png", "jpg", "jpeg", "jfif", "webp"]

        for ext in exts:
            if os.path.exists(f"static/candidate images/{cName}.{ext}"):
                os.remove(f"static/candidate images/{cName}.{ext}")
                break

        image = request.files["img"]
        if image.filename != "":
            file_ext = image.filename.split(".")[-1]
            image.save(f"static/candidate images/{name}.{file_ext}")

        with sqlite3.connect("data.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE candidates SET name = ?, date_of_birth = ?, location = ?, email = ?, visible = ? WHERE id = ?",
                (name, dob, location, email, visible, candidate_id),
            )

            # Delete existing skills
            cursor.execute("DELETE FROM candidate_skills WHERE candidate_id = ?", (candidate_id,))

            for skill, rating in zip(skills, ratings):
                skill = skill.strip()

                cursor.execute("SELECT id FROM skills WHERE name = ?", (skill,))
                skillID = cursor.fetchone()

                if skillID is None:
                    cursor.execute("INSERT INTO skills (name) VALUES (?)", (skill,))
                    skillID = cursor.lastrowid
                else:
                    skillID = skillID[0]

                # Insert into candidate_skills table
                cursor.execute(
                    "INSERT INTO candidate_skills (candidate_id, skill_id, rating) VALUES (?, ?, ?)",
                    (candidate_id, skillID, rating),
                )

            connection.commit()

        return redirect(url_for("editlist"))

    return render_template(
        "edit_page.html",
        name=cName,
        date_of_birth=cDOB,
        location=cLocation,
        email=cEmail,
        skills=skill_data,
        candidate_id=candidate_id,
        vis=candidate[5],
    )


@app.route("/delete/<int:candidate_id>/", methods=["GET", "POST"])
def delete(candidate_id):
    if "loggedin" not in session:
        return redirect(url_for("login"))

    with sqlite3.connect("data.db") as connection:
        cursor = connection.cursor()
        name = cursor.execute("SELECT name FROM candidates WHERE id = ?", (candidate_id,)).fetchone()[0]
        cursor.execute("DELETE FROM candidates WHERE id = ?", (candidate_id,))
        cursor.execute("DELETE FROM candidate_skills WHERE candidate_id = ?", (candidate_id,))
        connection.commit()

    exts = ["png", "jpg", "jpeg", "jfif", "webp"]

    for ext in exts:
        if os.path.exists(f"static/candidate images/{name}.{ext}"):
            os.remove(f"static/candidate images/{name}.{ext}")
            break
    return redirect(url_for("editlist"))

if __name__ == "__main__":
    app.run(debug=True)

# saving this video here incase i need it
# https://www.youtube.com/watch?v=lAY7nXh83fI
