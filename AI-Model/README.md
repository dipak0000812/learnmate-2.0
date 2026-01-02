# LearnMate AI Service 🤖

Python Flask service providing intelligent roadmap generation and career recommendations.

## Security Update 🔒

**API Key Enforcement**: This service is now protected. It requires the `X-API-Key` header for all generic endpoints.
*   Configure the key in `.env` as `AI_API_KEY`.
*   Requests without this header will receive `401 Unauthorized`.

## Endpoints

*   `POST /ai/generate-roadmap`: Create a personalized learning path.
*   `POST /ai/evaluate-quiz`: Grade and analyze quiz performance.
*   `POST /ai/recommend-career`: Suggest careers based on skills.
*   `GET /health`: Health check (No Auth required).

## Setup

```bash
pip install -r requirements.txt
python app.py
```
