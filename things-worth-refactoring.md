## Things Worth Refactoring / Reusing

### 1. Schema Validation with Zod

- **Current**: Clerk handles auth, but no input validation layer... yet.
- **Refactor**: Bring in `zod` again for validating user input in actions and routes.
- **Bonus**: Use `zod-error` or a similar error formatter like in your e-commerce project.

### 2. Server Action Patterns

- **Current**: Actions directly interact with the database.
- **Refactor**: Wrap actions with reusable try/catch logic and standardize return formats.
- **Bonus**: Consider a `safeActionWrapper()` that logs + formats errors consistently.

### 3. Centralized Error Handling

- **Current**: Ad-hoc try/catch blocks or none at all.
- **Refactor**: Create a shared `handleError()` function for logging and user-facing messages.

### 4. Types & API Contracts

- **Current**: Relying on Prisma types and inference.
- **Refactor**: Export shared types (e.g., `PostWithUser`, `PaginatedFeedResult`) from a central `types.ts`.
- **Bonus**: Use Zod's `.infer<typeof schema>` for safety.

### 5. Folder Structure

- **Current**: All logic close to routes/components.
- **Refactor**: Organize by domain (`features/feed`, `features/auth`, `features/profile`) or function.
- **Bonus**: Co-locate Zod schemas, handlers, and actions together.

### 6. Media Upload Utilities

- **Current**: ImageKit is used directly in upload logic.
- **Refactor**: Create `lib/imagekit.ts` to encapsulate config, upload, delete, transform.
- **Bonus**: Adds testability and separates logic from UI.

### 7. Pagination Abstractions

- **Current**: Infinite scroll logic repeated in routes/actions.
- **Refactor**: Create utility like `paginatePrisma()` to DRY up take/skip + hasMore logic.

### 8. Reusable Components

- **Refactor**: Abstract patterns like `PostCard`, `LikeButton`, `CommentBox`.
- **Bonus**: Add loading skeletons with `react-content-loader` or similar.

### 9. Analytics / Logging

- **Current**: None (yet).
- **Refactor**: Add basic event logging to uploads, errors, sign-ins (even with `console.log()` for now).
