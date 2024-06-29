import sqlite3
import pandas as pd

def get_candidates(db_path :str):
    conn = sqlite3.connect(db_path)
    query = "SELECT * FROM resumes"
    candidates_df = pd.read_sql_query(query, conn)        
    conn.close()
    return candidates_df