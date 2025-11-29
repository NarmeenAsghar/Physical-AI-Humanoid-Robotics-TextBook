# Content Architect Invocation Contract

**Component**: `.claude/agents/content-architect.md`
**Purpose**: Scaffold complete Docusaurus textbook structure (3 chapters, 6 lesson templates)
**Status**: Fully implemented (feature 001)

---

## Input

**Command**:
```bash
claude agent content-architect
```

**User Prompt**:
```
Generate chapters 1-3 from COURSE_CONTENT.md, with 2 lessons per chapter
```

**Alternative Prompts** (all valid):
- "chapters 1-3, lessons 1-2"
- "first 3 chapters, first 2 lessons each"
- "3 chapters, 2 lessons"

---

## Preconditions

✅ **Required**:
- `COURSE_CONTENT.md` exists at repository root
- `docs/docs/` directory exists (Docusaurus initialized)
- `docs/sidebars.ts` exists with `tutorialSidebar` array
- User has write permissions to `docs/docs/`
- Node.js and npm installed for Docusaurus build validation

❌ **Fail if**:
- COURSE_CONTENT.md missing → ERROR with creation instructions
- docs/docs/ not found → ERROR with Docusaurus init steps
- sidebars.ts malformed → ERROR with syntax details
- Permission denied → ERROR with chmod/chown suggestions

---

## Expected Behavior

### Step 1: Parse COURSE_CONTENT.md

**Action**: Read file from repository root, extract Modules 1-3

**Regex Pattern**: `Module (\d+): (.+)`

**Example**:
```
Input: "* **Module 1: The Robotic Nervous System (ROS 2)**"
Output: { number: 1, title: "The Robotic Nervous System (ROS 2)" }
```

---

### Step 2: Generate Chapter Slugs

**Action**: Convert module titles to kebab-case

**Algorithm**:
1. Lowercase entire string
2. Remove special characters (keep alphanumeric, spaces, hyphens)
3. Replace spaces with hyphens
4. Remove consecutive hyphens

**Example**:
```
Input: "The Robotic Nervous System (ROS 2)"
Output: "the-robotic-nervous-system-ros-2"
```

---

### Step 3: Create Chapter Directories

**Action**: Create `docs/docs/chapter-##-{slug}/` for each of 3 chapters

**Expected Directories**:
```
docs/docs/
├── chapter-01-foundations/
├── chapter-02-ros2/
└── chapter-03-simulation/
```

**Behavior**:
- If directory exists: Skip with warning message
- If permission denied: ERROR with fix suggestion
- If created successfully: Log `✅ Created chapter-##-{slug}/`

---

### Step 4: Invoke Lesson Template Generator Skill

**Action**: Call Lesson Template Generator skill 6 times (2 per chapter)

**For Each Lesson**:

**Input to Skill**:
```json
{
  "chapter_number": 1,
  "lesson_number": 1,
  "lesson_title": "Introduction to Embodied Intelligence",
  "lesson_description": "Foundations of Physical AI principles",
  "sidebar_position": 1
}
```

**Expected Output from Skill**:
- Markdown file with YAML frontmatter
- 7 mandatory sections with placeholder text
- File path: `docs/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence.md`

**Validation**:
- File exists and is readable
- Contains `---` YAML delimiters
- All 7 section headers present (`## Introduction`, `## Learning Objectives`, etc.)

---

### Step 5: Create _category_.json Files

**Action**: Generate category config for each chapter directory

**Template**:
```json
{
  "label": "Chapter 1: Foundations",
  "position": 1,
  "collapsed": false,
  "link": {
    "type": "generated-index",
    "description": "Foundations of Physical AI and embodied intelligence"
  }
}
```

**File Path**: `docs/docs/chapter-##-{slug}/_category_.json`

**Validation**:
- Valid JSON syntax
- All required fields present
- `position` matches chapter number

---

### Step 6: Update docs/sidebars.ts

**Action**: Append 3 new category objects to `tutorialSidebar` array

**Current Sidebar Example**:
```typescript
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
  ],
};
```

**After Update**:
```typescript
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Chapter 1: Foundations',
      items: [
        'chapter-01-foundations/lesson-01-intro-embodied-intelligence',
        'chapter-01-foundations/lesson-02-robotics-landscape',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 2: ROS 2',
      items: [
        'chapter-02-ros2/lesson-01-ros2-architecture',
        'chapter-02-ros2/lesson-02-nodes-topics-services',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: Simulation',
      items: [
        'chapter-03-simulation/lesson-01-gazebo-setup',
        'chapter-03-simulation/lesson-02-urdf-sdf-formats',
      ],
    },
  ],
};
```

**Rules**:
- Preserve all existing sidebar items (FR-012)
- Append new categories at end of array
- Add trailing comma after each item
- Maintain 2-space indentation
- Detect duplicates (check if label already exists)

**Validation**:
- TypeScript syntax valid: `npx tsc --noEmit docs/sidebars.ts`
- No duplicate category labels
- Document IDs match actual file paths

---

### Step 7: Run Validation

**Action**: Execute Docusaurus build to verify all files valid

**Command**:
```bash
cd docs && npm run build
```

**Expected**:
- Exit code 0 (success)
- No errors or warnings
- All 6 lessons accessible

**If Build Fails**:
- Capture build output
- Report specific error (broken link, invalid frontmatter, etc.)
- Do NOT rollback (allow user to fix manually)

---

### Step 8: Report Summary

**Action**: Display execution summary to user

**Format**:
```
✅ Content Architect Subagent - Execution Summary

📁 Created Directories (3):
   - docs/docs/chapter-01-foundations/
   - docs/docs/chapter-02-ros2/
   - docs/docs/chapter-03-simulation/

📄 Created Files (9):
   - chapter-01-foundations/lesson-01-intro-embodied-intelligence.md
   - chapter-01-foundations/lesson-02-robotics-landscape.md
   - chapter-01-foundations/_category_.json
   - chapter-02-ros2/lesson-01-ros2-architecture.md
   - chapter-02-ros2/lesson-02-nodes-topics-services.md
   - chapter-02-ros2/_category_.json
   - chapter-03-simulation/lesson-01-gazebo-setup.md
   - chapter-03-simulation/lesson-02-urdf-sdf-formats.md
   - chapter-03-simulation/_category_.json

🔄 Updated Files:
   - docs/sidebars.ts (added 3 categories)

✅ Validation Passed (Docusaurus build succeeded)

⏱️  Execution time: 24.3 seconds
```

---

## Output

**Created Directories**: 3
**Created Lesson Files**: 6
**Created Config Files**: 3 (_category_.json)
**Updated Files**: 1 (sidebars.ts)
**Total Files**: 10 created/updated

**File Structure**:
```
docs/docs/
├── chapter-01-foundations/
│   ├── _category_.json
│   ├── lesson-01-intro-embodied-intelligence.md
│   └── lesson-02-robotics-landscape.md
├── chapter-02-ros2/
│   ├── _category_.json
│   ├── lesson-01-ros2-architecture.md
│   └── lesson-02-nodes-topics-services.md
└── chapter-03-simulation/
    ├── _category_.json
    ├── lesson-01-gazebo-setup.md
    └── lesson-02-urdf-sdf-formats.md

docs/sidebars.ts (updated)
```

---

## Success Criteria

✅ **All Must Pass**:

1. **Structure**: 3 directories created with correct naming (`chapter-##-{slug}`)
2. **Lessons**: 6 lesson files exist with valid YAML frontmatter
3. **Templates**: All 6 lessons have 7 mandatory sections (Introduction, Learning Objectives, Key Concepts, Hands-on Exercise, Quiz, Key Takeaways, Further Reading)
4. **Configs**: 3 _category_.json files with valid JSON syntax
5. **Sidebar**: sidebars.ts contains 3 new categories, no duplicates
6. **Build**: `npm run build` exits with code 0
7. **Performance**: Execution completes in <30 seconds

---

## Error Handling

### Error 1: COURSE_CONTENT.md Missing

**Trigger**: File not found at repository root

**Message**:
```
❌ Error: COURSE_CONTENT.md not found

Expected location: /path/to/repository/COURSE_CONTENT.md

To fix:
1. Create COURSE_CONTENT.md at repository root
2. Add module definitions with format:
   * **Module 1: Title**
   * **Module 2: Title**
   ...
3. Run Content Architect again
```

---

### Error 2: docs/docs/ Directory Missing

**Trigger**: Docusaurus docs directory doesn't exist

**Message**:
```
❌ Error: docs/docs/ directory not found

Docusaurus appears uninitialized.

To fix:
1. cd docs
2. npx create-docusaurus@latest . classic
3. npm install
4. Verify docs/docs/ exists
5. Run Content Architect again
```

---

### Error 3: Permission Denied

**Trigger**: Cannot write to docs/docs/

**Message**:
```
❌ Error: Permission denied writing to docs/docs/

To fix:
sudo chown -R $USER:$USER docs/docs/
chmod -R u+w docs/docs/

Then run Content Architect again.
```

---

### Error 4: Sidebar Update Failed

**Trigger**: Invalid TypeScript syntax in sidebars.ts

**Message**:
```
❌ Error: Failed to update docs/sidebars.ts

TypeScript syntax error:
[Compiler output here]

Original file preserved at: docs/sidebars.ts.backup

To fix:
1. Check sidebars.ts syntax manually
2. Run: npx tsc --noEmit docs/sidebars.ts
3. Fix syntax errors
4. Run Content Architect again
```

---

### Error 5: Docusaurus Build Failed

**Trigger**: `npm run build` exits non-zero

**Message**:
```
❌ Error: Docusaurus build failed

Build output:
[npm run build output here]

Common causes:
- Broken links in lesson files
- Invalid document IDs in sidebars.ts
- Malformed YAML frontmatter

To debug:
cd docs && npm run build

Fix reported errors and verify manually.
```

---

## Idempotency

**Behavior on Re-run**:

If Content Architect invoked twice with same parameters:

1. **Existing Directories**: Skip with warning
   ```
   ⚠️  Warning: chapter-01-foundations/ already exists, skipping
   ```

2. **Existing Lesson Files**: Prompt for overwrite
   ```
   ⚠️  lesson-01-intro-embodied-intelligence.md exists. Overwrite? (y/n)
   ```
   - If `y`: Overwrite file
   - If `n`: Skip file

3. **Existing Sidebar Categories**: Detect duplicates, skip
   ```
   ⚠️  Warning: Sidebar already contains 'Chapter 1: Foundations', skipping duplicate
   ```

4. **Final State**: No duplicates, existing content preserved (unless user confirms overwrite)

---

## Performance Target

**Execution Time**: <30 seconds for 6 lessons

**Breakdown**:
- Parse COURSE_CONTENT.md: <1s
- Create directories: <1s
- Generate 6 lesson files: ~10-15s
- Create 3 _category_.json: <1s
- Update sidebars.ts: <1s
- Validate build: 10-15s (Docusaurus compile time)

**Total**: ~25-30 seconds

---

**Contract Complete**: Content Architect invocation fully specified with inputs, behavior, outputs, validation, and error handling.
