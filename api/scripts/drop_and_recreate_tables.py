"""
Drop and recreate authentication tables.
WARNING: This will delete all existing user data!
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


def drop_and_recreate_tables():
    """Drop all auth tables and recreate them with correct schema."""
    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not found in environment variables")

    print("⚠️  WARNING: This will DELETE all user data!")
    print("🔌 Connecting to Neon Postgres...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    try:
        # Drop tables in reverse order (due to foreign keys)
        print("🗑️  Dropping existing tables...")
        cur.execute("DROP TABLE IF EXISTS personalized_content CASCADE;")
        cur.execute("DROP TABLE IF EXISTS user_backgrounds CASCADE;")
        cur.execute("DROP TABLE IF EXISTS users CASCADE;")
        print("✅ Existing tables dropped")

        # Create users table
        print("📊 Creating users table...")
        cur.execute(
            """
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        )

        print("📊 Creating index on users.email...")
        cur.execute(
            """
        CREATE INDEX idx_users_email ON users(email);
        """
        )

        # Create user_backgrounds table
        print("📊 Creating user_backgrounds table...")
        cur.execute(
            """
        CREATE TABLE user_backgrounds (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          software_experience VARCHAR(50) NOT NULL CHECK (software_experience IN ('Beginner', 'Intermediate', 'Advanced')),
          hardware_experience VARCHAR(50) NOT NULL CHECK (hardware_experience IN ('Beginner', 'Intermediate', 'Advanced')),
          programming_languages TEXT[],
          robotics_background TEXT,
          learning_goals TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        );
        """
        )

        print("📊 Creating index on user_backgrounds.user_id...")
        cur.execute(
            """
        CREATE INDEX idx_user_backgrounds_user_id ON user_backgrounds(user_id);
        """
        )

        # Create personalized_content table
        print("📊 Creating personalized_content table...")
        cur.execute(
            """
        CREATE TABLE personalized_content (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          chapter_number INT NOT NULL,
          lesson_number INT NOT NULL,
          original_content_hash VARCHAR(64) NOT NULL,
          personalized_content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, chapter_number, lesson_number, original_content_hash)
        );
        """
        )

        print("📊 Creating index on personalized_content lookup...")
        cur.execute(
            """
        CREATE INDEX idx_personalized_content_lookup
        ON personalized_content(user_id, chapter_number, lesson_number);
        """
        )

        conn.commit()
        print("✅ All tables recreated successfully!")

        # Verify tables
        cur.execute(
            """
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('users', 'user_backgrounds', 'personalized_content');
        """
        )
        tables = cur.fetchall()
        print(f"\n📋 Verified tables: {[t[0] for t in tables]}")

    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        cur.close()
        conn.close()
        print("🔌 Database connection closed.")


if __name__ == "__main__":
    response = input("⚠️  This will DELETE all user data. Continue? (yes/no): ")
    if response.lower() == "yes":
        drop_and_recreate_tables()
    else:
        print("❌ Cancelled")
