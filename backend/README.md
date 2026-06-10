# MediGuide AI - Backend Service

This is the FastAPI backend service for the MediGuide AI clinical helper application.

## Directory Structure
- `app/config`: Global settings loader and env config validation.
- `app/routes`: Endpoints supporting Chat, Upload, and Emergency assessment.
- `app/services`: High-level service integrations, such as `GeminiService`.
- `app/utils`: File parsers and text parsing scripts.
- `app/prompts`: Centralized prompts engineered specifically for clinical safety and compliance.
- `uploads/`: Scratch/storage area for incoming documents (e.g. PDFs, TXTs).

## Startup Instructions

### Prerequisites
Ensure you have **Python 3.9+** installed on your system.

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Create and Activate a Virtual Environment
- **On Windows (PowerShell/CMD):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\activate
  ```
- **On macOS/Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### 3. Install Dependencies
Ensure your virtual environment is active, then install the required Python packages:
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend` directory (if it doesn't already exist) and specify your settings:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

### 5. Run the Application
Start the FastAPI application by running the following command:
```bash
python main.py
```

The service will start up and listen on `http://localhost:8000`. You can access the API interactive documentation (Swagger UI) at `http://localhost:8000/docs`.
