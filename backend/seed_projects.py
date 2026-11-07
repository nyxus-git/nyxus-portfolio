"""
Seed script — inserts all GenAI projects into the live Neon database
via the portfolio API. Run from the backend folder:
    python seed_projects.py
"""

import httpx
import json
import sys

# ── CONFIG ──────────────────────────────────────────────────────────────────
API_BASE = "http://129.121.169.82"   # Change to https://api.rohanmane.dev after SSL
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "nyxus@admin2024"
# ────────────────────────────────────────────────────────────────────────────

PROJECTS = [
    {
        "slug": "docmind",
        "title": "DocMind",
        "tagline": "Enterprise-Grade Grounded Multimodal Document Intelligence",
        "description": "DocMind is a compliance-grade document intelligence platform for professionals, researchers, and analysts. It guarantees verifiable factual answers with server-side provenance — citations map directly to immutable database chunks and verified page numbers.",
        "long_description": "DocMind goes beyond a simple RAG chatbot. It enforces Source-Only Mode — explicitly abstaining when evidence is absent. Every database query, vector search, file access, and background job carries a verified workspace_id for tenant isolation. The static Next.js 15 frontend is hosted on Cloudflare Pages for zero-latency global delivery.",
        "features": [
            "Source-Only Mode — abstains when evidence is absent",
            "Server-Side Provenance with verified page-level citations",
            "Tenant Isolation via cryptographic workspace boundaries",
            "Multimodal ingestion — PDF, DOCX, images, OCR fallback",
            "Real-time background processing with single-slot worker queue",
            "Cloudflare R2 object storage with presigned PUT/GET"
        ],
        "architecture": "Next.js 15 (Static Export) → Cloudflare Pages → FastAPI + Caddy → PostgreSQL 16 + pgvector → Cloudflare R2",
        "tech_stack": ["Python", "FastAPI", "PostgreSQL", "pgvector", "Google Gemini API", "Next.js 15", "Cloudflare R2", "Caddy", "PyMuPDF", "Tesseract OCR", "SQLAlchemy", "Alembic"],
        "github_url": "https://github.com/nyxus-git/DocMind",
        "live_url": "",
        "image_url": "/uploads/docmind.jpg",
        "screenshots": ["/uploads/docmind_rag.jpg"],
        "featured": 1,
        "order_index": 0,
        "is_visible": 1
    },
    {
        "slug": "chronoai",
        "title": "ChronoAI",
        "tagline": "Real-time Acoustic Speaker Diarization & Autonomous Meeting Co-Pilot",
        "description": "ChronoAI is an intelligent meeting co-pilot that connects via WebRTC. It diarizes speakers using pyannote.audio, tracks conversational sentiment trends, automatically extracts action items with assignees, and syncs deliverables to Linear, Jira, and Notion.",
        "long_description": "ChronoAI processes live audio streams with sub-200ms latency. The diarization pipeline identifies who spoke what, when. Mistral-Large extracts action items with assignees and deadlines from the conversation transcript. All deliverables are automatically pushed to your project management tools via native integrations.",
        "features": [
            "Real-time speaker diarization with pyannote.audio",
            "Streaming transcription with faster-whisper",
            "Emotion & sentiment trend tracking per speaker",
            "Autonomous action item extraction with assignees",
            "Linear, Jira, and Notion sync integrations",
            "WebRTC audio transport with PipeWire support"
        ],
        "architecture": "WebRTC → FastAPI → pyannote.audio + faster-whisper → Mistral-Large → Celery/Redis → Linear/Jira/Notion APIs",
        "tech_stack": ["Python", "FastAPI", "pyannote.audio", "faster-whisper", "Mistral-Large", "LangChain", "Celery", "Redis", "WebRTC", "Linear API", "Jira API", "Notion SDK"],
        "github_url": "https://github.com/nyxus-git/ChronoAI",
        "live_url": "",
        "image_url": "/uploads/chronoai.jpg",
        "screenshots": ["/uploads/chronoai_meeting.jpg"],
        "featured": 1,
        "order_index": 1,
        "is_visible": 1
    },
    {
        "slug": "codesage",
        "title": "CodeSage",
        "tagline": "Autonomous PR Auditor, Bug Detector & AST Refactoring Agent",
        "description": "CodeSage integrates directly into GitHub & GitLab CI/CD pipelines. It computes semantic syntax trees using Tree-sitter, detects memory leaks, race conditions, and SQL injection flaws, and uses DeepSeek-Coder-V2 to synthesize verified patches tested in isolated Docker containers.",
        "long_description": "CodeSage operates as a GitHub App, triggering on every pull request. It builds an Abstract Syntax Tree (AST) for the changed files, runs static analysis across 15+ vulnerability categories, and generates verified code patches. All patches are tested in ephemeral Docker sandboxes before being proposed as review comments.",
        "features": [
            "AST-level code analysis with Tree-sitter",
            "Detects memory leaks, race conditions, SQL injection",
            "DeepSeek-Coder-V2 powered patch synthesis",
            "Ephemeral Docker sandbox for patch validation",
            "GitHub App & GitLab CI/CD webhook integration",
            "PR review comments with diff-level suggestions"
        ],
        "architecture": "GitHub Webhook → FastAPI → Tree-sitter AST → DeepSeek-Coder-V2 → Docker Sandbox → GitHub Review API",
        "tech_stack": ["Python", "FastAPI", "Tree-sitter", "DeepSeek-Coder-V2", "Docker SDK", "PostgreSQL", "GitHub Apps API", "GitLab API"],
        "github_url": "https://github.com/nyxus-git/CodeSage",
        "live_url": "",
        "image_url": "/uploads/codesage.jpg",
        "screenshots": ["/uploads/codesage_ast.jpg"],
        "featured": 1,
        "order_index": 2,
        "is_visible": 1
    },
    {
        "slug": "dreamforge",
        "title": "DreamForge",
        "tagline": "Generative Text-to-3D World & Asset Synthesis Engine",
        "description": "DreamForge generates textured, game-engine-ready 3D assets from text prompts and reference photos. Built on 3D Gaussian Splatting and NeRF reconstruction, it automatically retopologizes geometry, unrolls UVs, bakes 4K PBR textures, and exports clean .glb assets.",
        "long_description": "DreamForge bridges the gap between generative AI and production-ready 3D art pipelines. A text prompt or reference image is transformed into a full 3D Gaussian Splat scene, then reconstructed into a clean polygonal mesh via Marching Tetrahedra. The Blender headless pipeline handles UV unwrapping, PBR texture baking, and LOD generation automatically.",
        "features": [
            "Text-to-3D generation with 3D Gaussian Splatting",
            "NeRF reconstruction for multi-view synthesis",
            "Automatic retopology with Marching Tetrahedra",
            "4K PBR texture baking via Blender headless API",
            "WebGL Gaussian Splat viewer in browser",
            "Exports to .glb / .gltf for game engines"
        ],
        "architecture": "Text Prompt → 3DGS Generation → NeRF Reconstruction → Blender Headless → PBR Bake → Three.js WebGL Viewer",
        "tech_stack": ["Python", "PyTorch", "3D Gaussian Splatting", "NeRF", "Trimesh", "Open3D", "Blender Python API", "Three.js", "WebGL", "FastAPI"],
        "github_url": "https://github.com/nyxus-git/DreamForge",
        "live_url": "",
        "image_url": "/uploads/dreamforge.jpg",
        "screenshots": ["/uploads/dreamforge_viewport.jpg"],
        "featured": 1,
        "order_index": 3,
        "is_visible": 1
    },
    {
        "slug": "morphlens",
        "title": "MorphLens",
        "tagline": "60 FPS Biometric Facial Tracking & Deepfake Detection Sentinel",
        "description": "MorphLens runs accelerated on TensorRT to process live 1080p60 video feeds. It tracks 468 3D facial landmarks, provides cinematic neural relighting, and evaluates high-frequency FFT artifacts to detect synthetic deepfakes with 99.4% precision in under 15ms.",
        "long_description": "MorphLens combines real-time computer vision with forensic deepfake analysis. The TensorRT-optimized pipeline processes 1080p60 streams with sub-15ms latency per frame. The deepfake detection module uses 2D FFT frequency analysis to identify GAN-generated artifacts invisible to the human eye, cross-validated with eye blink temporal cadence analysis.",
        "features": [
            "468 3D facial landmark tracking at 60 FPS",
            "TensorRT-optimized inference under 15ms/frame",
            "Neural relighting with cinematic presets",
            "Deepfake detection via 2D FFT frequency analysis",
            "Eye blink temporal cadence forensic validation",
            "WebRTC + V4L2 virtual camera integration"
        ],
        "architecture": "V4L2 Camera → WebRTC → MediaPipe + TensorRT → FFT Deepfake Analysis → Neural Relighting → Virtual Camera Output",
        "tech_stack": ["Python", "OpenCV", "MediaPipe", "YOLOv10", "PyTorch", "TensorRT", "WebRTC", "V4L2", "NumPy", "FastAPI"],
        "github_url": "https://github.com/nyxus-git/MorphLens",
        "live_url": "",
        "image_url": "/uploads/morphlens_analytics.jpg",
        "screenshots": [],
        "featured": 0,
        "order_index": 4,
        "is_visible": 1
    },
    {
        "slug": "voicecanvas",
        "title": "VoiceCanvas",
        "tagline": "Real-time Voice-Directed Generative Canvas with SDXL Turbo",
        "description": "VoiceCanvas allows creators to paint and sculpt visual scenes through natural speech. Streaming Whisper transcribes and parses creative directives, while an optimized SDXL Turbo model with LCM LoRAs synthesizes and updates 1024x1024 frames over WebSockets at 15 FPS.",
        "long_description": "VoiceCanvas reimagines creative tools by making your voice the paintbrush. As you describe a scene — 'add a sunset behind the mountains, make the sky more purple' — faster-whisper streams and parses your intent in real time. SDXL Turbo with LCM LoRA acceleration generates and updates the canvas frame-by-frame at 15 FPS, displayed in a Three.js WebGL viewport.",
        "features": [
            "Real-time voice-to-image generation at 15 FPS",
            "Streaming Whisper transcription with intent parsing",
            "SDXL Turbo + LCM LoRA for ultra-fast inference",
            "FlashAttention-2 for memory-efficient generation",
            "WebSocket binary JPEG frame streaming",
            "Three.js WebGL canvas for smooth rendering"
        ],
        "architecture": "Microphone → WebAudio API → faster-whisper → SDXL Turbo (TensorRT) → WebSocket → Three.js WebGL Canvas",
        "tech_stack": ["Python", "PyTorch", "Diffusers", "SDXL Turbo", "LCM LoRA", "FlashAttention-2", "faster-whisper", "FastAPI", "WebSockets", "Three.js", "React", "WebGL"],
        "github_url": "https://github.com/nyxus-git/VoiceCanvas",
        "live_url": "",
        "image_url": "",
        "screenshots": [],
        "featured": 0,
        "order_index": 5,
        "is_visible": 1
    }
]


def get_token(client: httpx.Client) -> str:
    resp = client.post(
        f"{API_BASE}/api/auth/login",
        data={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    if resp.status_code != 200:
        print(f"❌ Login failed: {resp.status_code} {resp.text}")
        sys.exit(1)
    token = resp.json().get("access_token")
    print("✅ Logged in as admin")
    return token


def insert_project(client: httpx.Client, token: str, project: dict) -> bool:
    resp = client.post(
        f"{API_BASE}/api/projects/",
        json=project,
        headers={"Authorization": f"Bearer {token}"}
    )
    if resp.status_code == 200:
        print(f"  ✅ Added: {project['title']}")
        return True
    elif resp.status_code == 400 and "duplicate" in resp.text.lower():
        print(f"  ⚠️  Already exists: {project['title']} (skipped)")
        return True
    else:
        print(f"  ❌ Failed: {project['title']} → {resp.status_code}: {resp.text[:200]}")
        return False


def main():
    print(f"\n🚀 Seeding projects to {API_BASE}\n")
    with httpx.Client(timeout=30) as client:
        token = get_token(client)
        print(f"\n📦 Inserting {len(PROJECTS)} projects...\n")
        success = 0
        for p in PROJECTS:
            if insert_project(client, token, p):
                success += 1
        print(f"\n{'='*40}")
        print(f"✅ Done! {success}/{len(PROJECTS)} projects seeded.")
        print(f"🌐 Check: {API_BASE}/api/projects/\n")


if __name__ == "__main__":
    main()

