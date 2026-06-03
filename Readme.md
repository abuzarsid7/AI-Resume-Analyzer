# AI Resume Analyzer

An intelligent, full-stack web application designed to automate and enhance the recruitment process. The AI Resume Analyzer allows recruiters and hiring managers to upload multiple candidate resumes (PDF or DOCX) alongside a Job Description. It leverages local embedding models and powerful LLMs to parse, score, and rank candidates based on their semantic match to the job requirements, providing actionable feedback and explicit skill comparisons.

## 🚀 Features
- **Bulk Resume Uploads:** Upload up to 10 resumes simultaneously via drag-and-drop.
- **Flexible Job Description Input:** Paste a job description directly or upload it as a separate PDF/DOCX file.
- **Smart Parsing:** Automatically extracts structured data (Name, Email, Skills, Experience, Education) from unstructured document text.
- **Semantic Scoring:** Calculates localized similarity scores between resume sections and the job description.
- **AI Feedback & Comparison:** Generates strengths, areas for improvement, and a direct comparative analysis between the candidate and the JD.
- **Leaderboard UI:** Renders a clean ranking table and visual radar charts for an at-a-glance evaluation of all candidates.

---

## 🛠️ Tech Stack

**Frontend**
- **React 18** (via Vite)
- **React Router** for navigation
- **React Dropzone** for seamless drag-and-drop file handling
- **Recharts** for visualizing candidate section scores (Radar Charts)
- **Axios** for API requests

**Backend**
- **Node.js & Express**
- **Multer** for multipart/form-data file uploads in memory
- **PDF-Parse & Mammoth** for extracting raw text from PDFs and DOCX files
- **@xenova/transformers** for running local feature-extraction embeddings (`all-MiniLM-L6-v2`) to compute semantic cosine-similarity scores.
- **OpenAI SDK / Groq API** for fast, structured LLM inference using `llama-3.3-70b-versatile`.
- **JWT (JSON Web Tokens)** for secure authentication.

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- A Groq API Key

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5050
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=your_groq_api_key_here
# Optional: OpenAI fallback if changing providers
# OPENAI_API_KEY=your_openai_api_key
```
Start the backend development server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Start the Vite development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser. 

### 🔐 Test Credentials
Because this is currently built as a single-user application pending database integration, the system is secured with a hardcoded test user. Use the following credentials to log into the dashboard:

- **Email:** `test@test.com`
- **Password:** `password123`

---

## 📚 API Documentation

### `POST /api/auth/login`
Authenticates a user and returns a JWT.
- **Body (JSON):**
  ```json
  {
    "email": "test@test.com",
    "password": "password123"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "token": "eyJhbG...",
    "email": "test@test.com"
  }
  ```

### `POST /api/resume/analyze`
Parses and scores uploaded resumes against a job description.
- **Headers:** `Authorization: Bearer <token>`
- **Body (Multipart Form-Data):**
  - `resumes`: [File Array] Multiple PDF or DOCX files (max 10).
  - `jobDescription`: [String] The raw text of the job description (if pasting).
  - `jobDescriptionFile`: [File] The PDF/DOCX of the job description (if uploading).
- **Response:** `200 OK`
  ```json
  {
    "count": 1,
    "candidates": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "skills": ["React", "Node.js"],
        "experience": ["5 years software engineering"],
        "education": ["BS Computer Science"],
        "filename": "John_Doe_Resume.pdf",
        "scores": {
          "skills": 85,
          "experience": 90,
          "education": 80,
          "total": 86
        },
        "feedback": {
          "strengths": ["Strong background in Node.js"],
          "improvements": ["Missing AWS cloud experience"],
          "summary": "Strong candidate for backend roles.",
          "comparison": {
            "skills": "Candidate matches 4/5 required skills perfectly.",
            "experience": "Meets the 5-year requirement exactly."
          }
        }
      }
    ]
  }
  ```

---

## 📂 Project Structure

```text
AI Resume Analyzer/
├── client/
│   ├── src/
│   │   ├── api/             # Axios client interceptors
│   │   ├── components/      # Reusable UI (JobDescInput, ResumeUploader, ResultsCard)
│   │   ├── context/         # React Auth Context Provider
│   │   ├── pages/           # Route views (Login, Dashboard)
│   │   ├── App.jsx          # React Router setup
│   │   └── index.css        # Global variables and glassmorphism styling
├── server/
│   ├── src/
│   │   ├── config/          # Environment variables & constants
│   │   ├── controllers/     # Route logic (authController, resumeController)
│   │   ├── middleware/      # JWT verification, Error handling, Multer config
│   │   ├── routes/          # Express route definitions
│   │   └── services/        # Core business logic
│   │       ├── embeddingService.js  # Local HuggingFace embeddings & Cosine Similarity
│   │       ├── feedbackService.js   # LLM interaction for Strengths/Improvements
│   │       ├── parserService.js     # PDF/DOCX text extraction & Structural JSON Parsing
│   │       └── scoringService.js    # Weighting and calculating total match scores
```

---

## 🔮 Future Work & Roadmap

While the core extraction and semantic matching engine is fully functional, there are several exciting architectural and feature upgrades planned for the future:

### What hasn't been done yet:
- **Persistent Database:** Currently, analysis results are stored in an ephemeral, memory-based cache (`node-cache`) to prevent redundant LLM calls during hot-reloads. The next step is to wire up the installed Mongoose models to securely store resumes, parsed JSON, and historical scores in a MongoDB cluster.
- **Robust Authentication:** Replacing the hardcoded test user with full user registration, password hashing (bcrypt), and session management.
- **Webhooks & Async Processing:** For scaling to hundreds of resumes, the API should return an immediate `job_id` and utilize a message queue (like Redis/BullMQ) to process parsing and LLM scoring in the background, updating the frontend via WebSockets.

### Building the Next-Gen RAG (Retrieval-Augmented Generation) Pipeline:
The most significant upcoming architectural shift is transitioning from standard LLM prompting to a full **RAG** architecture. 

Currently, entire resumes are passed directly into the context window for extraction. As the database grows to thousands of historical candidate resumes, we will build a RAG system to enable **"Resume Search Engine"** capabilities:
1. **Chunking & Vector DB:** Every uploaded resume will be semantically chunked and stored in a Vector Database (e.g., Pinecone, Milvus, or pgvector).
2. **Semantic Candidate Retrieval:** When a new Job Description is posted, the system will embed the JD and execute a semantic search across the entire Vector DB to instantly retrieve the top 1% of historically matching candidates.
3. **Targeted Generation:** The LLM will only be fed the highly relevant chunks of the retrieved resumes, allowing it to generate deep, highly specific comparative analysis while strictly managing token limits and avoiding hallucinations.
