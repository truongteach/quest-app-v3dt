# DNTRNG™ - Technical Standard & Protocols (v18.9.5)

## 1. Stack Overview
*   **Framework**: Next.js 15 (App Router) with React 19.
*   **Language**: TypeScript (Strict Mode).
*   **Registry (Database)**: Google Sheets™ via Registry Bridge Protocol v18.9.
*   **Real-time Protocol**: Pusher Channels for sub-second host-student synchronization.
*   **AI Engine**: Genkit with Google AI (Gemini 2.5 Flash).

## 2. Code Organization Rules

### Component Extraction Protocol (CEP)
*   **Extraction Trigger**: Any JSX block exceeding 50 lines of static markup or representing a distinct logical state (e.g., Lobby vs. Question) MUST be extracted.
*   **Location**: Reusable components reside in `src/components/`, organized by domain (e.g., `/live`, `/quiz`, `/admin`).
*   **State Management**: Complex logic (heartbeats, Pusher listeners) should remain in the parent Page, passing state/handlers as props to extracted views.

### File Size Limits
*   **Components**: Must not exceed 250 lines.
*   **Pages**: Must not exceed 350 lines.
*   **Utility Files**: Must not exceed 150 lines.

### Component Architecture
*   **One component per file**: Export as default or named per project consistency.
*   **Types**: All props must be defined via a TypeScript interface directly above the component.

## 3. Folder Structure Rules
*   `src/app`: Routing and page-level logic containers.
*   `src/components/live`: Classroom interaction modules (Lobby, QuestionView, FinalScore).
*   `src/components/quiz`: Core interaction modules (SingleChoice, MultipleChoice, etc.).
*   `src/components/admin`: Administrative management and calibration dialogs.

## 4. Content & Copy Standards
*   **Tone**: Professional, diagnostic, and intelligence-oriented.
*   **No Placeholders**: Avoid filler text ("Lorem Ipsum"), raw i18n keys, or "coming soon" labels in production code.
*   **Terminology**: 
    *   Tests -> Intelligence Modules
    *   Questions -> Steps / Nodes
    *   Leaderboard -> Standing Registry
    *   Admin -> Mission Control / Host

---
### REFACTOR LOG - 2025-05-24 (v18.9.5)
- **Extracted Live Mode UI**: Modularized host and student terminals into sub-components.
- **Content Audit**: Replaced all filler text with production-ready copy focusing on real-time classroom features.
- **Rules Update**: Formalized the Component Extraction Protocol (CEP).
