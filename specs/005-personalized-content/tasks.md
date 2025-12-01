# Implementation Tasks: Personalized Content - Phase 1

**Feature**: 005-personalized-content
**Phase**: 1 - User Background Collection  
**Status**: Ready for Implementation
**Priority**: HIGH (Bonus Points)

---

## Task Breakdown

### SPRINT 1: Database & MCP Setup (2-3 hours)

#### Task 1.1: Setup Neon Postgres Database
**Priority**: P0 (Blocker)
**Estimate**: 30 minutes
**Dependencies**: None

**Steps**:
1. Go to https://neon.tech/ and create account
2. Create new project: `physical-ai-textbook-auth`
3. Copy connection string (format: `postgresql://user:pass@host/db?sslmode=require`)
4. Add to `api/.env`:
   ```
   DATABASE_URL=postgresql://...
   ```
5. Test connection:
   ```bash
   cd api
   uv run python -c "import psycopg2; conn = psycopg2.connect('YOUR_DATABASE_URL'); print('✅ Connected!')"
   ```

**Acceptance**:
- [ ] Neon project created
- [ ] DATABASE_URL in `.env`
- [ ] Connection test passes

---

#### Task 1.2: Install BetterAuth MCP Package
**Priority**: P0
**Estimate**: 15 minutes
**Dependencies**: None

**Steps**:
1. Update `.cursorrules` or MCP settings with:
   ```json
   {
     "mcpPackages": {
       "Better Auth": {
         "url": "https://mcp.chonkie.ai/better-auth/better-auth-builder/mcp"
       }
     }
   }
   ```
2. Restart Cursor/Claude
3. Verify MCP available: Ask "What auth patterns does BetterAuth recommend for FastAPI?"

**Acceptance**:
- [ ] MCP package configured
- [ ] Can query BetterAuth MCP for guidance

---

#### Task 1.3: Create Database Schema with BetterAuth MCP
**Priority**: P0
**Estimate**: 45 minutes
**Dependencies**: Task 1.1, 1.2

**Steps**:
1. Ask BetterAuth MCP: "Generate Postgres schema for FastAPI auth with email/password + user backgrounds table"
2. Create `api/scripts/create_auth_tables.py`:
   ```python
   import psycopg2
   import os
   from dotenv import load_dotenv
   
   load_dotenv()
   
   conn = psycopg2.connect(os.getenv('DATABASE_URL'))
   cur = conn.cursor()
   
   # Create users table
   cur.execute("""
   CREATE TABLE IF NOT EXISTS users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     name VARCHAR(255) NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
   """)
   
   # Create user_backgrounds table
   cur.execute("""
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
   CREATE INDEX IF NOT EXISTS idx_user_backgrounds_user_id ON user_backgrounds(user_id);
   """)
   
   # Create personalized_content table (for Phase 2)
   cur.execute("""
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
   CREATE INDEX IF NOT EXISTS idx_personalized_content_lookup ON personalized_content(user_id, chapter_number, lesson_number);
   """)
   
   conn.commit()
   cur.close()
   conn.close()
   print("✅ Tables created successfully!")
   ```
3. Run migration:
   ```bash
   cd api
   uv run python scripts/create_auth_tables.py
   ```

**Acceptance**:
- [ ] Migration script created
- [ ] All tables exist in Neon Postgres
- [ ] Indexes created

---

### SPRINT 2: Backend Authentication (3-4 hours)

#### Task 2.1: Install Auth Dependencies
**Priority**: P0
**Estimate**: 10 minutes
**Dependencies**: None

**Steps**:
1. Add to `api/pyproject.toml`:
   ```toml
   dependencies = [
     # ... existing ...
     "psycopg2-binary>=2.9.9",
     "passlib[bcrypt]>=1.7.4",
     "python-jose[cryptography]>=3.3.0",
     "python-multipart>=0.0.6",
   ]
   ```
2. Install:
   ```bash
   cd api
   uv sync
   ```

**Acceptance**:
- [ ] Dependencies installed
- [ ] No version conflicts

---

#### Task 2.2: Create Auth Service with BetterAuth MCP
**Priority**: P0
**Estimate**: 1 hour
**Dependencies**: Task 2.1

**Steps**:
1. Ask BetterAuth MCP: "Generate FastAPI auth service with bcrypt password hashing and JWT tokens"
2. Create `api/src/services/auth_service.py`:
   ```python
   from passlib.context import CryptContext
   from jose import JWTError, jwt
   from datetime import datetime, timedelta
   import os
   
   pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
   SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
   ALGORITHM = "HS256"
   ACCESS_TOKEN_EXPIRE_DAYS = 7
   
   def hash_password(password: str) -> str:
       return pwd_context.hash(password)
   
   def verify_password(plain_password: str, hashed_password: str) -> bool:
       return pwd_context.verify(plain_password, hashed_password)
   
   def create_access_token(data: dict) -> str:
       to_encode = data.copy()
       expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
       to_encode.update({"exp": expire})
       encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
       return encoded_jwt
   
   def verify_token(token: str) -> dict:
       try:
           payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
           return payload
       except JWTError:
           return None
   ```
3. Add `JWT_SECRET_KEY` to `api/.env`:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   # Copy output to .env
   JWT_SECRET_KEY=<generated_key>
   ```

**Acceptance**:
- [ ] Auth service created
- [ ] Password hashing works
- [ ] JWT creation/verification works

---

#### Task 2.3: Create Database Helper for Auth
**Priority**: P0
**Estimate**: 30 minutes
**Dependencies**: Task 1.3, 2.2

**Steps**:
1. Create `api/src/utils/db.py`:
   ```python
   import psycopg2
   import psycopg2.extras
   import os
   from contextlib import contextmanager
   from dotenv import load_dotenv
   
   load_dotenv()
   DATABASE_URL = os.getenv('DATABASE_URL')
   
   @contextmanager
   def get_db_connection():
       conn = psycopg2.connect(DATABASE_URL)
       try:
           yield conn
       finally:
           conn.close()
   
   def get_user_by_email(email: str):
       with get_db_connection() as conn:
           cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
           cur.execute("SELECT * FROM users WHERE email = %s", (email,))
           return cur.fetchone()
   
   def create_user(email: str, name: str, password_hash: str):
       with get_db_connection() as conn:
           cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
           cur.execute(
               "INSERT INTO users (email, name, password_hash) VALUES (%s, %s, %s) RETURNING id, email, name, created_at",
               (email, name, password_hash)
           )
           user = cur.fetchone()
           conn.commit()
           return user
   
   def get_user_background(user_id: str):
       with get_db_connection() as conn:
           cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
           cur.execute("SELECT * FROM user_backgrounds WHERE user_id = %s", (user_id,))
           return cur.fetchone()
   
   def create_user_background(user_id: str, software_exp: str, hardware_exp: str, 
                              prog_langs: list, robotics_bg: str = None, goals: str = None):
       with get_db_connection() as conn:
           cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
           cur.execute(
               """INSERT INTO user_backgrounds 
                  (user_id, software_experience, hardware_experience, programming_languages, robotics_background, learning_goals)
                  VALUES (%s, %s, %s, %s, %s, %s) RETURNING *""",
               (user_id, software_exp, hardware_exp, prog_langs, robotics_bg, goals)
           )
           background = cur.fetchone()
           conn.commit()
           return background
   ```

**Acceptance**:
- [ ] DB helper functions work
- [ ] Can create and fetch users
- [ ] Can create and fetch backgrounds

---

#### Task 2.4: Create Auth API Endpoints
**Priority**: P0
**Estimate**: 1.5 hours
**Dependencies**: Task 2.2, 2.3

**Steps**:
1. Create `api/src/models/auth.py`:
   ```python
   from pydantic import BaseModel, EmailStr
   from typing import Optional, List
   
   class BackgroundData(BaseModel):
       software_experience: str  # Beginner/Intermediate/Advanced
       hardware_experience: str
       programming_languages: List[str]
       robotics_background: Optional[str] = None
       learning_goals: Optional[str] = None
   
   class SignupRequest(BaseModel):
       email: EmailStr
       password: str
       name: str
       background: BackgroundData
   
   class SigninRequest(BaseModel):
       email: EmailStr
       password: str
   
   class UserResponse(BaseModel):
       id: str
       email: str
       name: str
   ```

2. Create `api/src/routes/auth.py`:
   ```python
   from fastapi import APIRouter, HTTPException, Response
   from fastapi.responses import JSONResponse
   from ..models.auth import SignupRequest, SigninRequest, UserResponse
   from ..services.auth_service import hash_password, verify_password, create_access_token, verify_token
   from ..utils.db import get_user_by_email, create_user, create_user_background
   
   router = APIRouter(prefix="/auth", tags=["Authentication"])
   
   @router.post("/signup")
   async def signup(data: SignupRequest, response: Response):
       # Check if user exists
       existing_user = get_user_by_email(data.email)
       if existing_user:
           raise HTTPException(status_code=400, detail="Email already registered")
       
       # Create user
       password_hash = hash_password(data.password)
       user = create_user(data.email, data.name, password_hash)
       
       # Create background
       create_user_background(
           str(user['id']),
           data.background.software_experience,
           data.background.hardware_experience,
           data.background.programming_languages,
           data.background.robotics_background,
           data.background.learning_goals
       )
       
       # Create JWT
       token = create_access_token({"user_id": str(user['id']), "email": user['email']})
       
       # Set cookie
       response.set_cookie(
           key="access_token",
           value=token,
           httponly=True,
           secure=False,  # Set to True in production (HTTPS)
           samesite="lax",
           max_age=7*24*60*60  # 7 days
       )
       
       return {
           "user": UserResponse(id=str(user['id']), email=user['email'], name=user['name']),
           "message": "Signup successful"
       }
   
   @router.post("/signin")
   async def signin(data: SigninRequest, response: Response):
       # Get user
       user = get_user_by_email(data.email)
       if not user:
           raise HTTPException(status_code=401, detail="Invalid credentials")
       
       # Verify password
       if not verify_password(data.password, user['password_hash']):
           raise HTTPException(status_code=401, detail="Invalid credentials")
       
       # Create JWT
       token = create_access_token({"user_id": str(user['id']), "email": user['email']})
       
       # Set cookie
       response.set_cookie(
           key="access_token",
           value=token,
           httponly=True,
           secure=False,
           samesite="lax",
           max_age=7*24*60*60
       )
       
       return {
           "user": UserResponse(id=str(user['id']), email=user['email'], name=user['name']),
           "message": "Login successful"
       }
   
   @router.post("/signout")
   async def signout(response: Response):
       response.delete_cookie("access_token")
       return {"message": "Logged out"}
   
   @router.get("/me")
   async def get_current_user(request: Request):
       token = request.cookies.get("access_token")
       if not token:
           raise HTTPException(status_code=401, detail="Not authenticated")
       
       payload = verify_token(token)
       if not payload:
           raise HTTPException(status_code=401, detail="Invalid token")
       
       user = get_user_by_email(payload['email'])
       if not user:
           raise HTTPException(status_code=404, detail="User not found")
       
       return UserResponse(id=str(user['id']), email=user['email'], name=user['name'])
   ```

3. Register router in `api/src/main.py`:
   ```python
   from .routes import auth
   app.include_router(auth.router, prefix="/api")
   ```

**Acceptance**:
- [ ] All 4 endpoints work
- [ ] Signup creates user + background
- [ ] Signin returns JWT cookie
- [ ] `/me` returns user data with valid token
- [ ] Signout clears cookie

---

#### Task 2.5: Create User Background Endpoints
**Priority**: P1
**Estimate**: 30 minutes
**Dependencies**: Task 2.4

**Steps**:
1. Create `api/src/routes/user.py`:
   ```python
   from fastapi import APIRouter, HTTPException, Request
   from ..models.auth import BackgroundData
   from ..services.auth_service import verify_token
   from ..utils.db import get_user_background
   
   router = APIRouter(prefix="/user", tags=["User"])
   
   @router.get("/background")
   async def get_background(request: Request):
       token = request.cookies.get("access_token")
       if not token:
           raise HTTPException(status_code=401, detail="Not authenticated")
       
       payload = verify_token(token)
       if not payload:
           raise HTTPException(status_code=401, detail="Invalid token")
       
       background = get_user_background(payload['user_id'])
       if not background:
           raise HTTPException(status_code=404, detail="Background not found")
       
       return background
   ```

2. Register in `api/src/main.py`:
   ```python
   from .routes import user
   app.include_router(user.router, prefix="/api")
   ```

**Acceptance**:
- [ ] `/api/user/background` returns user background
- [ ] Requires authentication

---

### SPRINT 3: Frontend Auth (3-4 hours)

#### Task 3.1: Create Auth Context
**Priority**: P0
**Estimate**: 1 hour
**Dependencies**: Task 2.4

**Steps**:
1. Create `docs/src/contexts/AuthContext.tsx`:
   ```typescript
   import React, { createContext, useContext, useState, useEffect } from 'react';
   
   interface User {
     id: string;
     email: string;
     name: string;
   }
   
   interface AuthContextType {
     user: User | null;
     loading: boolean;
     signin: (email: string, password: string) => Promise<void>;
     signup: (data: SignupData) => Promise<void>;
     signout: () => Promise<void>;
     checkAuth: () => Promise<void>;
   }
   
   interface SignupData {
     email: string;
     password: string;
     name: string;
     background: {
       software_experience: string;
       hardware_experience: string;
       programming_languages: string[];
       robotics_background?: string;
       learning_goals?: string;
     };
   }
   
   const AuthContext = createContext<AuthContextType | undefined>(undefined);
   
   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     
     const API_BASE = 'http://localhost:3001/api';  // Update for production
     
     const checkAuth = async () => {
       try {
         const res = await fetch(`${API_BASE}/auth/me`, {
           credentials: 'include',
         });
         if (res.ok) {
           const data = await res.json();
           setUser(data);
         } else {
           setUser(null);
         }
       } catch (error) {
         setUser(null);
       } finally {
         setLoading(false);
       }
     };
     
     const signup = async (data: SignupData) => {
       const res = await fetch(`${API_BASE}/auth/signup`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
         body: JSON.stringify(data),
       });
       if (!res.ok) {
         const error = await res.json();
         throw new Error(error.detail || 'Signup failed');
       }
       const result = await res.json();
       setUser(result.user);
     };
     
     const signin = async (email: string, password: string) => {
       const res = await fetch(`${API_BASE}/auth/signin`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
         body: JSON.stringify({ email, password }),
       });
       if (!res.ok) {
         const error = await res.json();
         throw new Error(error.detail || 'Login failed');
       }
       const result = await res.json();
       setUser(result.user);
     };
     
     const signout = async () => {
       await fetch(`${API_BASE}/auth/signout`, {
         method: 'POST',
         credentials: 'include',
       });
       setUser(null);
     };
     
     useEffect(() => {
       checkAuth();
     }, []);
     
     return (
       <AuthContext.Provider value={{ user, loading, signin, signup, signout, checkAuth }}>
         {children}
       </AuthContext.Provider>
     );
   }
   
   export function useAuth() {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error('useAuth must be used within AuthProvider');
     }
     return context;
   }
   ```

2. Wrap in `docs/src/theme/Root/index.tsx`:
   ```typescript
   import { AuthProvider } from '@site/src/contexts/AuthContext';
   
   export default function Root({ children }) {
     return (
       <AuthProvider>
         {children}
       </AuthProvider>
     );
   }
   ```

**Acceptance**:
- [ ] Auth context available
- [ ] `useAuth()` hook works
- [ ] Checks auth on mount

---

#### Task 3.2: Create Signup Page
**Priority**: P0
**Estimate**: 1.5 hours
**Dependencies**: Task 3.1

**Steps**:
1. Create `docs/src/pages/signup.tsx`:
   ```typescript
   import React, { useState } from 'react';
   import { useAuth } from '@site/src/contexts/AuthContext';
   import { useHistory } from '@docusaurus/router';
   import Layout from '@theme/Layout';
   
   export default function SignupPage() {
     const { signup } = useAuth();
     const history = useHistory();
     const [formData, setFormData] = useState({
       email: '',
       password: '',
       name: '',
       software_experience: 'Beginner',
       hardware_experience: 'Beginner',
       programming_languages: [],
       robotics_background: '',
       learning_goals: '',
     });
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     
     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setError('');
       setLoading(true);
       
       try {
         await signup({
           email: formData.email,
           password: formData.password,
           name: formData.name,
           background: {
             software_experience: formData.software_experience,
             hardware_experience: formData.hardware_experience,
             programming_languages: formData.programming_languages,
             robotics_background: formData.robotics_background,
             learning_goals: formData.learning_goals,
           },
         });
         history.push('/');
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <Layout title="Sign Up">
         <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
           <h1>Create Your Account</h1>
           <form onSubmit={handleSubmit}>
             {/* Email, Name, Password inputs */}
             <input
               type="email"
               placeholder="Email"
               value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               required
             />
             <input
               type="text"
               placeholder="Full Name"
               value={formData.name}
               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               required
             />
             <input
               type="password"
               placeholder="Password"
               value={formData.password}
               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
               required
             />
             
             {/* Background Questions */}
             <label>Software Experience:</label>
             <select
               value={formData.software_experience}
               onChange={(e) => setFormData({ ...formData, software_experience: e.target.value })}
             >
               <option value="Beginner">Beginner</option>
               <option value="Intermediate">Intermediate</option>
               <option value="Advanced">Advanced</option>
             </select>
             
             <label>Hardware Experience:</label>
             <select
               value={formData.hardware_experience}
               onChange={(e) => setFormData({ ...formData, hardware_experience: e.target.value })}
             >
               <option value="Beginner">Beginner</option>
               <option value="Intermediate">Intermediate</option>
               <option value="Advanced">Advanced</option>
             </select>
             
             <textarea
               placeholder="Learning Goals (optional)"
               value={formData.learning_goals}
               onChange={(e) => setFormData({ ...formData, learning_goals: e.target.value })}
             />
             
             {error && <div style={{ color: 'red' }}>{error}</div>}
             <button type="submit" disabled={loading}>
               {loading ? 'Creating Account...' : 'Sign Up'}
             </button>
           </form>
         </div>
       </Layout>
     );
   }
   ```

**Acceptance**:
- [ ] Signup form renders
- [ ] Validates inputs
- [ ] Creates account and redirects

---

#### Task 3.3: Create Signin Page
**Priority**: P0
**Estimate**: 45 minutes
**Dependencies**: Task 3.1

**Steps**:
1. Create `docs/src/pages/signin.tsx` (similar to signup, simpler form)

**Acceptance**:
- [ ] Signin form works
- [ ] Redirects after login

---

#### Task 3.4: Add Auth Links to Navbar
**Priority**: P1
**Estimate**: 30 minutes
**Dependencies**: Task 3.1, 3.2, 3.3

**Steps**:
1. Update `docs/docusaurus.config.ts` navbar items to show "Sign Up" / "Sign In" when logged out, "Profile" / "Sign Out" when logged in

**Acceptance**:
- [ ] Navbar shows correct auth state
- [ ] Links work

---

### SPRINT 4: Testing & Deployment (2 hours)

#### Task 4.1: Test Complete Auth Flow
**Priority**: P0
**Estimate**: 1 hour
**Dependencies**: All previous

**Steps**:
1. Test signup flow end-to-end
2. Test signin with correct/wrong credentials
3. Test session persistence across refresh
4. Test signout
5. Test background data retrieval

**Acceptance**:
- [ ] All flows work without errors
- [ ] Session persists
- [ ] Background stored correctly

---

#### Task 4.2: Update Hugging Face Deployment
**Priority**: P0
**Estimate**: 30 minutes
**Dependencies**: Task 4.1

**Steps**:
1. Add `DATABASE_URL` and `JWT_SECRET_KEY` to HF Spaces secrets
2. Push updated code to HF
3. Test auth on deployed API

**Acceptance**:
- [ ] Auth works on HF deployment
- [ ] No CORS errors

---

#### Task 4.3: Update Frontend Deployment
**Priority**: P0
**Estimate**: 30 minutes
**Dependencies**: Task 4.2

**Steps**:
1. Update `API_BASE` in AuthContext to HF URL for production
2. Commit and push to master
3. Wait for GitHub Pages deployment
4. Test on live site

**Acceptance**:
- [ ] Live site has working auth
- [ ] Cookies work across domains

---

## Time Estimate

**Total**: 10-13 hours (can be done in 1-2 days with focused work)

**Breakdown**:
- Sprint 1 (Database): 2-3 hours
- Sprint 2 (Backend): 3-4 hours
- Sprint 3 (Frontend): 3-4 hours
- Sprint 4 (Testing): 2 hours

---

## Success Criteria

✅ **Phase 1 Complete When**:
- [ ] User can signup with email/password + background
- [ ] User can signin and session persists
- [ ] Background data stored in Postgres
- [ ] Auth works on both local and deployed
- [ ] All security measures in place (bcrypt, HTTP-only cookies)
- [ ] **+50 bonus points earned!**

---

## Next Phase

After Phase 1, implement **Phase 2: Content Personalization Service**:
- Personalization LLM service
- "Personalize" button on chapters
- Cache personalized content
- **+50 bonus points**

**Total Bonus**: 100 points! 🎉

