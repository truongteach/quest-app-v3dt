
# DNTRNG™ - Technical Standard & Protocols (v18.9)

## 1. Stack Overview
*   **Framework**: Next.js 15 (App Router) with React 19 for high-performance rendering.
*   **Desktop Node**: Electron with `electron-builder` for cross-platform distribution.
*   **Language**: TypeScript (Strict Mode) for type safety across assessment modules.
*   **Registry (Database)**: Google Sheets™ via the **Registry Bridge Protocol v18.5** (Google Apps Script).
*   **Styling**: Tailwind CSS with Shadcn UI for a premium, professional interface.
*   **AI Engine**: Genkit with Google AI (Gemini 2.5 Flash) for intelligent assessment parsing.
*   **State Management**: React Context (`auth-context`, `language-context`) for global identity and region settings.

## 2. Code Organization Rules

### File Size Limits
*   **Components**: Must not exceed 300 lines.
*   **Pages**: Must not exceed 400 lines.
*   **Utility Files**: Must not exceed 200 lines.
*   *If a file exceeds these limits, it must be split into sub-modules before commitment.*

### Mandatory File Header Comments
Every file must include a documentation block at the very top using the following format:

**Components:**
```ts
/**
 * [ComponentName].tsx
 * 
 * Purpose: 1-2 sentence description.
 * Used by: [List parent components/pages]
 * Props:
 *   - propName: type — description
 * Notes: [Context, gotchas, or dependencies]
 */
```

**Hooks:**
```ts
/**
 * [useName].ts
 * 
 * Purpose: What the hook does.
 * Returns: Description of return value.
 * Used by: [List components]
 */
```

### Component Architecture
*   **One component per file**: Export as default.
*   **Extraction Rule**: If a JSX block is reused or exceeds 50 lines of static markup, extract to a sub-component.
*   **Types**: All props must be defined via a TypeScript interface directly above the component.
*   **Clean JSX**: No inline anonymous functions longer than 3 lines. Use named handlers.

### Hook Rules
*   Location: All custom hooks must reside in `src/hooks/`.
*   Naming: Must start with the `use` prefix.
*   Single Responsibility: Each hook should manage one distinct logical stream.

### Inline Documentation
*   Add comments above logic that is not self-explanatory.
*   **WORKAROUND**: Use `// WORKAROUND: [reason]` for non-standard implementations.
*   **TODO**: Use `// TODO: [description]` for incomplete features.
*   **GAS**: Use `// GAS: [action_name]` above every fetch call to the registry bridge.

## 3. Folder Structure Rules
*   `src/app`: Routing and page-level logic (kebab-case).
*   `src/components/[category]`: React components (PascalCase).
    *   `/ui`: Atomic Shadcn components.
    *   `/admin`: Administrative control modules.
    *   `/quiz`: Assessment interaction modules.
*   `src/context`: Global React Context providers.
*   `src/lib`: Core utilities, security hashing, and `api-config.ts`.
*   `src/types`: Shared TypeScript interfaces.
*   **Naming**: Files and variables use `camelCase`; Components use `PascalCase`; Constants use `SCREAMING_SNAKE_CASE`.

## 4. Code Style Rules
*   **Async Patterns**: Use `async/await` exclusively.
*   **Error Handling**: Use `try/catch` with `useToast`.
*   **Icons**: Use `lucide-react`.

## 5. Registry (Database) Rules
*   **Centralization**: All data mutations MUST flow through `API_URL` in `src/lib/api-config.ts`.
*   **Integrity**: Preserve existing registry values if fields are left blank.

## 6. GAS Management
*   Live code: `src/lib/gas/latest.ts`.
*   Backup versions: `src/lib/gas/versions/vX.ts`.
*   Every change to `latest.ts` requires a version increment and entry in `CHANGELOG.md`.
