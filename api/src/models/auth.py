"""
Pydantic models for authentication requests and responses.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class BackgroundData(BaseModel):
    """User background information collected at signup."""

    software_experience: str = Field(..., pattern="^(Beginner|Intermediate|Advanced)$")
    hardware_experience: str = Field(..., pattern="^(Beginner|Intermediate|Advanced)$")
    programming_languages: List[str] = Field(default_factory=list)
    robotics_background: Optional[str] = None
    learning_goals: Optional[str] = None


class SignupRequest(BaseModel):
    """Request body for user signup."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=1)
    background: BackgroundData


class SigninRequest(BaseModel):
    """Request body for user signin."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Response model for user data."""

    id: str
    email: str
    name: str


class UpdateBackgroundRequest(BaseModel):
    """Request body for updating user background."""

    software_experience: Optional[str] = Field(
        None, pattern="^(Beginner|Intermediate|Advanced)$"
    )
    hardware_experience: Optional[str] = Field(
        None, pattern="^(Beginner|Intermediate|Advanced)$"
    )
    programming_languages: Optional[List[str]] = None
    robotics_background: Optional[str] = None
    learning_goals: Optional[str] = None


class BackgroundResponse(BaseModel):
    """Response model for user background data."""

    user_id: str
    software_experience: str
    hardware_experience: str
    programming_languages: List[str]
    robotics_background: Optional[str]
    learning_goals: Optional[str]
