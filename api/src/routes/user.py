"""
User profile and background API endpoints.
"""
from fastapi import APIRouter, HTTPException, Request, status
from ..models.auth import BackgroundResponse, UpdateBackgroundRequest
from ..services.auth_service import verify_token
from ..utils.db import get_user_background, update_user_background

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/background", response_model=BackgroundResponse)
async def get_background(request: Request):
    """
    Get current user's background information.
    
    - Requires authentication
    - Returns user's experience levels and learning goals
    """
    # Get token from cookie
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Verify token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Get background
    background = get_user_background(payload['user_id'])
    if not background:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Background not found"
        )
    
    return BackgroundResponse(
        user_id=str(background['user_id']),
        software_experience=background['software_experience'],
        hardware_experience=background['hardware_experience'],
        programming_languages=background['programming_languages'] or [],
        robotics_background=background.get('robotics_background'),
        learning_goals=background.get('learning_goals')
    )


@router.put("/background", response_model=BackgroundResponse)
async def update_background(request: Request, data: UpdateBackgroundRequest):
    """
    Update current user's background information.
    
    - Requires authentication
    - Partial updates supported (only provided fields are updated)
    """
    # Get token from cookie
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Verify token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Update background
    background = update_user_background(
        payload['user_id'],
        software_exp=data.software_experience,
        hardware_exp=data.hardware_experience,
        prog_langs=data.programming_languages,
        robotics_bg=data.robotics_background,
        goals=data.learning_goals
    )
    
    if not background:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Background not found"
        )
    
    return BackgroundResponse(
        user_id=str(background['user_id']),
        software_experience=background['software_experience'],
        hardware_experience=background['hardware_experience'],
        programming_languages=background['programming_languages'] or [],
        robotics_background=background.get('robotics_background'),
        learning_goals=background.get('learning_goals')
    )

