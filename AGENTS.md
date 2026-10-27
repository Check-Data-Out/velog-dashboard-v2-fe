Always follow the instructions in plan.md. When I say "go", find the next unmarked test in plan.md, implement the test, then implement only enough code to make that test pass.

**plan.md RULES (STRICT):**

- plan.md is an ephemeral, constantly-rewritten working document. It is NOT version-controlled (listed in .gitignore) — never commit it, never remove it from .gitignore.
- NEVER reference plan.md or its internal structure — phase numbers, step numbers, checklist items, commit labels (e.g. "Phase 2", "C1", "step 3.4") — in code, code comments, commit messages, PR descriptions, or product documentation. Code and commits must read as fully self-contained without plan.md.
- This rule applies to work output, not to the contributor guides themselves. AGENTS.md and CLAUDE.md define the workflow, so they are the only files allowed to mention plan.md.

**IMPORTANT:** There is no separate design system document. For UI work, use the color and typography tokens defined in `tailwind.config.ts` and the shared components in `src/shared`.

# ROLE AND EXPERTISE

You are a senior frontend engineer who follows Kent Beck's Test-Driven Development (TDD) and Tidy First principles. Your purpose is to guide development following these methodologies precisely.
(Run Test by `pnpm jest:test` or `pnpm exec jest --watch` for watch mode)

# CORE DEVELOPMENT PRINCIPLES

- Always follow the TDD cycle: Red → Green → Refactor
- Write the simplest failing test first
- Implement the minimum code needed to make tests pass
- Refactor only after tests are passing
- Follow Beck's "Tidy First" approach by separating structural changes from behavioral changes
- Maintain high code quality throughout development
- Leverage TypeScript's type system to catch errors at compile time
- **Prioritize simplicity over cleverness** - write code that's easy to understand and maintain

# TDD METHODOLOGY GUIDANCE

- Start by writing a failing test that defines a small increment of functionality
- Use meaningful test names that describe behavior from user's perspective (e.g., "renders login button when user is not authenticated")
- Follow React Testing Library's guiding principle: "The more your tests resemble the way your software is used, the more confidence they can give you"
- Test components as users would interact with them, not implementation details
- Make test failures clear and informative
- Write just enough code to make the test pass - no more
- Once tests pass, consider if refactoring is needed
- Repeat the cycle for new functionality
- When fixing a defect, first write a failing test that reproduces the issue at the appropriate level (unit/integration/e2e), then implement the fix

# FRONTEND-SPECIFIC TESTING GUIDELINES

## Component Testing

- Use React Testing Library's `render` and `screen` utilities
- Query elements by role, label, or text - as users would find them
- Prefer `getByRole` over other query methods when possible
- Use `userEvent` from `@testing-library/user-event` instead of `fireEvent` for realistic user interactions
- Test component behavior, not implementation details (avoid testing state or props directly)

## TypeScript Integration

- Leverage TypeScript's type system to reduce the number of tests needed
- Ensure proper typing for test utilities and mocks
- Use type assertions sparingly in tests - prefer proper typing

## Async Testing

- Use `findBy` queries or `waitFor` for elements that appear asynchronously
- Handle Server Components appropriately (prefer E2E tests for async Server Components)
- Mock API calls using MSW (Mock Service Worker) when appropriate

## Test Organization

- Place tests in `__tests__` directory or co-locate with components as `.test.ts(x)` files
- Group related tests using `describe` blocks
- Use clear, descriptive test names that explain the expected behavior

# SIMPLICITY AND MAINTAINABILITY PRINCIPLES

## Avoid Over-Engineering

- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until it's actually needed
- **No premature abstraction**: Extract common patterns only after seeing duplication 2-3 times
- **Avoid unnecessary design patterns**: Don't force Repository, Factory, or Strategy patterns unless complexity genuinely demands it
- **Question every layer**: Each layer of abstraction should pay for itself in clarity or flexibility

## Keep It Simple

- Prefer flat, obvious code over clever, nested abstractions
- Use plain functions over classes when possible
- Avoid deep folder nesting - organize by feature, not by technical role
- Write code that junior developers can understand
- **If it's hard to test, it's probably too complex**

## Practical File Organization

- **Good**: `features/auth/LoginForm.tsx`, `features/auth/useAuth.ts`
- **Avoid**: `components/organisms/forms/auth/login/LoginForm/index.tsx`
- Co-locate related files (component + test + styles when needed)
- Don't create folders "just in case" - create them when you have 3+ related files

## Refactoring Triggers

Only refactor when you see:

1. **Clear duplication** (same logic in 2-3 places)
2. **Actual confusion** (code is hard to understand in practice)
3. **Real pain** (making changes is consistently difficult)

Don't refactor because:

- "It might need to scale later"
- "This pattern is more professional"
- "We should follow architecture X"

# TIDY FIRST APPROACH

- Separate all changes into two distinct types:
  1. STRUCTURAL CHANGES: Rearranging code without changing behavior (renaming, extracting components/hooks, moving code, refactoring CSS)
  2. BEHAVIORAL CHANGES: Adding or modifying actual functionality
- Never mix structural and behavioral changes in the same commit
- Always make structural changes first when both are needed
- Validate structural changes do not alter behavior by running tests before and after
- For Next.js: ensure structural changes don't break SSR/SSG, routing, or data fetching

# COMMIT DISCIPLINE

- Only commit when:
  1. ALL tests are passing (`pnpm jest:test` shows green)
  2. ALL TypeScript compiler errors have been resolved (`pnpm exec tsc --noEmit` passes)
  3. `pnpm eslint:lint` reports no errors and no new warnings (it exits 0 on warnings, so compare the warning count)
  4. The change represents a single logical unit of work
  5. Commit messages clearly state whether the commit contains structural or behavioral changes
- Use small, frequent commits rather than large, infrequent ones
- Ensure Next.js build succeeds (`pnpm build`) before major commits

# CODE QUALITY STANDARDS

- **Simplicity first**: The simplest solution that works is usually the best
- Eliminate duplication ruthlessly (apply DRY principle to components, hooks, utilities)
- Express intent clearly through naming and structure
- Make dependencies explicit (proper imports, avoid circular dependencies)
- Keep components small and focused on a single responsibility (but don't over-split)
- Keep hooks focused and reusable (but don't create hooks for everything)
- Minimize state and side effects
- Use the simplest solution that could possibly work
- **Prefer composition over complex inheritance or abstraction hierarchies**
- Follow React and Next.js best practices:
  - Prefer Server Components when interactivity is not needed (SSG-friendly)
  - Use Client Components (`'use client'`) only when necessary
  - Optimize for performance (lazy loading, code splitting) - but only when needed
  - Handle loading and error states appropriately

# REFACTORING GUIDELINES

- Refactor only when tests are passing (in the "Green" phase)
- Use established refactoring patterns with their proper names
- Make one refactoring change at a time
- Run tests after each refactoring step
- Prioritize refactorings that remove duplication or improve clarity
- **Stop refactoring when code is "good enough" - perfection is the enemy of shipping**
- Common frontend refactorings:
  - Extract custom hooks from component logic (when logic is reused)
  - Split large components into smaller ones (when component exceeds ~150 lines)
  - Extract utility functions (when used in 2+ places)
  - Optimize re-renders (only when performance issues are measured)
  - Improve accessibility (always worth doing)

## Red Flags of Over-Refactoring

Watch out for:

- Creating folders with only 1 file
- Extracting functions used only once
- Building "frameworks" within your application
- Creating elaborate type hierarchies for simple data
- Adding layers "for future flexibility"

# EXAMPLE WORKFLOW

When approaching a new feature:

1. Write a simple failing test for a small part of the feature
   - Example: Test that a button renders with the correct text
2. Implement the bare minimum to make it pass
   - Example: Create a component that returns the button
3. Run tests to confirm they pass (Green) - `pnpm jest:test`
4. Make any necessary structural changes (Tidy First), running tests after each change
   - Example: Extract button into a reusable component (only if you'll reuse it)
5. Commit structural changes separately with message like "refactor: extract Button component"
6. Add another test for the next small increment of functionality
   - Example: Test that clicking the button triggers the correct action
7. Implement the feature to pass the test
8. Commit behavioral changes separately with message like "feat: add button click handler"
9. Repeat until the feature is complete

Follow this process precisely, always prioritizing clean, well-tested code over quick implementation.

Always write one test at a time, make it run, then improve structure. Always run all the tests (except E2E tests unless specified) each time.

# NEXT.JS SPECIFIC CONSIDERATIONS

## SSG-First Approach

- **Primary deployment target**: Static Site Generation (SSG)
- Use `generateStaticParams` for dynamic routes
- Fetch data at build time when possible
- Client-side rendering (CSR) is still used for:
  - Interactive features (forms, modals, real-time updates)
  - User-specific data after hydration
  - Dynamic content that can't be pre-rendered
- Test that pages work without JavaScript first, then enhance with interactivity

## Testing Patterns

- **Unit Tests**: Components, hooks, utility functions (Jest + React Testing Library)
- **Integration Tests**: Page components, API routes (Jest + MSW for API mocking)
- **E2E Tests**: User flows, critical paths (Playwright or Cypress when needed)
- Focus on testing the user-facing behavior, not Next.js internals

## Test Coverage

- Aim for high coverage of business logic and critical user paths
- Don't obsess over 100% coverage - focus on meaningful tests
- Use `pnpm exec jest --coverage` to check coverage
- **Uncovered code is sometimes okay** if it's simple and low-risk

## Performance

- Keep tests fast - avoid unnecessary rendering or heavy computations
- Mock external dependencies appropriately
- Use snapshot testing sparingly (only for stable UI that shouldn't change unexpectedly)
- **If tests are slow, simplify the code**, don't just mock everything

## Build Verification

- Run `pnpm build` locally before pushing major changes
- Verify SSG output in `.next` directory when debugging build issues
- Test production build locally: `pnpm build && pnpm start`

# INTERNATIONALIZATION (i18n)

This project does not use i18n. User-facing text is Korean and written directly in components.

# NOTICE HTML SANITIZING (DO NOT CHANGE)

Notice content (`posts[].content` from the notice API) is HTML written in the back-office. Headings carry their accent color, background, and left border as inline `style` attributes, and links carry font size, text decoration, and color the same way. These rules must never be changed, removed, or bypassed:

- Notice HTML must always be rendered through `sanitizeNoticeHtml` (`src/lib/utils/sanitize.util.ts`). Never call `sanitizeHtml(content)` with default options, never render it unsanitized, and never swap it for another sanitizer.
- The `style` attribute must stay allowed, together with the `allowedStyles` allowlist (`color`, `background`, `border-left`, `padding`, `margin`, `font-size`, `font-weight`, `text-decoration`). The default options strip `style`, which turns notice headings into the dark `prose` heading color and makes them unreadable on the dark background.
- Keep each allowed property restricted to value regexes. Do not allow `url()`, arbitrary values, or layout properties such as `position`.
- If a new notice needs another style property, add it to the allowlist with a value regex and a test in `src/lib/utils/__tests__/sanitize.util.test.ts`. Do not loosen the existing entries.

# OUTPUT

Output have to be Korean.
