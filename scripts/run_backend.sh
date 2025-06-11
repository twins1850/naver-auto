#!/bin/bash
export LICENSE_SECRET_KEY=test-secret-key
cd /Users/twins/Documents/AI/naver-auto/naver-blog-admin
lsof -ti :8001 | xargs kill -9
PYTHONPATH=/Users/twins/Documents/AI/naver-auto uvicorn app.main:app --reload --port 8001
