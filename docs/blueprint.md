# **App Name**: QuestFlow

## Core Features:

- Dynamic Question Rendering: Fetches and dynamically renders various question types, including Single Choice, Multiple Choice, Short Text, Rating, Dropdown, True/False, Ordering, Matching, and Hotspot, based on data retrieved from Google Sheets.
- Interactive Quiz/Survey Navigation: Provides a smooth, guided flow between questions, complete with a visual progress indicator and front-end validation of user input before proceeding or submission.
- Response Submission & Storage: Collects all user responses and securely submits them via the Google Apps Script API to be stored in a designated Google Sheet.
- Detailed Results and Review: After submission, displays the user's score (if applicable) and a comprehensive review screen, clearly indicating correct versus incorrect answers with specific positional or paired feedback for ordering and matching questions.
- Google Apps Script Backend API: Integrates a custom Google Apps Script Web App that serves as a REST API to dynamically fetch quiz questions and securely receive and record user answers in Google Sheets.
- Adaptive & Responsive Design: Ensures a clean, modern, and intuitive user interface that is fully responsive and optimized for a seamless experience across desktop and all mobile devices.

## Style Guidelines:

- Primary color: A clear, thoughtful blue (#366DC7) to convey knowledge and stability. It provides strong contrast for text and interactive elements on a light background.
- Background color: A subtle, desaturated light blue (#E8EEF5) derived from the primary hue, providing a clean and non-distracting canvas that enhances readability.
- Accent color: A vibrant yet calm sky blue (#40B0DA) chosen to be analogous to the primary, used sparingly for call-to-action buttons, highlights, and critical feedback.
- Headline and body font: 'Inter' (sans-serif) for its neutral, modern, and highly legible design, ensuring clarity for all question text and responses across different screen sizes.
- Utilize simple, clean vector icons for navigation, progress indicators, and feedback (e.g., checkmarks, crosses), ensuring they are easily understood and consistent with the modern design.
- Emphasize a mobile-first, single-column layout for question presentation, adapting to a multi-column or expanded view on larger screens. Maintain clear spacing and hierarchy for question elements.
- Implement subtle, smooth transitions when navigating between questions, displaying progress updates, and indicating interactive element states to enhance user engagement without being distracting.