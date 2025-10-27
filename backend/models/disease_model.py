from db import get_connection

def create_table():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS diseases (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            symptoms TEXT NOT NULL
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

def add_disease(name, symptoms):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO diseases (name, symptoms) VALUES (%s, %s)", (name, symptoms))
    conn.commit()
    cur.close()
    conn.close()

def get_all_diseases():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, symptoms FROM diseases ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [{"id": r[0], "name": r[1], "symptoms": r[2]} for r in rows]
