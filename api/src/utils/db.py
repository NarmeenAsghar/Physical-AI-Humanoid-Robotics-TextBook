"""
Database utility functions for authentication.
"""

import psycopg2
import psycopg2.extras
from psycopg2.extensions import AsIs, register_adapter
import os
from contextlib import contextmanager
from dotenv import load_dotenv
from typing import Optional, List

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def adapt_list(lst):
    """Adapt Python list to PostgreSQL array."""
    return AsIs(','.join(f"'{item}'" for item in lst))


# Register the adapter for lists
register_adapter(list, lambda lst: AsIs(f"ARRAY[{','.join(repr(item) for item in lst)}]"))


@contextmanager
def get_db_connection():
    """Context manager for database connections."""
    conn = psycopg2.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()


def get_user_by_email(email: str) -> Optional[dict]:
    """
    Get user by email address.

    Args:
        email: User's email address

    Returns:
        User dict if found, None otherwise
    """
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        return cur.fetchone()


def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Get user by ID.

    Args:
        user_id: User's UUID

    Returns:
        User dict if found, None otherwise
    """
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        return cur.fetchone()


def create_user(email: str, name: str, password_hash: str) -> dict:
    """
    Create a new user.

    Args:
        email: User's email
        name: User's full name
        password_hash: Hashed password

    Returns:
        Created user dict
    """
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """INSERT INTO users (email, name, password_hash) 
               VALUES (%s, %s, %s) 
               RETURNING id, email, name, created_at""",
            (email, name, password_hash),
        )
        user = cur.fetchone()
        conn.commit()
        return user


def get_user_background(user_id: str) -> Optional[dict]:
    """
    Get user background data.

    Args:
        user_id: User's UUID

    Returns:
        Background dict if found, None otherwise
    """
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM user_backgrounds WHERE user_id = %s", (user_id,))
        return cur.fetchone()


def create_user_background(
    user_id: str,
    software_exp: str,
    hardware_exp: str,
    prog_langs: List[str],
    robotics_bg: Optional[str] = None,
    goals: Optional[str] = None,
) -> dict:
    """
    Create user background data.

    Args:
        user_id: User's UUID
        software_exp: Software experience level (Beginner/Intermediate/Advanced)
        hardware_exp: Hardware experience level
        prog_langs: List of programming languages
        robotics_bg: Optional robotics background text
        goals: Optional learning goals text

    Returns:
        Created background dict
    """
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # Ensure prog_langs is a list (empty if None)
        prog_langs_array = prog_langs if prog_langs else []
        cur.execute(
            """INSERT INTO user_backgrounds
               (user_id, software_experience, hardware_experience,
                programming_languages, robotics_background, learning_goals)
               VALUES (%s, %s, %s, %s, %s, %s)
               RETURNING *""",
            (user_id, software_exp, hardware_exp, prog_langs_array, robotics_bg, goals),
        )
        background = cur.fetchone()
        conn.commit()
        return background


def update_user_background(
    user_id: str,
    software_exp: Optional[str] = None,
    hardware_exp: Optional[str] = None,
    prog_langs: Optional[List[str]] = None,
    robotics_bg: Optional[str] = None,
    goals: Optional[str] = None,
) -> dict:
    """
    Update user background data.

    Args:
        user_id: User's UUID
        software_exp: Software experience level
        hardware_exp: Hardware experience level
        prog_langs: List of programming languages
        robotics_bg: Robotics background text
        goals: Learning goals text

    Returns:
        Updated background dict
    """
    # Build dynamic UPDATE query based on provided fields
    updates = []
    params = []

    if software_exp is not None:
        updates.append("software_experience = %s")
        params.append(software_exp)
    if hardware_exp is not None:
        updates.append("hardware_experience = %s")
        params.append(hardware_exp)
    if prog_langs is not None:
        updates.append("programming_languages = %s")
        params.append(prog_langs)
    if robotics_bg is not None:
        updates.append("robotics_background = %s")
        params.append(robotics_bg)
    if goals is not None:
        updates.append("learning_goals = %s")
        params.append(goals)

    if not updates:
        # Nothing to update, just return current background
        return get_user_background(user_id)

    updates.append("updated_at = CURRENT_TIMESTAMP")
    params.append(user_id)

    query = f"""UPDATE user_backgrounds 
                SET {', '.join(updates)} 
                WHERE user_id = %s 
                RETURNING *"""

    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(query, params)
        background = cur.fetchone()
        conn.commit()
        return background
