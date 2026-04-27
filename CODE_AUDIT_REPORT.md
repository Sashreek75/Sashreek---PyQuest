# PyQuest React Application - Comprehensive Code Audit

**Audit Date:** April 10, 2026  
**Total Issues Found:** 35  
**Critical Issues:** 7 | **High:** 9 | **Medium:** 7 | **Low:** 12

---

## 🚨 CRITICAL SEVERITY (Blocking Core Functionality)

### 1. ModuleCard Navigation Link - BROKEN
**File:** [src/components/learning/ModuleCard.jsx](src/components/learning/ModuleCard.jsx#L25)  
**Severity:** CRITICAL  
**Issue:** Button always navigates to `/modules` instead of specific lesson
```jsx
// WRONG - Line 25
<Link to={isLocked ? '#' : `/modules`}>
```
**Expected:** 
```jsx
<Link to={isLocked ? '#' : `/modules/${module.id}/lesson/${module.lessons?.[0]?.id || 'intro'}`}>
```
**Impact:** Users cannot access any lessons. Core navigation broken.

---

### 2. Empty Lessons Data in modules.json
**File:** [src/data/modules.json](src/data/modules.json#L14)  
**Severity:** CRITICAL  
**Issue:** All modules have empty `lessons: []` array
```json
"lessons": []
```
**Impact:** LessonViewer crashes when accessing `module.lessons[0]`. LessonViewer page is completely unusable.  
**Lines Affected:** All module objects in modules.json

---

### 3. LearningContext - submitQuiz Race Condition
**File:** [src/context/LearningContext.jsx](src/context/LearningContext.jsx#L94-L106)  
**Severity:** CRITICAL  
**Issue:** Quiz submission crashes if module never started (prev[moduleId] undefined)
```jsx
const submitQuiz = (moduleId, score) => {
    setProgress(prev => ({
        ...prev,
        [moduleId]: {
            ...prev[moduleId],  // UNDEFINED if module never accessed
            quizScore: score,
            isCompleted: score >= 75
        }
    }));
};
```
**Impact:** App crashes on quiz submission for any module user hasn't started.  
**Fix:** Initialize default progress object before spreading

---

### 4. UserContext - Unsafe localStorage Parsing
**File:** [src/context/UserContext.jsx](src/context/UserContext.jsx#L6-L18)  
**Severity:** CRITICAL  
**Issue:** No try-catch for JSON.parse()
```jsx
const userData = saved ? JSON.parse(saved) : {};  // Can throw SyntaxError
```
**Impact:** Corrupted localStorage data crashes app on startup  
**Fix:** Wrap in try-catch block

---

### 5. AuthContext - Missing Error Validation
**File:** [src/context/AuthContext.jsx](src/context/AuthContext.jsx#L21-34)  
**Severity:** CRITICAL  
**Issue:** No validation for empty/invalid credentials
```jsx
const login = (email, password) => {
    return new Promise((resolve) => {  // No error handling
        setTimeout(() => {
            const fakeUser = { ... };  // No validation of email/password
            resolve(fakeUser);
        }, 800);
    });
};
```
**Impact:** Invalid login attempts silently pass through. No feedback to user.  
**Fix:** Add validation and reject promise on invalid input

---

### 6. TheOracle XSS Vulnerability - dangerouslySetInnerHTML
**File:** [src/components/ui/TheOracle.jsx](src/components/ui/TheOracle.jsx#L65-71)  
**Severity:** CRITICAL  
**Issue:** Using dangerouslySetInnerHTML with potentially unsafe content
```jsx
const processedLine = line
    .replace(/\*\*(.*?)\*\*/g, '<strong class="...">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em ...>$1</em>');

return (
    <p key={i} dangerouslySetInnerHTML={{ __html: processedLine }} />  // XSS vector
);
```
**Impact:** If AI API returns malicious content, XSS attack possible.  
**Fix:** Use proper markdown library (e.g., react-markdown) instead of dangerouslySetInnerHTML

---

### 7. LessonViewer - Missing useEffect Dependency
**File:** [src/pages/LessonViewer.jsx](src/pages/LessonViewer.jsx#L74-84)  
**Severity:** CRITICAL  
**Issue:** Dependency array includes `getModuleProgress` which is recreated each render
```jsx
useEffect(() => {
    const progress = getModuleProgress(moduleId);
    if (progress?.completedLessons?.includes(lessonId)) {
        setLessonCompleted(true);
    } else {
        setLessonCompleted(false);
    }
}, [lessonId, moduleId, getModuleProgress]);  // getModuleProgress is a new function every render!
```
**Impact:** useEffect runs infinitely or doesn't run when needed. Lesson completion status never updates.  
**Fix:** Wrap getModuleProgress in useCallback or remove from dependencies

---

## ⚠️ HIGH SEVERITY (Data Corruption/Crashes)

### 8. LearningContext - completeLesson Null Issue
**File:** [src/context/LearningContext.jsx](src/context/LearningContext.jsx#L76-88)  
**Issue:** Doesn't initialize undefined module progress
```jsx
const completeLesson = (moduleId, lessonId) => {
    setProgress(prev => {
        const moduleProgress = prev[moduleId] || { completedLessons: [], quizScore: null, isCompleted: false };
        if (!moduleProgress.completedLessons.includes(lessonId)) {
            return {
                ...prev,
                [moduleId]: {
                    ...moduleProgress,
                    completedLessons: [...moduleProgress.completedLessons, lessonId]
                }
            };
        }
        return prev;
    });
};
```
**Problem:** Module progress object might not be fully initialized with all properties
**Impact:** Lesson tracking could fail silently

---

### 9. ModuleCatalog - userProgress Undefined
**File:** [src/pages/ModuleCatalog.jsx](src/pages/ModuleCatalog.jsx#L43-49)  
**Issue:** userProgress could be undefined
```jsx
const completedModules = modules.filter(m => userProgress?.[m.id]?.completed);
const inProgressModules = modules.filter(m =>
    userProgress?.[m.id]?.progress > 0 && !userProgress?.[m.id]?.completed
);
```
**Impact:** Stats display might be incorrect or crash in getFilteredModules logic where `userProgress?.[a.id]?.progress` is accessed

---

### 10. Dashboard - getModuleProgress Not Safe
**File:** [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx#L28-30)  
**Issue:** activeModule.lessons could be empty array
```jsx
const activeModule = modules.find(m => m.id === 'intro-python') || modules[0];
const progress = getModuleProgress(activeModule.id);
const percentComplete = Math.round((progress.completedLessons.length / Math.max(activeModule.lessons.length, 1)) * 100);
```
**Impact:** Shows 0% progress and breaks sync indicator  
**Also:** If no module with _id === 'intro-python' exists, falls back to modules[0] - assuming modules array isn't empty

---

### 11. aiAssistant - JSON Parse Error
**File:** [src/utils/aiAssistant.js](src/utils/aiAssistant.js#L305-310)  
**Issue:** JSON.parse without try-catch
```jsx
const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
return JSON.parse(cleanText);  // Can throw SyntaxError
```
**Impact:** Code profiler crashes if API returns invalid JSON  
**Fix:** Wrap in try-catch block

---

### 12. ProfilePage - Avatar Upload No Size Validation
**File:** [src/pages/ProfilePage.jsx](src/pages/ProfilePage.jsx#L33-46)  
**Issue:** No file size limit on avatar upload
```jsx
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser(prev => ({ ...prev, avatarUrl: reader.result }));
        };
        reader.readAsDataURL(file);  // No size check!
    }
};
```
**Impact:** Large files could freeze browser or exceed localStorage 5MB limit  
**Fix:** Add file size validation (max 5MB)

---

### 13. ChallengesPage - Unbounded Array Growth
**File:** [src/pages/ChallengesPage.jsx](src/pages/ChallengesPage.jsx#L158-165)  
**Issue:** Challenge generation prepends to array without limit
```jsx
setChallenges([newChallenge, ...challenges]);  // Array grows infinitely
setIsGenerating(false);
```
**Impact:** Memory leak as user generates challenges, page gets slower  
**Fix:** Add size limit or clear old challenges when limit reached

---

### 14. CodeEditor - No Error Boundary
**File:** [src/components/learning/CodeEditor.jsx](src/components/learning/CodeEditor.jsx#L1-89)  
**Issue:** Monaco Editor could crash without error handling
**Impact:** One editor error crashes entire page  
**Fix:** Wrap in error boundary or add try-catch around Monaco initialization

---

### 15. OnboardingPage - Redirects Returning Users But Doesn't Check Auth
**File:** [src/pages/OnboardingPage.jsx](src/pages/OnboardingPage.jsx#L17-24)  
**Issue:** Redirects based on localStorage without validating user is authenticated
```jsx
useEffect(() => {
    const onboarded = localStorage.getItem('pyquest_onboarding');
    if (onboarded) {
        navigate('/dashboard');  // What if auth is invalid?
    }
}, [navigate]);
```
**Impact:** Could redirect to dashboard even if user isn't logged in  
**Fix:** Check both localStorage AND AuthContext

---

### 16. SkillDiagnostics - Potential NaN
**File:** [src/components/dashboard/SkillDiagnostics.jsx](src/components/dashboard/SkillDiagnostics.jsx#L42-43)  
**Issue:** Could result in NaN if skills array is empty
```jsx
const overallScore = Math.round(displaySkills.reduce((acc, s) => acc + s.value, 0) / displaySkills.length);
// If displaySkills.length === 0, results in 0/0 = NaN (though unlikely with default skills)
```
**Impact:** Score display shows "NaN" in edge case  
**Fix:** Add explicit check

---

## 🟡 MEDIUM SEVERITY (Reliability & Performance)

### 17. No Error Boundaries in App
**File:** [src/App.jsx](src/App.jsx), [src/components/layout/Layout.jsx](src/components/layout/Layout.jsx)  
**Issue:** No React Error Boundary component
**Impact:** Any component error in subtree crashes entire app  
**Fix:** Implement error boundary HOC for routes and major sections

---

### 18. LessonViewer - Overly Complex Validation Logic
**File:** [src/pages/LessonViewer.jsx](src/pages/LessonViewer.jsx#L106-126)  
**Issue:** Fragile conditional logic for code validation
```jsx
const isMatch = normalizedUser.includes(normalizedValid) || 
                (output && validation.includes('print') && normalize(output).includes(normalize(validation.match(/print\(['"](.+)['"]\)/)?.[1] || "___")));
```
**Impact:** Flaky validation that might pass/fail inconsistently. Hard to debug.  
**Fix:** Extract to separate testable validation function

---

### 19. Missing Loading States
**File:** [src/pages/LessonViewer.jsx](src/pages/LessonViewer.jsx), [src/pages/ProfilePage.jsx](src/pages/ProfilePage.jsx)  
**Issue:** Some async operations don't show loading indicator
**Impact:** UX uncertainty - user doesn't know if clicking worked  
**Recommendation:** Add loading indicators for all async operations

---

### 20. LocalStorage Without Cleanup/Expiry
**File:** Multiple files (UserContext, LearningContext, ProfilePage, TheOracle)  
**Issue:** All data persisted to localStorage but never expires or cleans up
**Impact:** Old stale data persists indefinitely, could consume significant storage  
**Recommendation:** Add timestamps and cleanup logic (e.g., expire after 30 days)

---

### 21. ProgressBar - Invalid Color Handling
**File:** [src/components/gamification/ProgressBar.jsx](src/components/gamification/ProgressBar.jsx#L22-27)  
**Issue:** If color prop doesn't exist in colors object, no gradient applied
```jsx
const colors = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    warning: 'bg-gradient-to-r from-orange-500 to-amber-500'
};
// If colors[color] undefined, empty string class name
```
**Impact:** Progress bar invisible if wrong color passed (silently fails)  
**Fix:** Add default fallback color

---

### 22. Missing Accessibility (a11y) Labels
**File:** Multiple components  
**Issue:** Missing aria-labels on interactive elements
```jsx
<button onClick={handleSubmit}>  // No aria-label
<div role="img">...</div>  // Missing aria-label
```
**Impact:** Screen reader users can't navigate  
**Recommendation:** Add comprehensive aria-labels and semantic HTML

---

### 23. Unused Dependencies in Exports
**File:** [src/utils/aiAssistant.js](src/utils/aiAssistant.js#L1-2)  
**Issue:** Imports modules and challenges but never fully uses them
```jsx
import modules from '../data/modules.json';
import challenges from '../data/challenges.json';
// Only used in getPyQuestContext which is called sparingly
```
**Impact:** Unnecessary bundle size  
**Recommendation:** Remove if not needed or lazy load

---

## 🟢 LOW SEVERITY (UX/Maintainability)

### 24. Duplicate ModuleCard Components  
**Files:** 
- [src/components/learning/ModuleCard.jsx](src/components/learning/ModuleCard.jsx)
- [src/components/modules/ModuleCard.jsx](src/components/modules/ModuleCard.jsx)

**Issue:** Two nearly identical ModuleCard implementations with different APIs
**Impact:** Maintenance nightmare - bug fix in one doesn't apply to other  
**Recommendation:** Consolidate into single component with consistent API

---

### 25. codeRunner.js - Mock Implementation Too Limited
**File:** [src/utils/codeRunner.js](src/utils/codeRunner.js#L21-47)  
**Issue:** Only mocks specific print statements, most code returns generic message
```jsx
return { code, output: ">>> Script execution completed.\n(Output simulation limited in demo mode)", error: null };
```
**Impact:** Users can't test actual code logic  
**Recommendation:** 
- Use Pyodide for real Python execution, or
- Add clear warning that code execution is simulated

---

### 26. modules_old.json Should Be Deleted
**File:** [src/data/modules_old.json](src/data/modules_old.json)  
**Issue:** Two module files cause confusion
**Recommendation:** Confirm modules.json is authoritative and delete modules_old.json

---

### 27. Streak Calculation - DST Edge Case
**File:** [src/context/UserContext.jsx](src/context/UserContext.jsx#L43-56)  
**Issue:** Local date comparison might fail during DST transitions
```jsx
const today = new Date().toDateString();
const lastLogin = new Date(user.lastLogin).toDateString();
if (today !== lastLogin) {
    const isConsecutive = new Date(Date.now() - 86400000).toDateString() === lastLogin;
```
**Impact:** Streak resets incorrectly during DST change  
**Recommendation:** Use UTC dates instead of local dates

---

### 28. TheOracle - Chat History Unbounded
**File:** [src/components/ui/TheOracle.jsx](src/components/ui/TheOracle.jsx#L16-22)  
**Issue:** Chat history never cleared between sessions
```jsx
const [history, setHistory] = useState([
    { role: 'oracle', content: "Welcome, Architect. ..." }
]);
// Grows infinitely in long chat sessions
```
**Impact:** Memory leak in extended chat sessions  
**Fix:** Add conversation reset button or clear old messages after 50+ turns

---

### 29. LoginPage/SignupPage - Weak Validation
**File:** [src/pages/LoginPage.jsx](src/pages/LoginPage.jsx#L33-50), [src/pages/SignupPage.jsx](src/pages/SignupPage.jsx#L22-44)  
**Issue:** Only HTML5 required validation, no custom validation
```jsx
<input type="email" required ... />
<input type="password" required ... />
```
**Impact:** Poor UX - no helpful error messages  
**Recommendation:** Add client-side validation (email format, password strength)

---

### 30. Magic Strings Throughout Codebase
**File:** Multiple files  
**Issue:** Hard-coded values: 'intro-python', 'badge-mastery', 'pyquest_progress', 'pyquest_user', 'pyquest_badges', etc.
**Impact:** Hard to refactor, changes needed in multiple places  
**Recommendation:** Extract to constants file (`src/constants.js`)

---

### 31. No Rate Limiting on API Calls  
**File:** [src/utils/aiAssistant.js](src/utils/aiAssistant.js)  
**Issue:** Multiple rapid API calls not throttled
**Impact:** Could exceed Gemini API quota or rate limits  
**Recommendation:** Add debounce/throttle on Chat submit and Code profiler

---

### 32. Inconsistent Error Messages
**File:** Multiple files  
**Issue:** Some errors log detailed info, others are silent
```jsx
console.error("Login failed", error);  // Too vague
console.error('Oracle API Error:', error);  // Better
// Missing error handling in many async operations
```
**Impact:** Hard to debug issues in production  
**Recommendation:** Implement consistent error logging strategy

---

### 33. Missing PropTypes (No Type Checking)
**File:** All components  
**Issue:** No PropTypes or TypeScript validation
**Impact:** Hard to catch bugs, limited IDE support, poor dev experience  
**Recommendation:** 
- Add PropTypes to all components (short-term)
- Migrate to TypeScript (long-term)

---

### 34. Forgotten TODO Comments
**File:** [src/components/learning/ModuleCard.jsx](src/components/learning/ModuleCard.jsx#L8)  
**Issue:** `// TODO: Implement locking logic based on prerequisites`
**Impact:** Locking never implemented - all modules always accessible  
**Recommendation:** Either implement or remove comment

---

### 35. TheOracle Settings Doesn't Provide Feedback
**File:** [src/components/ui/TheOracle.jsx](src/components/ui/TheOracle.jsx#L34-36)  
**Issue:** No success/error feedback when saving API key
```jsx
const handleSaveKey = () => {
    localStorage.setItem('PYQUEST_ORACLE_KEY', apiKeyInput);
    setShowSettings(false);  // No feedback
};
```
**Impact:** User doesn't know if save succeeded  
**Recommendation:** Add toast notification or success message

---

## 📊 PRIORITY ACTION PLAN

### Phase 1 - MUST FIX (Do First - 30 minutes)
1. **Fix ModuleCard link** - Users can't navigate
2. **Fix empty lessons array** - LessonViewer is broken
3. **Add error boundaries** - Prevent crash cascade
4. **Fix JSON parse errors** - Prevent crashes on startup
5. **Fix XSS vulnerability** - Replace dangerouslySetInnerHTML

### Phase 2 - SHOULD FIX (Next - 1 hour)
6. Fix submitQuiz race condition
7. Fix UserContext localStorage parsing
8. Fix useEffect dependencies in LessonViewer
9. Add file size validation
10. Fix OnboardingPage auth check

### Phase 3 - NICE TO HAVE (Polish - 2+ hours)
11. Consolidate duplicate ModuleCard
12. Add PropTypes/TypeScript
13. Remove magic strings to constants
14. Implement proper error boundaries
15. Add rate limiting to API calls

---

## 📝 TESTING RECOMMENDATIONS

**Unit Tests Needed:**
- `completeLesson()` - test with undefined module progress
- `submitQuiz()` - test with missing module
- Validation logic in LessonViewer
- Progress calculations

**Integration Tests:**
- Login → Onboarding → Dashboard flow
- Module progression with prerequisites
- Lesson completion tracking
- Avatar upload edge cases

**Manual Testing:**
- Test with corrupted localStorage
- Test with missing modules.json data  
- Test 100+ challenges generation
- Test with large avatar file (>10MB)

---

## 📚 REFERENCES & EXAMPLES

For error boundaries, see:
```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}
```

For file validation:
```jsx
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
if (file.size > MAX_FILE_SIZE) {
  alert('File too large. Max 5MB.');
  return;
}
```

---

**Report Generated:** April 10, 2026  
**Total Review Time:** Comprehensive analysis  
**Next Review:** After implementing Phase 1 fixes
