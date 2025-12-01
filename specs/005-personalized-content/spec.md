# Feature Specification: Personalized Content with BetterAuth

**Feature**: 005-personalized-content
**Created**: 2025-11-30
**Status**: Draft
**Priority**: P2 (Bonus - 100 points total)

**Prompt**: |
  Implement user authentication with BetterAuth and personalized content delivery based on user background.

  Requirements:
  1. User authentication (signup/signin) using Better-auth.com (+50 points)
  2. Collect user background data at signup (software/hardware experience)
  3. Per-chapter personalization button (+50 points)
  4. Adapt content based on user expertise level
  5. Store personalized content in Postgres for caching

---

## Executive Summary

This feature adds authentication and personalization capabilities to the Physical AI textbook. Users sign up with BetterAuth, provide their background (software/hardware experience), and can personalize chapter content by clicking a button. The system uses AI to adapt content complexity and examples based on user expertise.

**Total Bonus Points**: 100
- BetterAuth signup/signin with background collection: +50
- Per-chapter personalization: +50

---

## User Scenarios & Testing

### User Story 1: User Signup with Background Collection (+50 points)

**As a** new student,
**I want to** create an account and share my background,
**So that** the system can tailor content to my expertise level.

**Independent Test**:
1. Visit signup page
2. Fill in email, password, name
3. Answer background questions (software experience, hardware experience)
4. Submit form
5. Account created and background stored in Postgres

**Acceptance Scenarios**:

1. **Given** a new user visits /signup, **When** they fill the form with valid data, **Then** their account is created and they are redirected to the textbook home page.

2. **Given** a user completes signup, **When** they answer background questions (Beginner/Intermediate/Advanced for software and hardware), **Then** their responses are stored in the user_backgrounds table.

3. **Given** a user with existing email tries to signup, **When** they submit the form, **Then** they see an error: "Email already registered".

4. **Given** a user provides invalid email format, **When** they submit, **Then** they see validation error.

---

### User Story 2: User Signin

**As a** returning student,
**I want to** sign in with my credentials,
**So that** I can access personalized content.

**Independent Test**:
1. Visit signin page
2. Enter email and password
3. Submit form
4. Redirected to textbook, session cookie set

**Acceptance Scenarios**:

1. **Given** a registered user visits /signin, **When** they enter correct credentials, **Then** they are logged in and redirected to home.

2. **Given** a user enters wrong password, **When** they submit, **Then** they see error: "Invalid credentials".

3. **Given** a logged-in user, **When** they navigate pages, **Then** their session persists via HTTP-only cookie.

---

### User Story 3: Per-Chapter Content Personalization (+50 points)

**As a** logged-in student,
**I want to** click "Personalize" at the start of a chapter,
**So that** the content adapts to my background and learning style.

**Independent Test**:
1. Login as user with "Beginner" software experience
2. Navigate to Chapter 1, Lesson 1
3. Click "Personalize for Me" button
4. See loading spinner
5. Content updates with beginner-friendly explanations and analogies

**Acceptance Scenarios**:

1. **Given** a logged-in user with "Advanced" hardware experience, **When** they click "Personalize" on a hardware-heavy chapter, **Then** the content skips basic explanations and focuses on advanced concepts.

2. **Given** a logged-in user with "Beginner" software experience, **When** they personalize a coding chapter, **Then** the content includes more code comments, simpler examples, and step-by-step breakdowns.

3. **Given** a user has already personalized a chapter, **When** they revisit it, **Then** the personalized version loads from cache (Postgres) instead of re-generating.

4. **Given** a user clicks "Personalize" on a chapter, **When** personalization fails (API error), **Then** they see the original content with an error message: "Personalization unavailable, showing original content".

5. **Given** a logged-out user, **When** they view a chapter, **Then** they see the original content without a "Personalize" button.

---

## Technical Requirements

### Authentication (BetterAuth)

- **Library**: better-auth (https://www.better-auth.com/)
- **Session Management**: HTTP-only cookies, 7-day expiration
- **Database**: Neon Postgres (users, sessions tables)
- **Security**: bcrypt password hashing, CSRF protection

### Database Schema (Postgres - Neon)

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**User Backgrounds Table:**
```sql
CREATE TABLE user_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  software_experience VARCHAR(50) NOT NULL CHECK (software_experience IN ('Beginner', 'Intermediate', 'Advanced')),
  hardware_experience VARCHAR(50) NOT NULL CHECK (hardware_experience IN ('Beginner', 'Intermediate', 'Advanced')),
  programming_languages TEXT[], -- Array of languages they know
  robotics_background TEXT, -- Free text description
  learning_goals TEXT, -- Free text description
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

**Personalized Content Table:**
```sql
CREATE TABLE personalized_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  lesson_number INT NOT NULL,
  original_content_hash VARCHAR(64) NOT NULL, -- MD5 of original content
  personalized_content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, chapter_number, lesson_number, original_content_hash)
);
```

**Sessions Table (managed by BetterAuth):**
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Personalization Service

- **Input**: User background + Original lesson content
- **LLM**: Google Gemini 1.5 Flash (via OpenAI SDK)
- **Prompt Engineering**:
  - For beginners: Add analogies, simplify jargon, more code comments
  - For advanced: Skip basics, add depth, reference papers
- **Caching**: Store personalized content in Postgres to avoid regenerating
- **Invalidation**: If lesson content changes (hash mismatch), regenerate

### API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Create account + store background
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/me` - Get current user

**User Background:**
- `GET /api/user/background` - Get user's background data
- `PUT /api/user/background` - Update background data

**Personalization:**
- `POST /api/content/personalize` - Generate personalized content
  - Body: `{ chapter_number, lesson_number, user_id }`
  - Returns: Personalized markdown content
- `GET /api/content/personalized/:chapter/:lesson` - Retrieve cached personalized content

### Frontend Components

**New Pages:**
- `/signup` - Signup form with background questions
- `/signin` - Login form
- `/profile` - User profile and background management

**New Components:**
- `<PersonalizeButton />` - Shows at top of each lesson (only for logged-in users)
- `<PersonalizedContent />` - Renders personalized markdown
- `<AuthProvider />` - Context for user session state

---

## Architecture Decisions

### Why BetterAuth?

- **Requirement**: Explicitly mentioned in hackathon spec
- **Benefits**: Modern, TypeScript-first, built for Next.js/React
- **Session Management**: Built-in HTTP-only cookie support
- **Database**: Works with Postgres out of the box

### Why Cache Personalized Content?

- **Cost**: Re-generating on every page view is expensive (LLM calls)
- **Performance**: Cached content loads instantly
- **UX**: Users expect personalized version to persist

### Why Not Real-Time Personalization?

- **Complexity**: Streaming personalized content adds latency
- **UX**: Better to show "Personalizing..." spinner then load complete content
- **Caching**: Batch personalization is easier to cache

---

## Implementation Phases

### Phase 1: User Background Collection (Week 1)

**Goal**: Users can signup, signin, and provide background data.

**Tasks**:
1. Setup Neon Postgres database
2. Create database schema (users, user_backgrounds, sessions)
3. Install and configure BetterAuth in backend
4. Implement signup API endpoint with background collection
5. Implement signin/signout endpoints
6. Create frontend signup form with background questions
7. Create frontend signin form
8. Implement session management (HTTP-only cookies)

**Test**: User can signup with background, login, and session persists across pages.

---

### Phase 2: Content Personalization Service (Week 2)

**Goal**: Backend can generate personalized content based on user background.

**Tasks**:
1. Create personalization service using Gemini 1.5 Flash
2. Design prompt template for personalization (beginner/intermediate/advanced)
3. Implement content hash function (MD5)
4. Create personalized_content table
5. Implement caching logic (check cache before generating)
6. Implement POST /api/content/personalize endpoint
7. Implement GET /api/content/personalized/:chapter/:lesson endpoint

**Test**: API can personalize a lesson for different user backgrounds and cache results.

---

### Phase 3: Frontend Personalization UI (Week 2)

**Goal**: Users can click "Personalize" button and see adapted content.

**Tasks**:
1. Create `<PersonalizeButton />` component
2. Add button to lesson template (top of page)
3. Implement loading state during personalization
4. Create `<PersonalizedContent />` component to render markdown
5. Implement error handling (show original content if personalization fails)
6. Add "Reset to Original" button to toggle back
7. Style personalized content (subtle visual difference from original)

**Test**: Logged-in user can personalize any chapter and see adapted content.

---

## Non-Functional Requirements

### Performance

- **Personalization Generation**: <5 seconds for typical lesson (~2000 words)
- **Cached Content Load**: <500ms
- **Database Queries**: <100ms
- **Login/Signup**: <1 second

### Security

- **Passwords**: bcrypt with 12 rounds
- **Sessions**: HTTP-only, Secure, SameSite=Strict cookies
- **CSRF Protection**: Enabled via BetterAuth
- **Input Validation**: Validate all user inputs (email, passwords, background)
- **SQL Injection**: Use parameterized queries only

### Scalability

- **Concurrent Users**: Support 100 concurrent logged-in users
- **Database**: Neon free tier (512 MB storage, 0.25 compute units)
- **Personalized Content**: Limit to 50 cached personalizations per user

---

## Testing Strategy

### Unit Tests

- BetterAuth integration tests
- Personalization prompt generation tests
- Background validation tests

### Integration Tests

- Signup/signin flow end-to-end
- Personalization API with different user backgrounds
- Cache hit/miss scenarios

### Manual Tests

- Test signup with all background combinations
- Test personalization for beginners vs advanced users
- Verify session persistence across browser refresh

---

## Success Criteria

✅ **Authentication (+50 points)**
- Users can signup with email/password
- Background questions collected at signup
- Sessions persist via HTTP-only cookies
- Login/logout works correctly

✅ **Personalization (+50 points)**
- Logged-in users see "Personalize" button on chapters
- Content adapts based on user background (beginner/advanced)
- Personalized content cached in Postgres
- Users can toggle between original and personalized versions

✅ **Constitution Compliance**
- Follows Spec-Kit Plus methodology
- Progressive enhancement (chatbot works without auth)
- Neon Postgres free tier respected
- BetterAuth properly configured

---

## Risks & Mitigations

### Risk 1: LLM Personalization Quality

**Risk**: AI-generated personalized content may be inaccurate or unhelpful.

**Mitigation**:
- Test with multiple user backgrounds
- Add manual review step for first 5 lessons
- Allow users to report bad personalizations

### Risk 2: Neon Free Tier Limits

**Risk**: 512 MB storage may be insufficient for many users and cached content.

**Mitigation**:
- Limit personalized content cache per user (max 50 lessons)
- Implement LRU eviction (delete oldest personalizations)

### Risk 3: BetterAuth Learning Curve

**Risk**: Team unfamiliar with BetterAuth may struggle with setup.

**Mitigation**:
- Use BetterAuth official docs: https://www.better-auth.com/docs
- Follow quickstart guide for Postgres setup
- Test in isolated sandbox before integrating

---

## Dependencies

### External Services

- **Neon Postgres**: Free tier database
- **BetterAuth**: Authentication library
- **Google Gemini API**: For content personalization

### Internal Dependencies

- **Feature 004 (RAG Chatbot)**: Must be deployed and working
- **Docusaurus**: Personalization button integrates into lesson pages

---

## Out of Scope

- Multi-factor authentication (2FA)
- Social login (Google, GitHub)
- Password reset via email
- User roles and permissions
- Real-time collaborative editing
- Mobile app authentication

---

## Acceptance Criteria Summary

1. ✅ User can signup with email/password and background questions
2. ✅ User can signin and session persists via cookies
3. ✅ Background data (software/hardware experience) stored in Postgres
4. ✅ Logged-in user sees "Personalize" button on chapter pages
5. ✅ Clicking button generates personalized content based on background
6. ✅ Personalized content cached in Postgres (no regeneration on refresh)
7. ✅ User can toggle between original and personalized versions
8. ✅ All APIs secured with session authentication
9. ✅ Constitution compliance (Principles I-IX)
10. ✅ 100 bonus points earned (+50 auth, +50 personalization)

---

**Version**: 1.0.0
**Approved**: Pending
**Implementation Start**: TBD
