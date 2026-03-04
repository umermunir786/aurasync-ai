import sqlite3
import os

db_path = "sql_app.db"

if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_column(table, column, type):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type}")
        print(f"Added column {column} to table {table}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"Column {column} already exists in table {table}")
        else:
            print(f"Error adding column {column} to table {table}: {e}")

# User table columns
add_column("user", "onboarded", "BOOLEAN DEFAULT 0")
add_column("user", "weight", "INTEGER")
add_column("user", "height", "INTEGER")
add_column("user", "age", "INTEGER")
add_column("user", "gender", "VARCHAR")
add_column("user", "subscription_tier", "VARCHAR DEFAULT 'free'")
add_column("user", "subscription_end_date", "DATETIME")

# NutritionLog table columns
add_column("nutritionlog", "image_url", "VARCHAR")

# ActivityLog table columns
add_column("activitylog", "image_url", "VARCHAR")
add_column("activitylog", "quantity", "FLOAT")
add_column("activitylog", "unit", "VARCHAR")

conn.commit()
conn.close()
print("Migration completed.")
