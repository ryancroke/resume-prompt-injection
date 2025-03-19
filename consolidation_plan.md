# Step-by-Step Codebase Consolidation Plan

Analyzing current structure. Need consolidated application. One app, one place. Much simpler! Will outline detailed implementation steps for LLM execution.

## Step 1: Create Unified Project Structure
```
app/
├── backend/
│   ├── api/
│   │   └── routes.py            # All API endpoints
│   ├── services/
│   │   ├── injection_service.py # Moved from resume_injector
│   │   ├── pdf_service.py       # PDF processing logic
│   │   └── eval_service.py      # Resume evaluation logic
│   └── main.py                  # FastAPI entry point
├── frontend/
│   ├── components/
│   │   ├── UploadForm.tsx       # Resume upload component
│   │   ├── InjectionEditor.tsx  # Injection text editor
│   │   └── ResultsDisplay.tsx   # Comparison results
│   ├── services/
│   │   └── api.ts               # API client functions
│   ├── App.tsx                  # Main application component
│   └── index.html               # Entry HTML file
├── .env                         # Environment variables
├── requirements.txt             # Python dependencies
└── package.json                 # Node dependencies
```

## Step 2: Migrate Resume Injector Functionality
1. Create `app/backend/services/injection_service.py`
2. Transfer `ResumeInjector` class from `resume_injector.py`
3. Refactor to use relative imports and project paths
4. Remove standalone command-line functionality
5. Add clear service interface functions:
   ```python
   def inject_invisible_text(input_pdf_path, output_pdf_path, injection_text=None):
       """Service function to inject invisible text into PDF"""
       injector = ResumeInjector(injection_text)
       return injector.inject_resume(input_pdf_path, output_pdf_path)
   ```

## Step 3: Create PDF Service
1. Create `app/backend/services/pdf_service.py`
2. Add PDF extraction functionality:
   ```python
   def extract_text_from_pdf(pdf_path):
       """Extract visible text from PDF for analysis"""
       # Implementation using PyPDF2
   ```
3. Add PDF comparison functionality:
   ```python
   def compare_pdfs(clean_pdf, injected_pdf):
       """Compare clean and injected PDFs to detect differences"""
       # Implementation
   ```

## Step 4: Create Evaluation Service
1. Create `app/backend/services/eval_service.py`
2. Add LLM evaluation functionality:
   ```python
   def evaluate_resume(pdf_path, openai_client):
       """Send resume to OpenAI for evaluation"""
       # Implementation
   ```
3. Add comparison functionality:
   ```python
   def compare_evaluations(clean_eval, injected_eval):
       """Compare evaluations to highlight injection effects"""
       # Implementation
   ```

## Step 5: Create Unified API Routes
1. Create `app/backend/api/routes.py`
2. Implement upload endpoint:
   ```python
   @router.post("/upload")
   async def upload_resume(file: UploadFile):
       """Handle resume upload"""
       # Implementation
   ```
3. Implement injection endpoint:
   ```python
   @router.post("/inject")
   async def inject_resume(file: UploadFile, injection_text: str = Form(None)):
       """Inject text into resume"""
       # Implementation using injection_service
   ```
4. Implement evaluation endpoint:
   ```python
   @router.post("/evaluate")
   async def evaluate_resumes(clean_resume: UploadFile, injected_resume: UploadFile = None):
       """Evaluate clean and optionally injected resumes"""
       # Implementation using eval_service
   ```

## Step 6: Create FastAPI Entry Point
1. Create `app/backend/main.py`
2. Setup FastAPI and include routers:
   ```python
   app = FastAPI(title="Resume Injection Demo")
   
   # CORS middleware setup
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   # Include routers
   app.include_router(routes.router, prefix="/api")
   
   # Serve frontend
   app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
   ```

## Step 7: Create Frontend Components
1. Create React components in `app/frontend/components/`
2. Implement UploadForm.tsx for file uploads
3. Implement InjectionEditor.tsx for custom injection text
4. Implement ResultsDisplay.tsx for side-by-side comparison

## Step 8: Create Frontend API Service
1. Create `app/frontend/services/api.ts`
2. Implement API functions:
   ```typescript
   export const uploadResume = async (file: File): Promise<string> => {
     // Implementation
   }
   
   export const injectResume = async (file: File, text?: string): Promise<string> => {
     // Implementation
   }
   
   export const evaluateResumes = async (
     cleanResume: File, 
     injectedResume?: File
   ): Promise<EvaluationResult> => {
     // Implementation
   }
   ```

## Step 9: Create Main Frontend Application
1. Create `app/frontend/App.tsx`
2. Implement main application flow:
   ```tsx
   function App() {
     // State and component implementation
     return (
       <div className="container mx-auto p-4">
         <h1>Resume Injection Demo</h1>
         <UploadForm onUpload={handleUpload} />
         <InjectionEditor onChange={setInjectionText} />
         <ResultsDisplay results={results} />
       </div>
     );
   }
   ```

## Step 10: Setup Configuration
1. Create `.env` file with configuration:
   ```
   OPENAI_API_KEY=your_key_here
   OPENAI_API_BASE=https://your-endpoint.openai.azure.com
   OPENAI_API_VERSION=2023-05-15
   ```
2. Create `requirements.txt` with backend dependencies:
   ```
   fastapi==0.95.1
   uvicorn==0.22.0
   python-multipart==0.0.6
   PyPDF2==3.0.1
   reportlab==4.0.4
   openai==0.27.8
   ```
3. Create `package.json` with frontend dependencies

## Step 11: Setup Development Environment
1. Create unified start scripts:
   ```bash
   # start.sh
   cd app
   # Start backend
   python -m uvicorn backend.main:app --reload &
   # Start frontend development server
   cd frontend && npm run dev
   ```

## Step 12: Test and Validate
1. Test PDF upload functionality
2. Test injection functionality
3. Test evaluation and comparison
4. Fix any integration issues 