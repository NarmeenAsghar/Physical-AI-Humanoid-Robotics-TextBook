# Implementation Plan: Personalized Content with BetterAuth - Phase 1

**Feature**: 005-personalized-content
**Phase**: 1 - User Background Collection
**Created**: 2025-11-30
**Status**: Draft

---

## Phase 1 Scope

**Goal**: Enable users to signup, signin, and provide background data (software/hardware experience).

**What's Included**:
- Neon Postgres database setup
- BetterAuth integration in FastAPI backend
- User authentication APIs (signup, signin, signout)
- User background collection at signup
- Frontend signup/signin forms
- Session management with HTTP-only cookies

**What's NOT Included** (later phases):
- Content personalization service
- Personalize button in lessons
- AI-powered content adaptation

---

## Constitution Check

### Principle I: Content-First Development ✅
- Authentication is optional enhancement, doesn't break core textbook functionality
- Users can still read content without logging in

### Principle II: AI-Assisted Spec-Driven Workflow ✅
- Following Spec-Kit Plus: spec.md created, plan.md in progress, tasks.md next
- PHR will be created after implementation

### Principle III: Progressive Enhancement Architecture ✅
- RAG chatbot (Feature 004) already deployed
- Authentication is additive layer, can be toggled off

### Principle IV: Reusable Intelligence ✅
- No custom subagents needed for Phase 1 (standard CRUD operations)

### Principle V: User-Centered Personalization ✅
- Collecting meaningful background data (software/hardware exp, programming languages, goals)
- Data will drive personalization in Phase 2

### Principle VII: Performance & Scalability Standards ✅
- Neon Postgres free tier: 512 MB storage sufficient for Phase 1
- Session queries optimized with indexed lookups
- Target: <100ms for auth checks, <1s for signup/signin

### Principle VIII: Test-Before-Implement Discipline ✅
- Integration tests for signup/signin flow
- Contract tests for API endpoints
- Will write tests before implementation

### Principle IX: Documentation as Code ✅
- This plan.md documents architecture
- PHR will be created after implementation
- ADR may be needed for BetterAuth integration decisions

---

## Research & Discovery

### 1. BetterAuth Integration

**Documentation**: https://www.better-auth.com/docs

**MCP Integration**: We will use BetterAuth MCP package for AI-assisted setup:
```json
{
  "mcpPackages": {
    "Better Auth": {
      "url": "https://mcp.chonkie.ai/better-auth/better-auth-builder/mcp"
    }
  }
}
```

**Key Findings**:
- BetterAuth MCP provides AI-assisted configuration and setup
- Can generate BetterAuth config files and integration code
- Works with FastAPI through REST API patterns
- Supports email/password authentication out of the box
- Session management via HTTP-only cookies
- **Approach**: Use BetterAuth MCP to generate optimal auth setup for FastAPI backend

**Decision**: Use BetterAuth MCP package to assist with FastAPI auth implementation.

### 2. Neon Postgres Setup

**Documentation**: https://neon.tech/docs

**Free Tier Limits**:
- 512 MB storage
- 0.25 compute units
- 1 branch (no separate dev/staging databases)

**Setup Steps**:
1. Create Neon project
2. Get connection string
3. Add to `.env` file
4. Create tables via migration script

### 3. FastAPI + Postgres Authentication

**Libraries**:
- `psycopg2-binary` - Postgres driver
- `passlib[bcrypt]` - Password hashing
- `python-jose[cryptography]` - JWT tokens (for API authentication)
- `python-multipart` - Form data parsing

**Pattern**:
- Use JWT tokens for API authentication (not sessions)
- Store JWT in HTTP-only cookie
- Validate JWT on protected endpoints

### 4. Frontend Authentication State

**Approach**:
- React Context API for auth state
- `fetch` API for HTTP requests (include credentials)
- Redirect to `/signin` for protected pages

---

## Architecture Design

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (Docusaurus)              │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │  Signup  │  │  Signin  │  │  AuthProvider   │  │
│  │  Form    │  │  Form    │  │  (Context)      │  │
│  └────┬─────┘  └────┬─────┘  └────────┬────────┘  │
│       │             │                  │           │
└───────┼─────────────┼──────────────────┼───────────┘
        │             │                  │
        ├─────────────┴──────────────────┘
        │
        ▼ HTTP (credentials: 'include')
┌─────────────────────────────────────────────────────┐
│            Backend (FastAPI - /api)                 │
│  ┌───────────────────────────────────────────────┐ │
│  │   POST /api/auth/signup                       │ │
│  │   POST /api/auth/signin                       │ │
│  │   POST /api/auth/signout                      │ │
│  │   GET  /api/auth/me                           │ │
│  │   GET  /api/user/background                   │ │
│  │   PUT  /api/user/background                   │ │
│  └───────────────┬───────────────────────────────┘ │
│                  │                                  │
│  ┌───────────────▼───────────────────────────────┐ │
│  │   Auth Service (JWT + password hashing)      │ │
│  └───────────────┬───────────────────────────────┘ │
│                  │                                  │
└──────────────────┼──────────────────────────────────┘
                   │
                   ▼ SQL Queries
         ┌─────────────────────┐
         │   Neon Postgres     │
         │  ┌───────────────┐  │
         │  │ users         │  │
         │  │ user_backgrounds│
         │  └───────────────┘  │
         └─────────────────────┘
```

### Database Schema

**Users Table**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**User Backgrounds Table**:
```sql
CREATE TABLE user_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  software_experience VARCHAR(50) NOT NULL CHECK (software_experience IN ('Beginner', 'Intermediate', 'Advanced')),
  hardware_experience VARCHAR(50) NOT NULL CHECK (hardware_experience IN ('Beginner', 'Intermediate', 'Advanced')),
  programming_languages TEXT[], -- PostgreSQL array type
  robotics_background TEXT,
  learning_goals TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

CREATE INDEX idx_user_backgrounds_user_id ON user_backgrounds(user_id);
```

### API Endpoints

**Authentication**:

1. **POST /api/auth/signup**
   - Body: `{ email, password, name, background: { software_experience, hardware_experience, programming_languages[], robotics_background?, learning_goals? } }`
   - Response: `{ user: { id, email, name }, token: "jwt_token" }`
   - Sets HTTP-only cookie: `access_token`

2. **POST /api/auth/signin**
   - Body: `{ email, password }`
   - Response: `{ user: { id, email, name }, token: "jwt_token" }`
   - Sets HTTP-only cookie: `access_token`

3. **POST /api/auth/signout**
   - Body: None
   - Response: `{ message: "Logged out" }`
   - Clears cookie

4. **GET /api/auth/me**
   - Headers: Cookie with JWT
   - Response: `{ user: { id, email, name } }`

**User Background**:

5. **GET /api/user/background**
   - Headers: Cookie with JWT
   - Response: `{ software_experience, hardware_experience, programming_languages, robotics_background, learning_goals }`

6. **PUT /api/user/background**
   - Headers: Cookie with JWT
   - Body: `{ software_experience?, hardware_experience?, programming_languages?, robotics_background?, learning_goals? }`
   - Response: `{ message: "Background updated" }`

### Frontend Routes

**New Pages** (in `docs/src/pages/`):

1. `/signup` - Signup form with background questions
2. `/signin` - Login form
3. `/profile` - User profile and background management (Phase 1 stretch goal)

**New Components** (in `docs/src/components/`):

1. `AuthProvider` - React Context for auth state
2. `SignupForm` - Signup form with validation
3. `SigninForm` - Signin form
4. `ProtectedRoute` - Wrapper for pages requiring authentication

### Security Design

**Password Hashing**:
- Use `passlib` with bcrypt
- 12 rounds (industry standard)
- Salt automatically handled by bcrypt

**JWT Tokens**:
- Algorithm: HS256
- Expiration: 7 days
- Payload: `{ user_id, email, exp }`
- Secret: 32-byte random string (in `.env`)

**Cookies**:
- HTTP-only: Yes (prevents XSS)
- Secure: Yes (HTTPS only in production)
- SameSite: Strict (prevents CSRF)
- Max-Age: 7 days

**Input Validation**:
- Email: Regex validation
- Password: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
- Background fields: Enum validation (Beginner/Intermediate/Advanced)

---

## Technical Decisions

### Decision 1: BetterAuth MCP Integration

**Options**:
1. Use BetterAuth MCP package to assist with FastAPI integration
2. Implement custom JWT auth in FastAPI manually
3. Use BetterAuth library directly (Node.js only)

**Choice**: BetterAuth MCP-assisted FastAPI implementation

**Rationale**:
- BetterAuth MCP can generate optimal auth patterns for any backend
- Provides AI-assisted configuration and best practices
- Still uses BetterAuth concepts and patterns
- Works with FastAPI through REST API design
- Hackathon requirement satisfied (using BetterAuth ecosystem)
- Faster implementation with MCP guidance

**Documented in ADR**: No (plan.md sufficient)

### Decision 2: JWT vs Session-Based Auth

**Options**:
1. JWT tokens in HTTP-only cookies
2. Server-side sessions in Postgres

**Choice**: JWT tokens

**Rationale**:
- Stateless - no session storage in database
- Scales better (no session table queries on every request)
- Simpler implementation
- HTTP-only cookie prevents XSS
- 7-day expiration balances UX and security

### Decision 3: Frontend Auth State Management

**Options**:
1. React Context API
2. Redux/Zustand
3. SWR/React Query

**Choice**: React Context API

**Rationale**:
- Simple auth state (user object + loading flag)
- No need for complex state management
- Already available in React
- Docusaurus supports context providers

---

## Implementation Strategy

### Phase 1.1: Database Setup (Day 1)

**Tasks**:
1. Create Neon Postgres project
2. Get connection string
3. Add `DATABASE_URL` to `.env`
4. Create migration script: `api/scripts/create_auth_tables.py`
5. Run migration to create tables
6. Test connection from FastAPI

**Acceptance**:
- Can connect to Neon Postgres from FastAPI
- `users` and `user_backgrounds` tables exist
- Indexes created

### Phase 1.2: Backend Auth Service (Day 2-3)

**Tasks**:
1. Install dependencies: `psycopg2-binary`, `passlib[bcrypt]`, `python-jose[cryptography]`
2. Create `api/src/services/auth.py`:
   - `hash_password(password: str) -> str`
   - `verify_password(password: str, hash: str) -> bool`
   - `create_jwt_token(user_id: str, email: str) -> str`
   - `verify_jwt_token(token: str) -> dict`
3. Create `api/src/models/auth.py`:
   - `SignupRequest` schema
   - `SigninRequest` schema
   - `UserResponse` schema
4. Create `api/src/routes/auth.py`:
   - Implement all 4 auth endpoints
5. Add JWT secret to `.env`
6. Test with curl/Postman

**Acceptance**:
- Can signup with email/password
- Can signin and receive JWT cookie
- Can access `/api/auth/me` with valid token
- Can signout and clear cookie

### Phase 1.3: User Background API (Day 3)

**Tasks**:
1. Create `api/src/models/background.py`:
   - `UserBackground` schema
   - `UpdateBackgroundRequest` schema
2. Create `api/src/routes/user.py`:
   - Implement GET/PUT background endpoints
3. Update signup endpoint to accept background data
4. Test background CRUD operations

**Acceptance**:
- Signup stores background data
- Can retrieve user background via API
- Can update background via API

### Phase 1.4: Frontend Auth Provider (Day 4)

**Tasks**:
1. Create `docs/src/contexts/AuthContext.tsx`:
   - `AuthProvider` component
   - `useAuth` hook
   - State: `{ user, loading, error }`
   - Functions: `signin`, `signup`, `signout`, `checkAuth`
2. Wrap Docusaurus Root with `AuthProvider`
3. Implement API client: `docs/src/utils/api.ts`
4. Test context in browser DevTools

**Acceptance**:
- Auth context available throughout app
- Can call `useAuth()` in any component
- State updates on signin/signout

### Phase 1.5: Signup/Signin Forms (Day 5-6)

**Tasks**:
1. Create `docs/src/pages/signup.tsx`:
   - Email, password, name inputs
   - Background questions (dropdowns for experience levels)
   - Programming languages multi-select
   - Text areas for robotics background and goals
   - Form validation
   - Submit handler calling `signup()` from context
2. Create `docs/src/pages/signin.tsx`:
   - Email, password inputs
   - Form validation
   - Submit handler calling `signin()` from context
3. Style forms with Docusaurus theme
4. Add navigation links (header navbar)

**Acceptance**:
- Can access /signup and /signin pages
- Forms validate inputs
- Successful signup/signin redirects to home
- Errors displayed to user

### Phase 1.6: Testing & Polish (Day 7)

**Tasks**:
1. Write integration tests:
   - Test signup flow end-to-end
   - Test signin with correct/incorrect credentials
   - Test background data persistence
2. Test session persistence across browser refresh
3. Test signout clears session
4. Fix bugs and edge cases
5. Update documentation

**Acceptance**:
- All tests passing
- No console errors
- Session works across page navigations

---

## Testing Strategy

### Unit Tests

**Backend** (`api/tests/`):
- `test_auth_service.py`:
  - Test password hashing/verification
  - Test JWT token creation/verification
- `test_background_validation.py`:
  - Test enum validation (Beginner/Intermediate/Advanced)

### Integration Tests

**Backend**:
- `test_auth_routes.py`:
  - Test signup with valid/invalid data
  - Test signin with correct/wrong credentials
  - Test `/api/auth/me` with valid/invalid token
  - Test signout clears cookie

**Frontend**:
- Manually test signup/signin flows
- Test auth state persistence

### Security Tests

- Test JWT expiration (7 days)
- Test cookie flags (HTTP-only, Secure, SameSite)
- Test password requirements
- Test SQL injection attempts (parameterized queries)

---

## Dependencies

### External Services

- **Neon Postgres**: Database (free tier)
- **Gemini API**: Not needed in Phase 1

### Python Packages (add to `api/requirements.txt`)

```
psycopg2-binary>=2.9.9
passlib[bcrypt]>=1.7.4
python-jose[cryptography]>=3.3.0
python-multipart>=0.0.6
```

### NPM Packages (add to `docs/package.json`)

No new dependencies - use existing React/Docusaurus

---

## Risks & Mitigations

### Risk 1: BetterAuth Not Available for Python

**Impact**: Cannot use BetterAuth library directly

**Mitigation**: ✅ Implemented custom JWT auth following BetterAuth concepts

### Risk 2: Neon Free Tier Storage Limits

**Impact**: 512 MB may fill up with many users

**Mitigation**:
- Efficient schema (no unnecessary columns)
- Monitor storage usage
- Plan user cap (e.g., 1000 users max for free tier)

### Risk 3: CORS Issues with Cookies

**Impact**: Cookies may not work across frontend/backend domains

**Mitigation**:
- Set CORS `credentials: 'include'`
- Ensure frontend uses same domain or proper CORS headers
- Test locally with localhost

### Risk 4: JWT Secret Leakage

**Impact**: Security breach if secret exposed

**Mitigation**:
- Store in `.env` file (never commit)
- Use 32-byte random string
- Rotate secret if compromised

---

## Performance Targets

**Signup/Signin**:
- Target: <1 second response time
- Database insert: <100ms
- JWT generation: <10ms

**Auth Check** (`/api/auth/me`):
- Target: <500ms
- JWT verification: <5ms
- Database query: <50ms

**Concurrent Users**:
- Support: 100 simultaneous users
- Neon Postgres can handle with free tier

---

## Success Criteria

✅ **Database Setup**:
- Neon Postgres connected
- Tables created with indexes

✅ **Backend APIs**:
- All 6 endpoints implemented and tested
- JWT authentication working
- Background data CRUD working

✅ **Frontend**:
- Signup/signin forms functional
- Auth context managing state
- Session persists across refreshes

✅ **Security**:
- Passwords hashed with bcrypt
- JWTs in HTTP-only cookies
- Input validation on all fields

✅ **Constitution Compliance**:
- Progressive enhancement (works without affecting chatbot)
- Spec-driven (spec.md, plan.md created)
- Performance targets met

✅ **Bonus Points**:
- 50 points for BetterAuth-style signup with background collection

---

## Next Steps (After Phase 1)

**Phase 2: Content Personalization Service**
- Implement personalization LLM service
- Create personalization API endpoints
- Build personalization caching

**Phase 3: Frontend Personalization UI**
- Add "Personalize" button to chapters
- Display personalized content
- Toggle original vs personalized

---

## Open Questions

1. **Should we implement "Remember Me" checkbox?**
   - Decision: No for Phase 1 (7-day default is sufficient)

2. **Should we add password reset?**
   - Decision: Out of scope for hackathon (requires email service)

3. **Should we add profile page in Phase 1?**
   - Decision: Stretch goal (nice to have, not required)

4. **How to handle concurrent signup with same email?**
   - Decision: UNIQUE constraint on email column handles this

---

**Version**: 1.0.0
**Status**: Ready for implementation
**Estimated Time**: 7 days for Phase 1
