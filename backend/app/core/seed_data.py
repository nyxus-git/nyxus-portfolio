"""
Seed data and database schema synchronization for Rohan Mane's Portfolio.
Provides:
- CANONICAL_PROJECTS: The 7 production GenAI projects with full metadata, local static image paths, and architecture blueprints.
- ensure_database_schema: Auto-migrates database tables to ensure all new columns exist (PostgreSQL and SQLite).
- sync_canonical_projects: Automatically inserts / updates the projects in the database.
"""

from typing import List, Dict, Any
from sqlalchemy import text, inspect
from sqlalchemy.orm import Session
from ..models.project import Project

CANONICAL_PROJECTS: List[Dict[str, Any]] = [
    {
        "title": "NyxAI — Local AI Desktop Agent",
        "slug": "nyxai",
        "tagline": "Local-first intelligent desktop companion and autonomous agent for Arch Linux & Hyprland",
        "description": "A privacy-first, fully local AI companion built for Linux (Arch/EndeavourOS + Hyprland). NyxAI combines conversational AI, multilingual voice interaction (English, Hindi, Marathi, Hinglish via Super+Space push-to-talk), and autonomous desktop automation — running entirely on your own GPU with zero cloud dependency. Features a 4-layer persistent memory system, tool calling registry, and local fine-tuning pipeline.",
        "long_description": "NyxAI is an autonomous, privacy-first desktop intelligence system tailored for Arch Linux and Hyprland environments. Built from the ground up to operate completely offline, NyxAI leverages Ollama with a quantized Qwen2.5-3B model, faster-whisper, and Kokoro ONNX to provide near-zero latency voice interaction and automated operating system control without ever sending audio or telemetry to external servers.\n\n### Why NyxAI?\nConventional voice assistants and agents are cloud-tethered, leak sensitive telemetry, and cannot execute low-level Linux shell or window management tasks. NyxAI runs locally on a single consumer GPU (consuming under 4 GB of VRAM), interacts natively with Hyprland IPC sockets via custom keybindings, and manages desktop workflows effortlessly.\n\n### Autonomous Agent Loop\nThe NyxAgent core runs an iterative ReAct reasoning loop. When the user requests a task—whether via voice push-to-talk () or the companion overlay ()—NyxAI assesses required tools, validates safety policies, executes native Linux commands (opening apps, managing foot/kitty terminals, querying local files, checking system metrics), and provides synthesized audio feedback in Hindi, English, or Hinglish.",
        "features": [
            "🗣️ Multilingual Voice Interaction: Push-to-talk streaming with faster-whisper (English, Hindi, Hinglish, Marathi) and Kokoro ONNX speech synthesis under 250ms latency.",
            "🤖 Desktop Tool Calling Registry: Direct integration with Hyprland IPC, foot terminal, file manager, systemd process supervisor, and hardware telemetry.",
            "🧠 4-Layer Persistent Memory: SQLite-backed Short-Term & Episodic memory paired with ChromaDB vector embeddings for contextual multi-session recall.",
            "⚡ 6GB VRAM Optimization: Fits comfortably on consumer RTX GPUs with Ollama 4-bit quantization and LoRA/QLoRA parameter-efficient adaptation.",
            "🖥️ React + Tauri Companion Overlay: Sleek dark cybernetic HUD toggled with Super+J for visual metrics, active tools, and real-time transcripts."
        ],
        "architecture": "NyxAI follows a modular event-driven micro-service architecture:\n1. **Audio Ingestion Layer**: PyAudio captures raw 16kHz streams triggered by global Hyprland keyboard hooks. Faster-whisper handles streaming transcription.\n2. **Cognitive Agent Core**: Orchestrated via FastAPI and LangChain-style reasoning loops. Queries ChromaDB for semantic recall and routes tool calls to the Sandboxed System ToolRegistry.\n3. **Execution & IPC**: Executes shell operations, window management, and application launchers via async sub-processes with timeout guards.\n4. **Speech Synthesis**: Kokoro ONNX converts model responses into natural sounding audio piped directly to PulseAudio/PipeWire.",
        "tech_stack": [
            "Python",
            "FastAPI",
            "Ollama (qwen2.5:3b)",
            "faster-whisper",
            "Kokoro ONNX",
            "ChromaDB",
            "SQLite",
            "React",
            "TypeScript",
            "Tauri",
            "Hyprland"
        ],
        "github_url": "https://github.com/nyxus-git/NyxAI",
        "live_url": "https://nyxai-demo.vercel.app",
        "image_url": "/images/projects/nyxai_cover.webp",
        "screenshots": [
            "/images/projects/nyxai_cover.webp",
            "/images/projects/nyxai_voice.webp"
        ],
        "featured": 1,
        "order_index": 0
    },
    {
        "title": "DocMind — Multimodal Document Intelligence & RAG",
        "slug": "docmind",
        "tagline": "Enterprise-grade multimodal RAG agent with hybrid vector search and verifiable citations",
        "description": "Enterprise-grade multimodal Retrieval-Augmented Generation (RAG) platform with hybrid dense/sparse vector search, semantic caching, automated document parsing (PDF/OCR), dynamic citations, and multi-agent debate reasoning for zero-hallucination compliance queries.",
        "long_description": "DocMind is a production-grade enterprise document intelligence platform engineered for mission-critical audit, compliance, and research workflows. By merging dense semantic embeddings (BGE-M3) with sparse lexical BM25 retrieval into a reciprocal rank fusion pipeline, DocMind achieves industry-leading retrieval precision over hundreds of complex PDFs, spreadsheets, and technical blueprints.\n\n### Enterprise Compliance & Hallucination Guardrails\nStandard RAG systems hallucinate on fine print and tabular data. DocMind solves this with an autonomous Multi-Agent Debate architecture: a primary generation agent formulates responses while a secondary validation agent rigorously checks each sentence against retrieved chunk offsets. Any claim lacking explicit source grounding is rejected or flagged with an exact page/bounding-box citation.\n\n### Semantic Caching & Latency Reduction\nIntegrated with Qdrant vector database and Redis semantic caching, DocMind skips redundant LLM inference for semantically equivalent queries, delivering sub-100ms response times for repeat organizational questions while slashing API inference costs by up to 65%.",
        "features": [
            "📑 Multimodal Document Parser: Handles scanned PDFs, docx, pptx, and CSVs using paddleOCR and vision-language chunking.",
            "🔍 Hybrid Dense/Sparse Fusion: Qdrant vector search combined with BM25 keyword matching via Reciprocal Rank Fusion (RRF).",
            "🛡️ Multi-Agent Fact Verification: Dual-agent reasoning pipeline that scores groundedness and guarantees exact paragraph citations.",
            "⚡ Intelligent Semantic Cache: Embedding-based similarity caching in Redis reducing query latency to under 90ms.",
            "📊 Interactive Knowledge Graph: Visual cluster map of document concepts and vector embeddings similarity relationships."
        ],
        "architecture": "DocMind Architecture Pipeline:\n1. **Ingestion & Layout Analysis**: Document ingestion worker splits files into semantic chunks, extracts tables into markdown, and computes vector embeddings.\n2. **Hybrid Retrieval Engine**: Queries are vectorized and matched against Qdrant dense collections alongside an inverted index.\n3. **Reranker & Context Assembler**: Cross-encoder rerankers select top-k most relevant contexts within strict token budgets.\n4. **Debate & Synthesis**: Llama-3.3-70B synthesizes answers with strict citation IDs, verified by an automated compliance evaluator.",
        "tech_stack": [
            "Python",
            "FastAPI",
            "LangChain",
            "Qdrant",
            "Llama-3.3-70B",
            "Redis",
            "Next.js",
            "TypeScript",
            "TailwindCSS"
        ],
        "github_url": "https://github.com/nyxus-git/DocMind",
        "live_url": "https://docmind-ai.vercel.app",
        "image_url": "/images/projects/docmind_cover.webp",
        "screenshots": [
            "/images/projects/docmind_cover.webp",
            "/images/projects/docmind_rag.webp"
        ],
        "featured": 0,
        "order_index": 1
    },
    {
        "title": "VoiceCanvas — Generative Multimodal Voice-to-Art Engine",
        "slug": "voicecanvas",
        "tagline": "Real-time interactive voice-directed generative canvas with sub-second diffusion synthesis",
        "description": "Real-time interactive voice-directed generative canvas. Listens to continuous voice prompts with low-latency streaming Whisper, synthesizes generative diffusion concepts using SDXL Turbo with LCM LoRAs, and streams visual iterations at 15 FPS directly over WebSockets with 3D canvas manipulation.",
        "long_description": "VoiceCanvas redefines digital creation by bridging natural conversational voice with ultra-fast generative latent diffusion. Artists and designers speak their concepts aloud—describing lighting, composition, mood, and camera perspective—and watch the canvas iteratively morph and render in real time.\n\n### Streaming Latency & Architecture\nPowered by SDXL Turbo accelerated with Latent Consistency Models (LCM) and FlashAttention-2, VoiceCanvas renders diffusion frames in just 4 steps (under 65ms per frame on an RTX 4090). A bidirectional WebSocket server streams intermediate latents directly to a WebGL/Three.js viewport at 15 FPS, creating a fluid, interactive visual experience that feels like painting with your voice.\n\n### Multimodal Control\nBeyond text prompts, VoiceCanvas incorporates voice cadence, audio volume dynamics, and spatial gestures to manipulate depth, color saturation, and layer masks dynamically without touching a keyboard.",
        "features": [
            "🎙️ Continuous Audio Streaming: Low-latency voice chunking via Whisper v3 with real-time prompt parsing.",
            "🎨 Sub-100ms Latent Diffusion: SDXL Turbo + LCM LoRAs generating high-fidelity 1024x1024 art in 4 sampling steps.",
            "🌐 WebSocket Frame Streaming: Binary WebSocket protocol delivering 15-20 FPS progressive canvas updates.",
            "🧊 Three.js 3D Viewport: Real-time orbit, pan, depth-map extrusions, and camera angle controls.",
            "🔄 Prompt Iteration Timeline: Non-destructive revision tree allowing artists to rewind or fork creative directions."
        ],
        "architecture": "VoiceCanvas High-Performance Pipeline:\n1. **Audio Worker**: WebAudio API captures microphone stream -> WebSockets -> Whisper v3 streaming transcriptor.\n2. **Prompt Modulation Agent**: Formulates positive/negative embeddings and interpolates prompt weight deltas.\n3. **TensorRT Diffusion Core**: PyTorch + TensorRT execution of SDXL Turbo U-Net on GPU with warm CUDA graphs.\n4. **Binary Transmission**: Compresses decoded latents via NVENC/JPEG turbo and streams to client WebGL canvas.",
        "tech_stack": [
            "PyTorch",
            "Diffusers",
            "SDXL Turbo",
            "Whisper v3",
            "FastAPI",
            "WebSockets",
            "Three.js",
            "React",
            "WebGL"
        ],
        "github_url": "https://github.com/nyxus-git/VoiceCanvas",
        "live_url": "https://voicecanvas.vercel.app",
        "image_url": "/images/projects/voicecanvas_cover.webp",
        "screenshots": [
            "/images/projects/voicecanvas_cover.webp",
            "/images/projects/voicecanvas_editor.webp"
        ],
        "featured": 0,
        "order_index": 2
    },
    {
        "title": "CodeSage — Autonomous Agentic Code Reviewer & Refactorer",
        "slug": "codesage",
        "tagline": "Autonomous pull request auditor and AST refactoring agent for CI/CD pipelines",
        "description": "Autonomous pull request auditor and code refactoring bot powered by DeepSeek-Coder-V2 and Tree-sitter AST analysis. Detects memory leaks, race conditions, and architectural bottlenecks, producing verified inline patch suggestions and automated unit tests directly in CI/CD pipelines.",
        "long_description": "CodeSage is an autonomous code intelligence bot built to eliminate code review bottlenecks and catch elusive concurrency bugs before they reach production. Integrated directly into GitHub Actions and GitLab CI, CodeSage clones pull requests, computes semantic syntax trees using Tree-sitter, and analyzes logic flow with DeepSeek-Coder-V2.\n\n### AST-Guided Verification\nUnlike naive LLM code reviewers that hallucinate syntax and offer broken snippets, CodeSage parses code into Abstract Syntax Trees (AST) before and after proposed refactorings. It runs localized tests in isolated Docker containers to guarantee that every suggested patch compiles and passes all existing assertions.\n\n### Comprehensive Vulnerability & Performance Auditing\nCodeSage flags SQL injection, unhandled promise rejections, memory leaks, and inefficient N+1 database queries. It produces comprehensive Markdown review summaries with benchmark graphs and automated GitHub commit suggestions that developers can apply with a single click.",
        "features": [
            "🌳 Tree-sitter AST Analysis: Multi-language semantic parsing (Go, Python, TypeScript, Rust) ensuring zero syntax regressions.",
            "🤖 DeepSeek-Coder-V2 Engine: Deep contextual understanding of large codebases with 64K token context windows.",
            "🧪 Automated Unit Test Generation: Writes and verifies isolated PyTest and Jest test suites for newly introduced functions.",
            "⚡ Concurrency & Race Condition Detection: Static dataflow analysis targeting deadlocks and goroutine/async leaks.",
            "🚀 GitHub Apps Webhook Integration: Posts inline review comments, diff badges, and ready-to-merge patches automatically."
        ],
        "architecture": "CodeSage CI/CD Architecture:\n1. **Webhook Handler**: Receives webhook events from GitHub App via Go high-concurrency gateway.\n2. **Static AST Extractor**: Tree-sitter extracts changed function scopes, call graphs, and dependency graphs.\n3. **Agentic Reasoning & Patch Synthesis**: Queries DeepSeek-Coder-V2 with exact diffs, AST context, and project guidelines.\n4. **Sandboxed Verification**: Runs test runner inside ephemeral Docker container to confirm compilation and test pass rates.",
        "tech_stack": [
            "Go",
            "Python",
            "DeepSeek-Coder-V2",
            "Tree-sitter",
            "Docker",
            "PostgreSQL",
            "GitHub API",
            "Next.js"
        ],
        "github_url": "https://github.com/nyxus-git/CodeSage",
        "live_url": "https://codesage-agent.vercel.app",
        "image_url": "/images/projects/codesage_cover.webp",
        "screenshots": [
            "/images/projects/codesage_cover.webp",
            "/images/projects/codesage_ast.webp"
        ],
        "featured": 0,
        "order_index": 3
    },
    {
        "title": "ChronoAI — Real-Time Meeting Intelligence & Autonomous Action Agent",
        "slug": "chronoai",
        "tagline": "Real-time acoustic speaker diarization, executive summaries, and autonomous task delegation",
        "description": "Real-time autonomous meeting intelligence co-pilot. Features acoustic speaker diarization, real-time emotion and sentiment tracking, automated live transcription, action item delegation to Linear/Jira/Notion, and post-meeting executive synthesis with conversational query search.",
        "long_description": "ChronoAI is an intelligent meeting co-pilot designed to make video conferences actionable, transparent, and effortlessly documented. Connecting seamlessly via WebRTC or meeting bot integrations (Google Meet, Zoom, Teams), ChronoAI processes multi-party audio in real time, isolating individual speakers through pyannote.audio diarization.\n\n### Autonomous Action Delegation\nChronoAI does not just transcribe meetings—it takes action. As participants discuss deliverables, ChronoAI detects commitments in natural conversation, determines the responsible owner and due date, and automatically creates categorized tickets in Linear, Jira, or Notion with live confirmation badges.\n\n### Post-Meeting Executive Intelligence\nImmediately upon call completion, ChronoAI generates executive summaries, key decisions logs, and a sentiment trend curve highlighting points of consensus or disagreement. Users can chat with the meeting archive using conversational semantic search to recall exact discussion points from months ago.",
        "features": [
            "👥 Acoustic Speaker Diarization: State-of-the-art voice clustering via pyannote.audio identifying who said what with 98% accuracy.",
            "⚡ Live WebRTC Streaming Transcription: Sub-second streaming transcription with acoustic noise suppression.",
            "📋 Autonomous Task Extraction: Automatically creates and assigns structured issues in Linear, Jira, and Notion.",
            "📈 Real-Time Sentiment & Engagement Graph: Tracks team alignment, speaking ratios, and sentiment trends during calls.",
            "🔍 Semantic Meeting Archive: Natural language conversational search over past transcripts, video timestamps, and shared slides."
        ],
        "architecture": "ChronoAI Meeting Architecture:\n1. **Audio Ingestion**: Headless Chromium bot joins meeting audio via WebRTC audio stream -> Opus decoder.\n2. **Diarization & ASR Pipeline**: pyannote.audio computes voice embeddings while Whisper v3 transcribes parallel audio chunks.\n3. **Intelligence Agent**: Mistral-Large processes rolling dialogue buffer, flags action items, and generates live summaries.\n4. **Third-Party Sync**: Celery task workers dispatch validated tasks to Linear/Jira APIs and index embeddings in Qdrant.",
        "tech_stack": [
            "Python",
            "FastAPI",
            "WebRTC",
            "pyannote.audio",
            "Mistral-Large",
            "Celery",
            "Redis",
            "React",
            "TailwindCSS"
        ],
        "github_url": "https://github.com/nyxus-git/ChronoAI",
        "live_url": "https://chronoai.vercel.app",
        "image_url": "/images/projects/chronoai_cover.webp",
        "screenshots": [
            "/images/projects/chronoai_cover.webp",
            "/images/projects/chronoai_meeting.webp"
        ],
        "featured": 0,
        "order_index": 4
    },
    {
        "title": "MorphLens — Real-Time Neural Video Synthesizer & Deepfake Sentinel",
        "slug": "morphlens",
        "tagline": "High-throughput 60 FPS biometric face tracking, neural relighting, and deepfake detection sentinel",
        "description": "High-throughput neural video processor operating at 60 FPS under TensorRT acceleration. Provides real-time biometric landmark tracking, cinematic neural relighting, and a multi-frequency spatial-temporal deepfake authenticity analyzer that flags synthetic facial manipulation with sub-frame precision.",
        "long_description": "MorphLens combines computer vision, real-time neural rendering, and forensic AI security into a unified edge-video processing system. Designed for high-stakes video verification, broadcast streaming, and immersive telepresence, MorphLens processes live 1080p camera feeds at a rock-solid 60 FPS.\n\n### Multi-Frequency Deepfake Detection\nAs generative face-swaps and diffusion clones proliferate, MorphLens serves as a real-time authentication firewall. By scrutinizing high-frequency spatial noise patterns, photoplethysmography (blood flow pulse signals across facial skin), and temporal eye-blink cadence, MorphLens detects synthetic media in under 15ms with 99.4% precision.\n\n### Neural Relighting & Enhancement\nOn the generative side, MorphLens features a real-time neural relighting engine that estimates spherical harmonic ambient lighting, allowing streamers and presenters to cast custom studio lighting and depth effects onto video streams with zero green-screen hardware.",
        "features": [
            "🔬 468-Point Biometric Mesh: High-fidelity 3D facial landmark tracking via MediaPipe & custom PyTorch models.",
            "🛡️ Dual-Stage Deepfake Sentinel: Frequency-domain FFT and spatial artifact analysis with live authenticity score meters.",
            "⚡ TensorRT 60 FPS Pipeline: Sub-15ms end-to-end inference latency on modern NVIDIA GPUs.",
            "💡 Dynamic Neural Relighting: Spherical harmonics lighting projection adapting to virtual backgrounds.",
            "🎥 Virtual Camera Driver: Feeds directly into OBS, Zoom, Google Meet, and Discord via v4l2loopback."
        ],
        "architecture": "MorphLens Video Pipeline:\n1. **Video Capture Layer**: OpenCV & V4L2 capture 1080p60 frames into shared CUDA pinned memory buffers.\n2. **Landmark & Feature Extraction**: TensorRT-optimized MediaPipe mesh model extracts 468 3D landmarks and gaze vectors.\n3. **Forensic Sentinel**: Evaluates skin chromaticity fluctuations and temporal eye blink intervals against a CNN-LSTM deepfake detector.\n4. **Rendering & Virtual Output**: Applies neural shaders and outputs to a virtual camera loopback device.",
        "tech_stack": [
            "Python",
            "C++",
            "TensorRT",
            "OpenCV",
            "MediaPipe",
            "YOLOv10",
            "PyTorch",
            "FastAPI",
            "WebRTC"
        ],
        "github_url": "https://github.com/nyxus-git/MorphLens",
        "live_url": "https://morphlens.vercel.app",
        "image_url": "/images/projects/morphlens_cover.webp",
        "screenshots": [
            "/images/projects/morphlens_cover.webp",
            "/images/projects/morphlens_analytics.webp"
        ],
        "featured": 0,
        "order_index": 5
    },
    {
        "title": "DreamForge — Generative Text-to-3D World & Asset Synthesis Engine",
        "slug": "dreamforge",
        "tagline": "Next-gen 3D Gaussian Splatting and NeRF reconstruction engine for games and spatial computing",
        "description": "Next-generation 3D generative synthesis platform using 3D Gaussian Splatting and NeRF reconstruction from natural language descriptions. Exports textured, physically-based render (PBR) assets (.glb/.obj) with automated collision mesh generation and physics rigging ready for game engines.",
        "long_description": "DreamForge empowers game developers, spatial computing creators, and 3D artists to generate complete 3D assets and environments straight from text and reference imagery. Leveraging state-of-the-art 3D Gaussian Splatting (3DGS) and multi-view diffusion models, DreamForge creates high-detail textured geometry in minutes instead of days.\n\n### Game-Engine-Ready Pipeline\nMost 3D AI generators export messy point clouds or untextured unoptimized meshes. DreamForge incorporates automated retopology, UV unwrapping, and PBR texture map baking (diffuse, roughness, normal, ambient occlusion). Every generated model is exported in standard formats complete with simplified convex collision hulls for Unity and Unreal Engine 5.\n\n### WebGL Splat Viewer & Interactive Editor\nCreators can preview and inspect their 3D models directly in the browser with an interactive Three.js Gaussian Splat viewport, adjusting lighting, orbit cameras, materials, and physics parameters before exporting.",
        "features": [
            "🌌 3D Gaussian Splatting Synthesis: Real-time high-fidelity volumetric asset generation with photorealistic view-dependent effects.",
            "📦 Automated Retopology & UVs: Converts raw splats and NeRFs into clean quad meshes with optimal polygon budgets.",
            "🎨 PBR Texture Baking: Generates 4K normal maps, roughness maps, and ambient occlusion textures.",
            "🎮 Game Engine Ready: 1-click export to .glb, .obj, and .usd with automated physics collision hulls.",
            "🌐 WebGL Splat Viewer: Zero-install browser-based 3D editor with lighting gizmos, wireframe view, and material inspector."
        ],
        "architecture": "DreamForge 3D Synthesis Pipeline:\n1. **Multi-View Diffusion**: Synthesizes synchronized 6-view 360° perspective frames from text prompts.\n2. **Gaussian Splat Optimization**: 3DGS optimizer computes 3D position, covariance, opacity, and spherical harmonic colors.\n3. **Marching Tetrahedra / Meshing**: Extracts watertight polygonal geometry from density fields.\n4. **Baking & Packaging**: Blender Python headless script unrolls UVs, bakes PBR textures, and exports GLTF/GLB files.",
        "tech_stack": [
            "Python",
            "PyTorch",
            "Gaussian Splatting",
            "Three.js",
            "FastAPI",
            "Blender Python API",
            "Next.js",
            "WebGL"
        ],
        "github_url": "https://github.com/nyxus-git/DreamForge",
        "live_url": "https://dreamforge-3d.vercel.app",
        "image_url": "/images/projects/dreamforge_cover.webp",
        "screenshots": [
            "/images/projects/dreamforge_cover.webp",
            "/images/projects/dreamforge_viewport.webp"
        ],
        "featured": 0,
        "order_index": 6
    }
]


def ensure_database_schema(engine):
    """
    Ensure all required columns exist in projects table across SQLite and PostgreSQL.
    Safely executes ALTER TABLE queries without crashing if columns already exist.
    """
    try:
        insp = inspect(engine)
        if "projects" not in insp.get_table_names():
            return

        columns = [c["name"] for c in insp.get_columns("projects")]
        dialect = engine.dialect.name

        with engine.begin() as conn:
            if dialect == "postgresql":
                if "slug" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug VARCHAR(255);"))
                if "tagline" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline VARCHAR(255);"))
                if "long_description" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS long_description TEXT;"))
                if "features" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS features JSON DEFAULT '[]'::json;"))
                if "architecture" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture TEXT;"))
                if "screenshots" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots JSON DEFAULT '[]'::json;"))
                conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_projects_slug ON projects (slug);"))
            else:
                # SQLite
                if "slug" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN slug VARCHAR(255);"))
                if "tagline" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN tagline VARCHAR(255);"))
                if "long_description" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN long_description TEXT;"))
                if "features" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN features JSON DEFAULT '[]';"))
                if "architecture" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN architecture TEXT;"))
                if "screenshots" not in columns:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN screenshots JSON DEFAULT '[]';"))
    except Exception as e:
        print(f"Schema check error (non-fatal): {e}")


def sync_canonical_projects(db: Session):
    """
    Ensures the 7 flagship GenAI projects are always present, up-to-date,
    and have their Cloudinary URLs, screenshots, and architecture specs populated.
    """
    try:
        # Remove legacy demo placeholder projects that have no slug
        legacy_titles = [
            "Sentiment Analysis Web App",
            "Image Classifier with CNN",
            "Stock Price Predictor (LSTM)",
            "Face Detection & Recognition System",
            "ML Playground — Interactive Learning Platform",
            "Portfolio Website (This Site!)",
        ]
        for lt in legacy_titles:
            db.query(Project).filter(Project.title == lt, Project.slug == None).delete(synchronize_session=False)

        # Upsert canonical projects
        for p_data in CANONICAL_PROJECTS:
            existing = db.query(Project).filter(
                (Project.slug == p_data["slug"]) | (Project.title == p_data["title"])
            ).first()

            if not existing:
                db.add(Project(**p_data))
            else:
                # Update attributes to keep canonical info, architecture, and Cloudinary URLs in sync
                for key, value in p_data.items():
                    setattr(existing, key, value)

        db.commit()
        print(f"Synced {len(CANONICAL_PROJECTS)} canonical projects successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error syncing canonical projects: {e}")
