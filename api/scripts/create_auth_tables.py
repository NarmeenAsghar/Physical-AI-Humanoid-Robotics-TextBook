"""
Database migration script for authentication tables.
Creates users, user_backgrounds, and personalized_content tables.
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


def create_tables():
    """Create all authentication and personalization tables."""
    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not found in environment variables")

    print("🔌 Connecting to Neon Postgres...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    try:
        print("📊 Creating users table...")
        cur.execute(
            """
        CREATE TABLE IF NOT EXISTS users (
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
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """
        )

        print("📊 Creating user_backgrounds table...")
        cur.execute(
            """
        CREATE TABLE IF NOT EXISTS user_backgrounds (
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
        CREATE INDEX IF NOT EXISTS idx_user_backgrounds_user_id ON user_backgrounds(user_id);
        """
        )

        print("📊 Creating personalized_content table...")
        cur.execute(
            """
        CREATE TABLE IF NOT EXISTS personalized_content (
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
        CREATE INDEX IF NOT EXISTS idx_personalized_content_lookup 
        ON personalized_content(user_id, chapter_number, lesson_number);
        """
        )

        conn.commit()
        print("✅ All tables created successfully!")

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
        print(f"❌ Error creating tables: {e}")
        raise
    finally:
        cur.close()
        conn.close()
        print("🔌 Database connection closed.")


if __name__ == "__main__":
    create_tables()
