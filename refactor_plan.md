───────────────────────────────────────────────────────────────────────
                             Refactor Plan

                      1. Consolidate the Codebase

 • Current State: The project is split into multiple directories
   (backend, frontend, resume_injector), with overlapping functionality
   (e.g., PDF processing, injection, and analysis).
 • Goal: Merge all functionality into a single cohesive structure with
   a unified front-end and backend.

Proposed Structure:


 project/
 ├── app/                     # Unified application
 │   ├── backend/             # Backend services and APIs
 │   │   ├── api/             # API routes
 │   │   ├── services/        # Business logic (PDF processing, OpenAI
 integration)
 │   │   ├── utils/           # Shared utilities
 │   │   └── main.py          # FastAPI entry point
 │   ├── frontend/            # Frontend application
 │   │   ├── src/             # Source code
 │   │   │   ├── components/  # React components
 │   │   │   ├── services/    # API clients
 │   │   │   ├── styles/      # Tailwind CSS styles
 │   │   │   └── types/       # TypeScript types
 │   │   └── public/          # Static assets
 │   └── shared/              # Shared logic between frontend and
 backend
 │       ├── pdf_processing/  # PDF processing logic
 │       ├── injection/       # Prompt injection logic
 │       └── evaluation/      # Resume evaluation logic
 ├── tests/                   # Unified test suite
 │   ├── backend/             # Backend tests
 │   ├── frontend/            # Frontend tests
 │   └── integration/         # End-to-end tests
 ├── .env                     # Environment variables
 ├── package.json             # Frontend dependencies
 ├── requirements.txt         # Backend dependencies
 └── README.md                # Documentation


───────────────────────────────────────────────────────────────────────
                          2. Backend Refactor

 • Goal: Modularize backend functionality and expose APIs for the
   front-end to consume.

Steps:

 1 Merge resume_injector into backend:
    • Move resume_injector.py, resume_injector_gui.py, and
      batch_processor.py into backend/services/.
    • Refactor ResumeInjector to be a reusable service in
      backend/services/injection/.
    • Remove GUI-specific logic from resume_injector_gui.py (this will
      now be handled by the front-end).
 2 Centralize PDF Processing:
    • Move extract_text_from_pdf from backend/services/pdf_service.py
      into a shared module (shared/pdf_processing/).
    • Consolidate PDF merging, invisible text injection, and analysis
      logic into shared/pdf_processing/.
 3 Streamline OpenAI Integration:
    • Move evaluate_resume and compare_evaluations from
      backend/services/openai_service.py into shared/evaluation/.
    • Refactor to make the OpenAI client reusable and configurable via
      environment variables.
 4 Simplify API Endpoints:
    • Combine resume_router.py and other backend logic into a single
      API module (backend/api/).
    • Expose the following endpoints:
       • /api/analyze-resumes: Analyze clean and injected resumes.
       • /api/inject-resume: Inject prompt text into a resume.
       • /api/templates: Manage injection templates (CRUD operations).

───────────────────────────────────────────────────────────────────────
                         3. Frontend Refactor

 • Goal: Create a single-page application (SPA) that integrates all
   functionality (resume injection, analysis, and comparison).

Steps:

 1 Unify Frontend Components:
    • Refactor the frontend/src/ directory to use React (or another
      modern framework like Vue or Svelte) for all UI components.
    • Replace the current HTML-based structure with reusable React
      components:
       • UploadForm: Handles file uploads for clean and injected
         resumes.
       • ResultsDisplay: Displays evaluation results and comparisons.
       • InjectionEditor: Allows users to create and edit injection
         templates.
       • PDFViewer: Provides a side-by-side view of clean and injected
         resumes.
 2 Integrate Tailwind CSS:
    • Use Tailwind CSS for consistent styling across all components.
    • Move custom styles from frontend/src/styles.css into Tailwind's
      configuration.
 3 Centralize API Calls:
    • Refactor frontend/src/services/api.ts to include all API
      endpoints (e.g., injection, analysis, template management).
    • Use Axios or Fetch for API calls.
 4 Add State Management:
    • Use a state management library (e.g., Redux, Zustand, or Context
      API) to manage application state (e.g., uploaded files, analysis
      results, templates).
 5 Enhance User Experience:
    • Add loading spinners and error handling for API calls.
    • Provide real-time feedback during file uploads and analysis.

───────────────────────────────────────────────────────────────────────
                            4. Shared Logic

 • Goal: Avoid duplication by sharing common logic between the backend
   and frontend.

Steps:

 1 Move Shared Logic to shared/:
    • PDF processing (e.g., text extraction, merging) →
      shared/pdf_processing/.
    • Injection logic (e.g., invisible text, ASCII smuggling) →
      shared/injection/.
    • Evaluation logic (e.g., OpenAI prompts, comparison) →
      shared/evaluation/.
 2 Use TypeScript for Shared Types:
    • Define shared types (e.g., ResumeEvaluation, AnalysisResponse) in
      shared/types/.
    • Use these types in both the backend (via pydantic) and frontend
      (via TypeScript).
 3 Package Shared Logic:
    • Create a Python package for shared backend logic (shared/).
    • Use a TypeScript module for shared frontend logic
      (frontend/src/shared/).

───────────────────────────────────────────────────────────────────────
                              5. Testing

 • Goal: Ensure the refactored codebase is thoroughly tested.

Steps:

 1 Backend Tests:
    • Refactor existing tests (e.g., test_resume_router.py) to use the
      new API structure.
    • Add unit tests for shared logic (e.g., PDF processing,
      injection).
 2 Frontend Tests:
    • Write unit tests for React components using a testing library
      (e.g., Jest, React Testing Library).
    • Add integration tests for API calls.
 3 End-to-End Tests:
    • Use a tool like Cypress or Playwright to test the entire workflow
      (file upload → injection → analysis → comparison).

───────────────────────────────────────────────────────────────────────
                             6. Deployment

 • Goal: Deploy the unified application as a single product.

Steps:

 1 Backend:
    • Use Docker to containerize the FastAPI backend.
    • Deploy to a cloud platform (e.g., AWS, Azure, GCP).
 2 Frontend:
    • Build the React application using Vite.
    • Serve the frontend as static files via a CDN (e.g., Cloudflare,
      Netlify) or integrate it with the backend (e.g., FastAPI's
      StaticFiles).
 3 Environment Configuration:
    • Use .env files for environment-specific settings (e.g., API keys,
      endpoints).
    • Ensure sensitive data (e.g., OpenAI API keys) is securely
      managed.

───────────────────────────────────────────────────────────────────────
                       Benefits of the Refactor

 1 Unified Codebase: All functionality is consolidated into a single
   project, reducing complexity and duplication.
 2 Improved Maintainability: Modular structure makes it easier to add
   new features and fix bugs.
 3 Enhanced User Experience: A modern front-end provides a seamless and
   intuitive interface.
 4 Scalability: Shared logic and modular components make the
   application easier to scale and extend.
 5 Consistency: Shared types and logic ensure consistency between the
   backend and frontend.

