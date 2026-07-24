"""
Demo route — proxies HuggingFace Inference API calls server-side.
This avoids CORS issues when calling from the browser.
Model: distilbert-base-uncased-finetuned-sst-2-english (free, public)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import urllib.request
import urllib.error
import json

router = APIRouter()

HF_API_URL = (
    "https://api-inference.huggingface.co/models/"
    "distilbert-base-uncased-finetuned-sst-2-english"
)


class SentimentRequest(BaseModel):
    text: str


@router.post("/sentiment")
def analyze_sentiment(body: SentimentRequest):
    """Proxy sentiment analysis to HuggingFace Inference API."""
    text = body.text.strip()[:512]
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    payload = json.dumps({
        "inputs": text,
        "options": {"wait_for_model": True}
    }).encode("utf-8")

    req = urllib.request.Request(
        HF_API_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
            return {"results": data}
    except urllib.error.HTTPError as e:
        body_bytes = e.read()
        try:
            err = json.loads(body_bytes)
        except Exception:
            err = {"error": str(e)}

        if e.code == 503:
            # Model is loading — tell the frontend to retry
            raise HTTPException(
                status_code=503,
                detail="Model is warming up, please try again in ~20 seconds"
            )
        raise HTTPException(status_code=e.code, detail=err.get("error", "HuggingFace API error"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
