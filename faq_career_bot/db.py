import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="hack",
            port=3306
        )

        if connection.is_connected():
            print("Connected to MySQL database successfully!")
            return connection

    except Error as e:
        print("Error while connecting to MySQL:", e)
        return None

# Example usage
if __name__ == "__main__":
    conn = create_connection()
    if conn:
        conn.close()
