# Quickstart: Generate Physical AI Textbook

**Time Required**: ~30 minutes
**Difficulty**: Easy (all components ready, just orchestrate)
**Prerequisites**: Docusaurus initialized, COURSE_CONTENT.md exists, all agents installed

---

## What You'll Build

By the end of this quickstart, you'll have:

- ✅ Complete Docusaurus textbook with 3 chapters, 6 lessons
- ✅ 3 lessons with full educational content (~800 words each)
- ✅ 3 lessons with professional templates (ready for future expansion)
- ✅ Navigable sidebar with all chapters and lessons
- ✅ Production-ready static site (deployable to GitHub Pages)

**Total Content**: ~2400 words of researched, pedagogically-sound educational material

---

## Prerequisites Checklist

Before starting, verify:

- [ ] **Repository Root**: You're in `/path/to/add-hackathon-2k25`
- [ ] **COURSE_CONTENT.md**: File exists at repository root with module definitions
- [ ] **Docusaurus Initialized**: `docs/` directory exists with `npm install` completed
- [ ] **Sidebar File**: `docs/sidebars.ts` exists
- [ ] **Write Permissions**: You can write to `docs/docs/` directory
- [ ] **Internet Connection**: Available for Technical Writer research phase

**Verify**:
```bash
# Check repository root
pwd  # Should show /path/to/add-hackathon-2k25

# Check COURSE_CONTENT.md
ls -la COURSE_CONTENT.md

# Check Docusaurus
cd docs && npm run build  # Should succeed
cd ..

# Check write permissions
ls -ld docs/docs/  # Should show 'w' permission
```

---

## Step 1: Scaffold Textbook Structure (10 minutes)

### Launch Content Architect

```bash
# Navigate to project root
cd /path/to/add-hackathon-2k25

# Invoke Content Architect subagent
claude agent content-architect
```

### Provide Input

When prompted, enter:
```
Generate chapters 1-3 from COURSE_CONTENT.md, with 2 lessons per chapter
```

**Alternative prompts** (all work):
- "chapters 1-3, lessons 1-2"
- "first 3 chapters, first 2 lessons each"
- "3 chapters, 2 lessons"

### Expected Output

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

✅ Validation: Docusaurus build succeeded

⏱️  Execution time: ~25 seconds
```

### Verify Structure

```bash
# Check created files
find docs/docs/chapter-* -type f

# Preview in browser
cd docs && npm run start
# Visit http://localhost:3000
# You should see 3 chapters in sidebar, each with 2 lessons (templates)
```

---

## Step 2: Generate Lesson 1.1 Content (7 minutes)

### Launch Technical Writer

```bash
# From project root
claude agent technical-writer
```

### Provide Input

```
Write content for lesson 1.1 in chapter-01-foundations, topic: Introduction to Embodied Intelligence, target: 800 words
```

### What Happens

The Technical Writer agent will:
1. **Research** (2-3 min): Search for latest embodied AI developments, examples
2. **Write** (3-4 min): Generate ~800 word lesson with real-world examples
3. **Validate** (1 min): Check word count, ensure objectives addressed
4. **Update** (<1 min): Write content to lesson file

### Expected Output

```
✍️ Technical Writer Agent - Execution Summary

📚 Lesson Updated: chapter-01-foundations/lesson-01-intro-embodied-intelligence.md

📊 Content Stats:
   - Word count: 823 words
   - Sections filled: 7/7
   - Real-world examples: 4 (Tesla Optimus, Figure 01, 1X Neo, Boston Dynamics Atlas)
   - External resources: 3 URLs (all HTTPS)
   - Callout boxes: 3 (Key Concepts)

✅ All learning objectives addressed
✅ Content passes validation

⏱️  Execution time: 6.8 minutes
```

### Verify Content

```bash
# Check word count
cat docs/docs/chapter-01-foundations/lesson-01-*.md | wc -w
# Should be ~800 words

# Preview in browser (refresh page)
# Lesson 1.1 should now show full educational content
```

---

## Step 3: Generate Lesson 2.1 Content (7 minutes)

### Launch Technical Writer

```bash
claude agent technical-writer
```

### Provide Input

```
Write content for lesson 2.1 in chapter-02-ros2, topic: ROS 2 Architecture & Core Concepts, target: 800 words
```

### Expected Output

```
✍️ Technical Writer Agent - Execution Summary

📚 Lesson Updated: chapter-02-ros2/lesson-01-ros2-architecture.md

📊 Content Stats:
   - Word count: 807 words
   - Sections filled: 7/7
   - Real-world examples: 4 (Unitree H1, NASA Valkyrie, Agility Digit, Nav2)
   - External resources: 3 URLs
   - Callout boxes: 3

✅ Validation passed

⏱️  Execution time: 7.2 minutes
```

---

## Step 4: Generate Lesson 3.1 Content (7 minutes)

### Launch Technical Writer

```bash
claude agent technical-writer
```

### Provide Input

```
Write content for lesson 3.1 in chapter-03-simulation, topic: Gazebo Simulation Environment Setup, target: 800 words
```

### Expected Output

```
✍️ Technical Writer Agent - Execution Summary

📚 Lesson Updated: chapter-03-simulation/lesson-01-gazebo-setup.md

📊 Content Stats:
   - Word count: 818 words
   - Sections filled: 7/7
   - Real-world examples: 4 (NASA Valkyrie, Unitree, RoboCup, Academic Standard)
   - External resources: 3 URLs
   - Callout boxes: 3

✅ Validation passed

⏱️  Execution time: 6.5 minutes
```

---

## Step 5: Validate & Preview (2 minutes)

### Build Docusaurus Site

```bash
# Navigate to docs directory
cd docs

# Run production build
npm run build

# Should output:
# ✔ Client build successful
# ✔ Server build successful
# Build succeeded in X seconds
```

### Start Development Server

```bash
# Still in docs/ directory
npm run start

# Opens browser at http://localhost:3000
```

### Verification Checklist

Open http://localhost:3000 and verify:

- [ ] **Sidebar Navigation**: Shows 3 chapters, each with 2 lessons
- [ ] **Lesson 1.1** (Embodied Intelligence): Full content (~800 words), real examples
- [ ] **Lesson 2.1** (ROS 2 Architecture): Full content (~800 words), real examples
- [ ] **Lesson 3.1** (Gazebo Simulation): Full content (~800 words), real examples
- [ ] **Lesson 1.2, 2.2, 3.2**: Template content with placeholders
- [ ] **Quiz Sections**: Answers hidden in collapsible `<details>` tags
- [ ] **Further Reading**: All links are HTTPS and clickable
- [ ] **Learning Objectives**: Use checkbox format `- [ ]`

### Manual Word Count Check

```bash
# Count words in full content lessons (from docs/docs/)
cat chapter-01-foundations/lesson-01-*.md | wc -w  # ~800
cat chapter-02-ros2/lesson-01-*.md | wc -w         # ~800
cat chapter-03-simulation/lesson-01-*.md | wc -w   # ~800

# Count words in template lessons (should be much less, ~200-300)
cat chapter-01-foundations/lesson-02-*.md | wc -w  # ~200-300
```

---

## Workflow Summary

**Total Time**: ~30 minutes

| Step | Action | Time |
|------|--------|------|
| 1 | Content Architect (scaffold structure) | ~10 min |
| 2 | Technical Writer (lesson 1.1) | ~7 min |
| 3 | Technical Writer (lesson 2.1) | ~7 min |
| 4 | Technical Writer (lesson 3.1) | ~7 min |
| 5 | Validate & preview | ~2 min |

**Output**:
- 3 chapters with navigation
- 6 lessons: 3 full (~800w each), 3 templates
- ~2400 words of educational content
- Production-ready Docusaurus site

---

## Troubleshooting

### Issue 1: Content Architect Fails

**Error**: "COURSE_CONTENT.md not found"

**Fix**:
```bash
# Check current directory
pwd  # Should be /path/to/add-hackathon-2k25

# Verify file exists
ls -la COURSE_CONTENT.md

# If missing, you're in wrong directory or file is missing
cd /path/to/add-hackathon-2k25  # Navigate to correct location
```

---

### Issue 2: Docusaurus Build Fails

**Error**: "Error: Broken links detected"

**Fix**:
```bash
# Check which file has broken link
cd docs && npm run build

# Common causes:
# - Next Lesson link points to non-existent file
# - Further Reading URL is malformed

# Inspect lesson files for broken [text](url) links
grep -r "](.*)" docs/docs/chapter-*
```

---

### Issue 3: Technical Writer Generates Too Many/Few Words

**Error**: "Word count 650 below target" or "Word count 1050 above target"

**Fix**:
```bash
# Re-run with explicit instruction:
claude agent technical-writer

# Prompt:
"Write content for lesson X.X, topic: [Topic], target: EXACTLY 800 words. Current content has [current count] words."
```

---

### Issue 4: Web Search Fails During Technical Writer

**Warning**: "Web search failed after 3 retries"

**Behavior**: Agent continues with internal knowledge only

**Impact**: Content may lack latest examples and real URLs

**Fix**:
- Check internet connection
- Retry agent invocation
- If still fails, manually add URLs to Further Reading sections after generation

---

### Issue 5: Permission Denied Writing Files

**Error**: "Permission denied: docs/docs/chapter-01-foundations/"

**Fix**:
```bash
# Grant write permissions
sudo chown -R $USER:$USER docs/docs/
chmod -R u+w docs/docs/

# Verify
ls -ld docs/docs/  # Should show 'drwxr-xr-x' or similar with 'w'

# Retry agent
```

---

## Next Steps

After textbook generation complete:

### 1. Review Content Quality

```bash
# Read each full lesson
cat docs/docs/chapter-01-foundations/lesson-01-*.md
cat docs/docs/chapter-02-ros2/lesson-01-*.md
cat docs/docs/chapter-03-simulation/lesson-01-*.md

# Check for:
# - Technical accuracy
# - Clear explanations
# - Real-world examples
# - Working URLs
```

### 2. Test Quiz Questions

- Open each lesson in browser
- Attempt quiz questions
- Verify answers make sense
- Confirm `<details>` tag hides answers until clicked

### 3. Validate External Links

```bash
# Extract all URLs from Further Reading sections
grep -r "https://" docs/docs/chapter-*/lesson-01-* | grep "Further Reading" -A 10

# Manually check each URL opens in browser
```

### 4. Deploy to GitHub Pages (Optional)

```bash
# Build production site
cd docs && npm run build

# Deploy (if GitHub Pages configured)
npm run deploy

# Or manually:
git add docs/build
git commit -m "Add generated textbook content"
git push origin book-writing
```

### 5. Expand Content (Future)

**Option A**: Fill remaining template lessons (1.2, 2.2, 3.2)
```bash
# Run Technical Writer 3 more times
claude agent technical-writer
> lesson 1.2 in chapter-01-foundations, topic: [Topic from COURSE_CONTENT.md]

claude agent technical-writer
> lesson 2.2 in chapter-02-ros2, topic: [Topic]

claude agent technical-writer
> lesson 3.2 in chapter-03-simulation, topic: [Topic]
```

**Option B**: Add more chapters (4-6)
```bash
# Re-run Content Architect with expanded range
claude agent content-architect
> chapters 1-6, lessons 1-2

# Then fill new lessons with Technical Writer
```

**Option C**: Increase content depth (800 → 1500+ words)
- Edit spec.md to update word count targets
- Re-run Technical Writer with new targets

---

## Success Criteria Met

After completing this quickstart, verify:

- ✅ **SC-001**: Content Architect completed in <30 seconds
- ✅ **SC-002**: All lesson files have valid YAML frontmatter and markdown
- ✅ **SC-003**: Technical Writer generated ~800 words per lesson (700-900 range)
- ✅ **SC-004**: All learning objectives addressed in content
- ✅ **SC-005**: Docusaurus build exits with code 0 (no errors/warnings)
- ✅ **SC-006**: Total workflow completed in <35 minutes
- ✅ **SC-007**: Each full lesson has 2+ real-world examples
- ✅ **SC-008**: Sidebar displays 3 chapters × 2 lessons = 6 total
- ✅ **SC-009**: Idempotency - re-running doesn't create duplicates
- ✅ **SC-010**: Content maintains consistent, encouraging educational tone

---

## FAQ

**Q: Can I change the word count target?**
A: Yes! Modify the prompt: "target: 1200 words" instead of 800. The agent will adjust content length.

**Q: What if I want all 6 lessons with full content?**
A: Run Technical Writer 3 more times for lessons 1.2, 2.2, 3.2. Takes ~21 additional minutes.

**Q: Can I customize the lesson topics?**
A: Yes! Edit COURSE_CONTENT.md to change module titles and lesson descriptions, then re-run Content Architect.

**Q: How do I add more chapters?**
A: Re-run Content Architect with "chapters 1-6" instead of 1-3. Then use Technical Writer to fill priority lessons.

**Q: Is the generated content accurate?**
A: Technical Writer researches latest information via web search, but always review for accuracy. It cites sources in Further Reading.

**Q: Can I edit the generated content?**
A: Absolutely! Generated content is markdown - edit directly in lesson files. Re-running Technical Writer will prompt before overwriting.

**Q: How do I deploy to GitHub Pages?**
A: Configure Docusaurus for GitHub Pages, run `npm run deploy` in docs/. See [Docusaurus deployment docs](https://docusaurus.io/docs/deployment).

---

**Quickstart Complete!** You now have a production-ready Physical AI textbook with researched, pedagogically-sound educational content.

**Time Invested**: ~30 minutes
**Content Generated**: ~2400 words across 3 lessons
**Next**: Deploy to GitHub Pages or continue expanding content
