# MediGuide AI - Full-Stack Healthcare Assistant

MediGuide AI is a professional, production-ready AI-powered medical assistant. It supports:
- **Symptom Querying:** Structured chat for preliminary health guidance.
- **Medical Report Summarization:** Document scanning and content summarization.
- **Emergency Detection:** AI-driven and rule-based screening for critical symptom warnings.

---

## Project Structure

```text
mediguide-ai/
│
├── frontend/             # React + Vite + Tailwind CSS + shadcn/ui
├── backend/              # FastAPI + Python + Gemini API
├── docker-compose.yml    # Container orchestration
└── README.md             # This document
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **Gemini API Key** (Get it from Google AI Studio)

---

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env` settings:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8000
   HOST=0.0.0.0
   # Required for Python 3.14+ compatibility:
   PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python
   ```
5. Run the FastAPI development server:
   ```bash
   python main.py
   ```
   The backend will be running at `http://localhost:8000`.

---

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the React development server:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

---

## Docker Execution
Ensure you have docker installed and run:
```bash
docker-compose up --build
```
This builds and starts both the frontend and backend services in tandem.
