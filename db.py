import os
import psycopg2
import psycopg2.extras

def get_connection():
    return psycopg2.connect(
        host=os.getenv("PGHOST"),
        database=os.getenv("PGDATABASE"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        port=os.getenv("PGPORT")
    )

def query_one(sql, params=None):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(sql, params or [])
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row

def query_all(sql, params=None):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(sql, params or [])
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def execute(sql, params=None):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(sql, params or [])
    conn.commit()
    cur.close()
    conn.close()





