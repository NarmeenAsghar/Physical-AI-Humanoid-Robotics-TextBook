"""
Authentication API endpoints: signup, signin, signout, me.
"""

from fastapi import APIRouter, HTTPException, Response, Request, status
from ..models.auth import SignupRequest, SigninRequest, UserResponse
from ..services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
)
from ..utils.db import (
    get_user_by_email,
    create_user,
    create_user_background,
    get_user_by_id,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(data: SignupRequest, response: Response):
    """
    Register a new user with email/password and background information.

    - Creates user account
    - Stores user background data
    - Returns JWT token in HTTP-only cookie
    """
    # Check if user already exists
    existing_user = get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create user
    password_hash = hash_password(data.password)
    user = create_user(data.email, data.name, password_hash)

    # Create background
    create_user_background(
        str(user["id"]),
        data.background.software_experience,
        data.background.hardware_experience,
        data.background.programming_languages,
        data.background.robotics_background,
        data.background.learning_goals,
    )

    # Create JWT token
    token = create_access_token({"user_id": str(user["id"]), "email": user["email"]})

    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 days in seconds
    )

    return {
        "user": UserResponse(
            id=str(user["id"]), email=user["email"], name=user["name"]
        ),
        "message": "Signup successful",
    }


@router.post("/signin", response_model=dict)
async def signin(data: SigninRequest, response: Response):
    """
    Authenticate user with email and password.

    - Verifies credentials
    - Returns JWT token in HTTP-only cookie
    """
    # Get user
    user = get_user_by_email(data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    # Verify password
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    # Create JWT token
    token = create_access_token({"user_id": str(user["id"]), "email": user["email"]})

    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
    )

    return {
        "user": UserResponse(
            id=str(user["id"]), email=user["email"], name=user["name"]
        ),
        "message": "Login successful",
    }


@router.post("/signout")
async def signout(response: Response):
    """
    Sign out the current user by clearing the auth cookie.
    """
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(request: Request):
    """
    Get current authenticated user's information.

    - Validates JWT token from cookie
    - Returns user data
    """
    # Get token from cookie
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    # Verify token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )

    # Get user
    user = get_user_by_id(payload.get("user_id"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return UserResponse(id=str(user["id"]), email=user["email"], name=user["name"])
