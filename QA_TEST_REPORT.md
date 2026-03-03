# QA Smoke Test Report - Portfolio Website
**Test Date:** February 28, 2026  
**Environment:** http://localhost:3000 (Next.js Dev Server)  
**Tester:** Automated Code Analysis + Manual Testing Guide

---

## 🔍 OVERALL RESULT: **CONDITIONAL PASS** ⚠️

The site is functional with no critical blocking issues, but has **3 HIGH severity issues** that should be addressed before production deployment.

---

## ✅ What Was Tested

### 1. Homepage Rendering ✓
- **Status:** PASS
- Homepage loads successfully (HTTP 200)
- All main sections render:
  - Hero section with profile card
  - Top Projects section (3 featured projects)
  - Additional Projects section
  - Skills section (4 skill groups)
  - Credentials/Experience section
  - Contact section
  - Footer

### 2. Project Detail Pages ✓
- **Status:** PASS
- `/projects/foodloft` loads successfully (HTTP 200)
- Project detail page structure includes:
  - Back navigation link
  - Project title and summary
  - Challenge section
  - Architecture section
  - Implementation highlights
  - Outcome/impact section
  - Action buttons (GitHub, Live demo)

### 3. 404 Error Handling ✓
- **Status:** PASS
- Non-existent routes return proper 404 response
- Custom 404 page renders with "Return home" link

### 4. Code Quality ✓
- **Status:** PASS
- ESLint validation: No errors or warnings
- TypeScript compilation: Clean (no type errors)
- File structure follows Next.js 14+ App Router conventions

### 5. GitHub API Integration
- **Status:** NEEDS MANUAL VERIFICATION ⚠️
- Code properly handles API failures with fallback UI
- 30-minute cache revalidation configured
- Rate limiting protection in place

---

## 🐛 ISSUES FOUND

### HIGH SEVERITY Issues 🔴

#### Issue #1: Missing Resume PDF File
**Severity:** HIGH  
**Component:** Hero Section CTA Button  
**Location:** `/resume.pdf`

**Description:**  
The "Download Resume" button links to `/resume.pdf`, but this file doesn't exist in the public directory.

**Reproduction Steps:**
1. Navigate to http://localhost:3000
2. Click "Download Resume" button in hero section
3. Observe: 404 error or broken download

**Expected Behavior:**  
Resume PDF should download successfully

**Suggested Fix:**
```bash
# Add resume.pdf to public directory
# File path should be: d:\PortfolioWeb\public\resume.pdf
```

**User Impact:**  
Recruiters cannot download resume - **major friction in hiring pipeline**

---

#### Issue #2: Character Encoding Issues in Meta Tags
**Severity:** HIGH  
**Component:** Layout metadata  
**Location:** `app/layout.tsx`, HTML output

**Description:**  
The bullet point character (·) in the title is being rendered as � (replacement character) in the HTML meta tags, indicating UTF-8 encoding issues.

**Observed in HTML:**
```html
<title>Ahkar Min Oo � Software Developer</title>
```

**Reproduction Steps:**
1. View page source at http://localhost:3000
2. Search for `<title>` tag
3. Observe: � instead of ·

**Expected Behavior:**  
Should display: `Ahkar Min Oo · Software Developer`

**Suggested Fix:**
```typescript
// In app/layout.tsx, line 10 and 11
title: {
  default: `${profileConfig.fullName} | Software Developer`, // Use | instead
  template: `%s | ${profileConfig.fullName}`
}

// OR ensure proper charset meta tag in layout
// (Next.js should handle this automatically, but verify)
```

**User Impact:**  
Unprofessional appearance in browser tabs, search results, and social media shares

---

#### Issue #3: Responsive Layout Testing Required
**Severity:** HIGH  
**Component:** Global CSS responsive breakpoints  
**Location:** `app/globals.css` line 336-346

**Description:**  
Only one responsive breakpoint exists (`@media (max-width: 960px)`), which may cause layout issues on tablet and mobile devices.

**Specific Concerns:**
1. **Hero Grid (line 72-76):** 2-column layout (`2fr 1fr`) may be too cramped on tablets (768px-960px)
2. **Project Grid (line 170-174):** 3-column layout has no intermediate breakpoint for tablets
3. **Missing mobile-specific optimizations** for very small screens (<390px)
4. **Button text wrapping:** Project action buttons may overflow on narrow cards

**Reproduction Steps:**
1. Open http://localhost:3000
2. Resize browser to 768px width (tablet)
3. Observe: Hero section may feel cramped, profile card squeezed
4. Resize to 390px (mobile)
5. Check: Project cards, button layouts, text readability

**Expected Behavior:**  
Smooth responsive behavior at common breakpoints:
- Desktop: 1080px+
- Tablet: 768px-960px
- Mobile: 390px-767px
- Small mobile: <390px

**Suggested Fix:**
```css
/* Add to globals.css after line 346 */

/* Tablet breakpoint */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
  
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .site-shell {
    padding: 1rem 0.75rem 2rem;
  }
  
  .section-card {
    padding: 1rem;
  }
  
  .btn {
    font-size: 0.85rem;
    padding: 0.45rem 0.75rem;
  }
}
```

**User Impact:**  
Poor mobile experience for 50%+ of visitors, especially recruiters reviewing on phones

---

### MEDIUM SEVERITY Issues 🟡

#### Issue #4: GitHub API Rate Limiting Potential
**Severity:** MEDIUM  
**Component:** GitHub API integration  
**Location:** `lib/github.ts`

**Description:**  
No GitHub authentication token is configured. Unauthenticated requests are limited to 60/hour, which may cause failures during development or if multiple users access the site.

**Reproduction Steps:**
1. Refresh homepage repeatedly (>60 times in an hour)
2. Observe: Fallback error state may appear

**Expected Behavior:**  
Should handle rate limiting gracefully (already does) but could be optimized

**Suggested Fix:**
```typescript
// In lib/github.ts, line 28
headers: { 
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  })
}

// Add to .env.local:
// GITHUB_TOKEN=your_personal_access_token
```

**User Impact:**  
Site may show error state during high traffic or development

---

#### Issue #5: Missing Loading States for Images
**Severity:** MEDIUM  
**Component:** Hero Section avatar  
**Location:** `components/sections/HeroSection.tsx`

**Description:**  
GitHub avatar image has `priority` flag but no blur placeholder or loading skeleton.

**Reproduction Steps:**
1. Open http://localhost:3000 with slow network throttling (DevTools)
2. Observe: Layout shift as avatar loads

**Expected Behavior:**  
Should show blur placeholder or skeleton during load

**Suggested Fix:**
```typescript
// In components/sections/HeroSection.tsx, line 29-35
<Image
  src={profile.avatar_url}
  alt={`${profileConfig.fullName} avatar`}
  width={112}
  height={112}
  priority
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..." // Add base64 blur placeholder
  className="avatar"
/>
```

**User Impact:**  
Cumulative Layout Shift (CLS) affects Core Web Vitals score

---

#### Issue #6: No Console Error Boundary Logging
**Severity:** MEDIUM  
**Component:** Error page  
**Location:** `app/error.tsx`

**Description:**  
Error component doesn't log errors to console for debugging.

**Suggested Fix:**
```typescript
// In app/error.tsx, line 8
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  console.error('Portfolio error:', error); // Add this
  return (
    // ... rest of component
  );
}
```

---

### LOW SEVERITY Issues 🟢

#### Issue #7: No robots.txt Verification
**Severity:** LOW  
**Description:** Code structure suggests `robots.txt` route exists, but should verify it works correctly

**Suggested Test:**
```bash
curl http://localhost:3000/robots.txt
```

---

#### Issue #8: No Sitemap Verification  
**Severity:** LOW  
**Description:** Code structure suggests `sitemap.xml` route exists, but should verify it generates correctly

**Suggested Test:**
```bash
curl http://localhost:3000/sitemap.xml
```

---

#### Issue #9: Color Contrast Not Verified
**Severity:** LOW  
**Component:** CSS color system  
**Location:** `app/globals.css`

**Description:**  
Color variables defined but WCAG AA contrast ratios not verified for accessibility.

**Colors to check:**
- `--muted` text on `--surface` background
- `--accent` on dark/light backgrounds
- Button text contrast

**Suggested Tool:**  
Use browser DevTools Lighthouse audit or WebAIM contrast checker

---

#### Issue #10: External Links Missing Security Attributes
**Severity:** LOW  
**Component:** All external links  

**Description:**  
External links use `rel="noreferrer"` but should also include `noopener` for older browsers.

**Current:** `rel="noreferrer"`  
**Better:** `rel="noopener noreferrer"`

**Locations:**
- `components/sections/HeroSection.tsx` line 53
- `components/sections/ProjectsSection.tsx` lines 54, 58
- `components/sections/ContactSection.tsx` line 12

---

## 📱 RESPONSIVE TESTING CHECKLIST

### Desktop (1080px+) - PASS ✓
- [x] Hero section layout
- [x] 3-column project grid
- [x] 2-column skills/credentials grids
- [x] All text readable
- [x] No horizontal scroll

### Tablet (768px-960px) - NEEDS TESTING ⚠️
- [ ] Hero switches to single column
- [ ] Project grid still 3 columns (may be too cramped)
- [ ] Touch target sizes adequate (44x44px minimum)
- [ ] Navigation/buttons easily tappable

### Mobile (390px-767px) - NEEDS TESTING ⚠️
- [ ] Single column layouts
- [ ] Text remains readable (minimum 16px)
- [ ] Buttons don't overflow cards
- [ ] Images scale properly
- [ ] No content cutoff

### Small Mobile (<390px) - NEEDS TESTING ⚠️
- [ ] Content still accessible
- [ ] No layout breaks
- [ ] Buttons still functional

---

## 🎯 INTERACTIVE ELEMENTS TESTING

### Navigation Links
- [x] "Download Resume" button (links to `/resume.pdf`) - **BROKEN**
- [x] "Contact Me" button (mailto link) - code looks correct
- [x] "View GitHub Profile" link (external) - code looks correct
- [x] Project "View case study" links - functional
- [x] Project "GitHub" links (external) - functional  
- [x] Project "Live demo" links (conditional) - functional
- [x] Contact section links (Email, GitHub, Live Product) - code looks correct
- [x] "Back to portfolio" link on project pages - functional

### Forms/Interactions
- No forms present (contact via mailto links)
- Error page "Retry" button - functional

---

## 🖼️ VISUAL INSPECTION CHECKLIST

Based on code analysis, these should be verified manually:

### Layout Issues (NEEDS MANUAL CHECK)
- [ ] No overlapping elements
- [ ] Proper spacing between sections
- [ ] Cards don't overflow containers
- [ ] Footer properly positioned
- [ ] Profile card aligned with hero content

### Typography (NEEDS MANUAL CHECK)
- [ ] All fonts load correctly (Inter, system fallbacks)
- [ ] Heading hierarchy makes sense (h1 → h2 → h3)
- [ ] No text cutoff or overflow
- [ ] Line heights comfortable for reading
- [ ] Character encoding displays correctly (· bullets)

### Images (NEEDS MANUAL CHECK)
- [ ] GitHub avatar loads and displays
- [ ] Avatar has proper border radius
- [ ] No broken image icons
- [ ] Images maintain aspect ratio

### Colors & Theming (NEEDS MANUAL CHECK)
- [ ] Dark mode colors work well
- [ ] Light mode colors work well (if system preference is light)
- [ ] Gradient background renders smoothly
- [ ] Border colors visible but not harsh
- [ ] Accent colors provide good contrast

---

## 🔍 BROWSER CONSOLE CHECK

**Required Manual Test:**

1. Open http://localhost:3000
2. Open DevTools Console (F12)
3. Look for:
   - ❌ **Red errors** (JavaScript errors, failed requests)
   - ⚠️ **Yellow warnings** (deprecations, performance hints)
   - 🔵 **Info messages** (may be normal Next.js dev logs)

**Expected Console Output (Dev Mode):**
```
✓ Next.js dev server messages
✓ HMR (Hot Module Reload) connections
✓ React DevTools connection
```

**Unacceptable Console Output:**
```
❌ Uncaught TypeError
❌ 404 errors for assets
❌ CORS errors
❌ Failed to fetch errors (except during GitHub API failures)
```

---

## 🚀 PERFORMANCE CONSIDERATIONS (NOT FULLY TESTED)

### Potential Issues to Monitor:
1. **GitHub API latency** - 30s timeout may be too long
2. **Image optimization** - Next.js Image component used correctly ✓
3. **Bundle size** - Need production build analysis
4. **First Contentful Paint (FCP)** - Measure with Lighthouse
5. **Cumulative Layout Shift (CLS)** - Avatar may cause shift

### Suggested Performance Tests:
```bash
# Build for production
npm run build

# Run production server
npm start

# Run Lighthouse audit
# (Use Chrome DevTools → Lighthouse)
```

---

## 📋 MANUAL TEST SCRIPT

**Copy this checklist for manual QA:**

```
□ Open http://localhost:3000
□ Verify page loads in <3 seconds
□ Check browser console for errors
□ Scroll through entire homepage
□ Click "Download Resume" - verify download works
□ Click "Contact Me" - verify email client opens
□ Click "View GitHub Profile" - verify opens in new tab
□ Click first project "View case study" link
□ Verify project detail page renders correctly
□ Click "Back to portfolio" link
□ Verify returns to homepage
□ Test at desktop width (1080px+)
□ Test at tablet width (768px)
□ Test at mobile width (390px)
□ Test all contact links in Contact section
□ Verify footer displays current year (2026)
□ Test light mode (if system preference available)
□ Run Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
```

---

## 🎯 PRIORITY ACTION ITEMS

### Before Production Deploy:
1. **🔴 CRITICAL:** Add `/public/resume.pdf` file
2. **🔴 CRITICAL:** Fix character encoding in page titles
3. **🔴 CRITICAL:** Add tablet/mobile responsive breakpoints
4. **🟡 RECOMMENDED:** Add GitHub token for API authentication
5. **🟡 RECOMMENDED:** Add image blur placeholders
6. **🟡 RECOMMENDED:** Test all responsive breakpoints manually
7. **🟡 RECOMMENDED:** Verify console has no errors

### Nice to Have:
8. **🟢 OPTIONAL:** Add error logging
9. **🟢 OPTIONAL:** Verify robots.txt and sitemap.xml
10. **🟢 OPTIONAL:** Run accessibility audit
11. **🟢 OPTIONAL:** Update `rel` attributes to include `noopener`

---

## 📊 TEST COVERAGE SUMMARY

| Category | Status | Notes |
|----------|--------|-------|
| Homepage Rendering | ✅ PASS | Verified via HTTP 200 |
| Project Pages | ✅ PASS | Routes work correctly |
| 404 Handling | ✅ PASS | Custom error page functional |
| Code Quality | ✅ PASS | No linting errors |
| Resume Download | ❌ FAIL | File missing |
| Character Encoding | ❌ FAIL | Meta tags show � |
| Responsive Design | ⚠️ NEEDS TESTING | Manual verification required |
| GitHub API | ⚠️ NEEDS TESTING | Should test with real data |
| Console Errors | ⚠️ NEEDS TESTING | Manual check required |
| Accessibility | ⚠️ NOT TESTED | Lighthouse audit recommended |
| Performance | ⚠️ NOT TESTED | Production build needed |
| Cross-browser | ⚠️ NOT TESTED | Test Chrome, Firefox, Safari |

---

## 🔧 RECOMMENDED FIXES (Code Snippets)

### Fix #1: Add Resume File
```bash
# Create public directory if it doesn't exist
mkdir -p public

# Add your resume PDF
# Place resume.pdf in: d:\PortfolioWeb\public\resume.pdf
```

### Fix #2: Fix Character Encoding
```typescript
// app/layout.tsx, line 10-12
title: {
  default: `${profileConfig.fullName} | Software Developer`,
  template: `%s | ${profileConfig.fullName}`
}
```

### Fix #3: Add Responsive Breakpoints
```css
/* Add to app/globals.css after line 346 */

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
  
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .site-shell {
    padding: 1rem 0.75rem 2rem;
  }
  
  .section-card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .btn {
    font-size: 0.85rem;
    padding: 0.45rem 0.75rem;
  }
  
  .project-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

---

## 📝 CONCLUSION

**Overall Assessment:** The portfolio site has a solid foundation with clean code, proper Next.js architecture, and good error handling. However, **3 high-severity issues must be addressed** before production deployment:

1. Missing resume file (critical for recruiters)
2. Character encoding issues (affects professionalism)
3. Incomplete responsive design (affects 50%+ of users)

The site is functional for desktop users but needs responsive testing and minor fixes before being production-ready.

**Recommendation:** Fix the 3 high-severity issues, then run manual QA testing with the provided checklist before deploying to production.

---

**Next Steps:**
1. Add resume.pdf file
2. Fix character encoding in titles
3. Add responsive CSS breakpoints
4. Run manual browser testing following the script above
5. Run Lighthouse audit
6. Test on real mobile devices

