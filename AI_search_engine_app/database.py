import sqlite3
import pandas as pd
from candidate import Candidate

def get_candidates_df(query: str, db_path :str):
    conn = sqlite3.connect(db_path)
    query = f"SELECT * FROM {query}"
    candidates_df = pd.read_sql_query(query, conn)        
    conn.close()
    return candidates_df

def add_top_candidates(db_path: str, candidates: list[Candidate]):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS top_candidates (
                        id INTEGER PRIMARY KEY,
                        Category TEXT,
                        resume TEXT,
                        Phone_number TEXT,
                        email TEXT,
                        first_name TEXT,
                        last_name TEXT,
                        score REAL)''')
    
    for candidate in candidates:
        cursor.execute('''INSERT INTO top_candidates (category, resume, phone_number, email, first_name, last_name, score)
                          VALUES (?, ?, ?, ?, ?, ?, ?)''', 
                       (candidate.category, candidate.resume, candidate.phone_number, candidate.email, 
                        candidate.first_name, candidate.last_name, candidate.score))
    
    conn.commit()
    conn.close()

def delete_candidates(db_path: str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM top_candidates')
    
    conn.commit()
    conn.close()
