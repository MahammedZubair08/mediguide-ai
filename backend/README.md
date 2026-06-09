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
See the primary project README at the root folder for setup details.
