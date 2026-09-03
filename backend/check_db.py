import sqlite3
conn = sqlite3.connect('test_api.db')
c = conn.cursor()
c.execute("SELECT COUNT(*) FROM ngos")
print(c.fetchone())
