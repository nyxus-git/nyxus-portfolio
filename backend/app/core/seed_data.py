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
from ..models.experience import Experience

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
        "live_url": "https://docmind.rohanmane.dev",
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
        table_names = insp.get_table_names()
        dialect = engine.dialect.name

        with engine.begin() as conn:
            # 1. Projects Table Migration
            if "projects" in table_names:
                columns = [c["name"] for c in insp.get_columns("projects")]
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
                    if "is_visible" not in columns:
                        conn.execute(text("ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_visible INTEGER DEFAULT 1;"))
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
                    if "is_visible" not in columns:
                        conn.execute(text("ALTER TABLE projects ADD COLUMN is_visible INTEGER DEFAULT 1;"))

            # 2. Experiences Table Migration
            if "experiences" in table_names:
                exp_columns = [c["name"] for c in insp.get_columns("experiences")]
                if dialect == "postgresql":
                    if "company_url" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN IF NOT EXISTS company_url VARCHAR(500);"))
                    if "role_type" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN IF NOT EXISTS role_type VARCHAR(100);"))
                    if "highlights" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN IF NOT EXISTS highlights JSON DEFAULT '[]'::json;"))
                    if "skills" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN IF NOT EXISTS skills JSON DEFAULT '[]'::json;"))
                    if "projects" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN IF NOT EXISTS projects JSON DEFAULT '[]'::json;"))
                else:
                    # SQLite
                    if "company_url" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN company_url VARCHAR(500);"))
                    if "role_type" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN role_type VARCHAR(100);"))
                    if "highlights" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN highlights JSON DEFAULT '[]';"))
                    if "skills" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN skills JSON DEFAULT '[]';"))
                    if "projects" not in exp_columns:
                        conn.execute(text("ALTER TABLE experiences ADD COLUMN projects JSON DEFAULT '[]';"))
    except Exception as e:
        print(f"Schema check error (non-fatal): {e}")


def sync_canonical_projects(db: Session):
    """
    Ensures the 7 flagship GenAI projects are always present and up-to-date.

    Safe rules:
    - Text fields (title, description, tech_stack, features, architecture…) are
      always kept in sync with CANONICAL_PROJECTS so editorial fixes propagate.
    - image_url and screenshots are only written if the stored value is still
      the default local path (/images/projects/…).  This means any custom
      URL you've uploaded via the admin panel is NEVER overwritten on deploy.
    """
    # Fields that are always synced (content/metadata)
    ALWAYS_SYNC = {
        "title", "slug", "tagline", "description", "long_description",
        "features", "architecture", "tech_stack",
        "github_url", "live_url", "featured", "order_index",
    }
    # Image fields — only overwrite if the stored value is still the local default
    IMAGE_FIELDS = {"image_url", "screenshots"}

    def _is_default_local(value) -> bool:
        """Returns True if the value is unset, a default local static path, or legacy cloudinary."""
        if value is None:
            return True
        if isinstance(value, str):
            return value.startswith("/images/projects/") or "cloudinary" in value
        if isinstance(value, list):
            if len(value) == 0:
                return False
            return all(
                (v is None or (isinstance(v, str) and (v.startswith("/images/projects/") or "cloudinary" in v)))
                for v in value
            )
        return False

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
                for key, value in p_data.items():
                    if key in ALWAYS_SYNC:
                        setattr(existing, key, value)
                    elif key in IMAGE_FIELDS:
                        current = getattr(existing, key, None)
                        if _is_default_local(current):
                            # Still the default — safe to update from canonical
                            setattr(existing, key, value)
                        # else: custom uploaded URL is set — leave it alone

        db.commit()
        print(f"Synced {len(CANONICAL_PROJECTS)} canonical projects successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error syncing canonical projects: {e}")


CANONICAL_EXPERIENCES: List[Dict[str, Any]] = [
    {
        "job_title": "Junior ML Engineer",
        "company_name": "SAMPRO LICENSE INDIA PRIVATE LIMITED",
        "company_url": "https://samprolicense.com",
        "role_type": "Full-Time",
        "location": "Wakad, Pune",
        "start_date": "Dec 2024",
        "end_date": "Present",
        "description": "Worked on multiple production-grade AI, enterprise software, and EdTech applications, focusing on Python backend development, Generative AI integrations, REST API development, application development, cloud infrastructure, DevOps, CI/CD pipelines, and production deployment. Responsibilities included developing backend functionality, integrating third-party services, managing cloud environments, implementing application monitoring, handling application releases, and maintaining production applications.",
        "highlights": [
            "Architected CI/CD pipelines and Docker-based containerization for multi-environment production applications on Microsoft Azure.",
            "Integrated Groq LLM APIs to power low-latency AI-driven resume generation, cover letters, and career coaching features.",
            "Engineered and integrated Sentry for real-time application error tracking, performance monitoring, and production reliability.",
            "Managed mobile build automation (AAB via Expo) and publishing workflows on Google Play Console for Navya English School.",
            "Integrated Zoom SDK into the LearnWithJD platform for host/participant webinar sessions, meeting auth, and email marketing workflows.",
            "Developed RESTful backend services in Python, Flask, and FastAPI with Razorpay payment processing and Google OAuth."
        ],
        "skills": [
            "Python", "Flask", "React.js", "Next.js", "React Native", "Expo",
            "Groq API", "Docker", "Microsoft Azure", "CI/CD", "Sentry", "Nginx",
            "Razorpay", "Google OAuth", "Telegram Bot API", "Zoom SDK",
            "REST APIs", "Google Play Console", "Android"
        ],
        "projects": [
            {
                "name": "Smart Resume – AI-Powered Resume Builder",
                "tagline": "AI-Powered Career Development & ATS Resume Generation Platform",
                "description": "Smart Resume is an AI-powered career development platform designed to help users generate professional resumes and cover letters and access AI-powered career assistance.",
                "role": "Backend & AI Developer",
                "category": "Generative AI | Backend Development | Automation | DevOps",
                "is_published": True,
                "live_url": "https://smartresume.samprolicense.com/",
                "github_url": None,
                "links": [
                    {"label": "Live Application", "url": "https://smartresume.samprolicense.com/", "display_order": 0}
                ],
                "responsibilities": [
                    "Developed and maintained backend APIs using Python and Flask.",
                    "Integrated Groq LLM APIs to power AI-driven application features.",
                    "Implemented AI-based resume generation and cover letter generation.",
                    "Integrated Telegram automation bot functionality into the Smart Resume platform.",
                    "Worked on Smart Job Hunts and automated daily job alert functionality.",
                    "Contributed to AI-powered interview coaching functionality.",
                    "Implemented email automation for lead marketing, user communication, and plan-related workflows.",
                    "Worked on Razorpay payment integration and resolved payment-related issues.",
                    "Worked on Google OAuth authentication and logout functionality.",
                    "Integrated Sentry for application error tracking and performance monitoring.",
                    "Troubleshot backend issues and production bugs.",
                    "Resolved application integration and deployment-related issues.",
                    "Created and maintained CI/CD pipelines for application deployment.",
                    "Implemented Docker-based application containerization.",
                    "Configured Azure App Services and application instances.",
                    "Managed production, staging, and pre-production environments.",
                    "Handled application deployment, testing, and release workflows.",
                    "Configured SSL certificates and supported Nginx infrastructure."
                ],
                "impact": [
                    "Integrated Groq LLM for AI resume and cover letter generation with sub-second response times.",
                    "Containerized and deployed to Azure App Services with automated CI/CD workflows.",
                    "Integrated Sentry for real-time error tracking and performance monitoring across production environments.",
                    "Integrated Telegram automation bot directly into the platform workflow."
                ],
                "tech_stack": [
                    "Python", "Flask", "React.js", "Next.js", "Groq API", "Docker",
                    "Microsoft Azure", "CI/CD", "Sentry", "Nginx", "Razorpay", "Google OAuth", "Telegram Bot API"
                ]
            },
            {
                "name": "Navya English Medium School – Web & Android Application",
                "tagline": "Institutional School Management Ecosystem (Web & Android Mobile)",
                "description": "Navya English Medium School is a school application ecosystem consisting of a web platform and Android mobile application providing digital school-related services and administrative functionality.",
                "role": "Full-Stack & Mobile Developer",
                "category": "Full-Stack Development | Mobile Application | Deployment | Release Management",
                "is_published": True,
                "live_url": "https://navyaenglishschool.com/",
                "github_url": None,
                "links": [
                    {"label": "Website", "url": "https://navyaenglishschool.com/", "display_order": 0},
                    {"label": "Android App", "url": "https://play.google.com/store/apps/details?id=com.navyaenglish.app", "display_order": 1}
                ],
                "responsibilities": [
                    "Worked on web application development using React.js and Next.js.",
                    "Contributed to administrative-side functionality.",
                    "Worked on application maintenance and integration.",
                    "Worked on Android mobile application development using React Native.",
                    "Used Expo and local development environments for application build preparation.",
                    "Generated Android App Bundle (.aab) files using the local development setup and Expo.",
                    "Managed mobile application build and deployment processes.",
                    "Prepared Android application releases.",
                    "Managed new releases through Google Play Console.",
                    "Handled Play Store release preparation and publishing workflows.",
                    "Supported application deployment and release-related troubleshooting."
                ],
                "impact": [
                    "Generated Android App Bundle (.aab) for production Play Store release via Expo.",
                    "Managed Google Play Console release preparation, signing, and publishing workflows.",
                    "Delivered web and mobile applications for institutional school services."
                ],
                "tech_stack": ["React.js", "Next.js", "React Native", "Expo", "Android", "AAB", "Google Play Console"]
            },
            {
                "name": "HRMS – Incident & SLA Management System",
                "tagline": "Enterprise Incident Management & Automated SLA Escalation Engine",
                "description": "An HRMS platform with Incident and SLA Management functionality designed to manage incidents, automatically assign priorities, monitor resolution workflows, and support escalation management.",
                "role": "Backend Developer",
                "category": "Enterprise Software | Backend Development | Workflow Automation",
                "is_published": True,
                "live_url": "https://hr.samprolicense.com/",
                "github_url": None,
                "links": [
                    {"label": "Live Application", "url": "https://hr.samprolicense.com/", "display_order": 0}
                ],
                "responsibilities": [
                    "Worked on Incident Management module development.",
                    "Implemented incident creation and management workflows.",
                    "Developed automatic priority assignment based on impact and urgency.",
                    "Implemented P1, P2, P3, and P4 priority classification.",
                    "Worked on SLA tracking and management workflows.",
                    "Implemented priority-based escalation matrix logic.",
                    "Contributed to incident status management and resolution workflows.",
                    "Worked on backend business logic and application integration."
                ],
                "impact": [
                    "Developed automatic priority assignment (P1, P2, P3, P4) based on impact and urgency matrix.",
                    "Implemented SLA tracking and escalation workflows for incident resolution.",
                    "Engineered backend business logic and REST APIs for enterprise workflows."
                ],
                "tech_stack": ["Backend Development", "REST APIs", "Incident Management", "SLA Management", "Workflow Automation"]
            },
            {
                "name": "LearnWithJD – EdTech Platform & Zoom SDK Integration",
                "tagline": "EdTech Platform with Zoom SDK Integration & Marketing Automation",
                "description": "An educational platform supporting online training, webinar management, and student engagement workflows.",
                "role": "Backend & Integration Developer",
                "category": "EdTech | Zoom SDK Integration | Webinar Management | Email Automation",
                "is_published": True,
                "live_url": "https://learnwithjd.in/",
                "github_url": None,
                "links": [
                    {"label": "Website", "url": "https://learnwithjd.in/", "display_order": 0}
                ],
                "responsibilities": [
                    "Integrated Zoom SDK into the LearnWithJD platform.",
                    "Worked on admin-side webinar creation and management.",
                    "Implemented webinar joining workflows using generated meeting links.",
                    "Worked on host and participant joining functionality.",
                    "Integrated embedded Zoom meeting functionality into the platform.",
                    "Worked on meeting authentication and user identity handling.",
                    "Worked on lead collection and email marketing automation workflows.",
                    "Organized leads collected from LinkedIn polls and form responses.",
                    "Prepared structured lead datasets.",
                    "Worked on lead segmentation for ITAM Tool and SAM Corporate Training.",
                    "Prepared email campaigns for training promotion and user communication."
                ],
                "impact": [
                    "Integrated Zoom SDK for host/participant webinar joining and embedded meetings.",
                    "Built webinar creation and admin management workflows.",
                    "Automated lead collection and email campaign segmentation for corporate training."
                ],
                "tech_stack": ["Zoom SDK", "API Integration", "Webinar Management", "Authentication", "Email Automation", "Lead Management"]
            }
        ],
        "order_index": 0
    },
    {
        "job_title": "Research & Development Intern",
        "company_name": "DIAT, DRDO (Defence Institute of Advanced Technology)",
        "company_url": "https://diat.ac.in",
        "role_type": "Research Internship",
        "location": "Khadakwasla, Pune",
        "start_date": "Feb 2024",
        "end_date": "Aug 2024",
        "description": "Conducted low-level hardware security research focusing on Trusted Platform Module (TPM) verification, boot integrity, and hardware-backed cryptographic trust architectures.",
        "highlights": [
            "Implemented boot-level secure cryptographic hash computation utilizing physical TPM 2.0 hardware.",
            "Authored a custom Assembly-based secure bootloader enabling direct bare-metal interaction with TPM PCR registers.",
            "Engineered OS-independent hardware-backed trust validation workflows."
        ],
        "skills": ["C / C++", "x86 / x86_64 Assembly", "TPM 2.0", "Hardware Security", "Linux Kernel", "Cryptography"],
        "projects": [
            {
                "name": "TPM 2.0 Hardware-Backed Secure Bootloader",
                "tagline": "Bare-Metal Cryptographic Integrity Verification System",
                "description": "Custom low-level bootloader executing in 16-bit real mode and transition to 32/64-bit protected mode, querying TPM hardware to measure system binaries before handing control to the OS.",
                "role": "R&D Systems Researcher",
                "live_url": None,
                "github_url": None,
                "impact": [
                    "Interfaced directly with TPM 2.0 MMIO space using bare-metal assembly.",
                    "Measured and extended PCR registers to ensure zero tampering across firmware stages.",
                    "Engineered fail-safe cryptographic reboot triggers on unauthorized binary mutations."
                ],
                "tech_stack": ["x86 Assembly", "C", "TPM 2.0", "QEMU", "GDB", "GRUB Architecture"]
            }
        ],
        "order_index": 1
    },
    {
        "job_title": "Internship Trainee",
        "company_name": "Kasnet Technologies",
        "company_url": None,
        "role_type": "Internship",
        "location": "Baramati, Pune",
        "start_date": "Aug 2021",
        "end_date": "Sep 2021",
        "description": "Developed full-stack web applications and institutional software solutions.",
        "highlights": [
            "Independently engineered and deployed an automated Attendance Management System.",
            "Constructed responsive dashboards with vanilla JavaScript, Python, and relational database schemas."
        ],
        "skills": ["Python", "JavaScript", "SQL", "HTML5", "CSS3"],
        "projects": [
            {
                "name": "Institutional Attendance Management System",
                "tagline": "Automated Attendance & Staff Reporting Platform",
                "description": "End-to-end attendance tracker logging employee / student check-in timestamps with real-time exportable CSV telemetry.",
                "role": "Software Developer Trainee",
                "live_url": None,
                "github_url": None,
                "impact": [
                    "Built full-stack CRUD application automating daily check-in workflows.",
                    "Designed normalized relational schema reducing duplicate entries by 100%."
                ],
                "tech_stack": ["Python", "JavaScript", "SQLite", "Bootstrap"]
            }
        ],
        "order_index": 2
    }
]


def sync_canonical_experiences(db: Session):
    """
    Ensures work experiences are up to date with rich project and impact dossiers.
    """
    try:
        # Check if legacy experiences exist (e.g. Freelance Web Developer) and clean up
        legacy_titles = ["Freelance Web Developer", "Open Source Contributor"]
        for lt in legacy_titles:
            db.query(Experience).filter(Experience.job_title == lt).delete(synchronize_session=False)

        # Clean up any duplicate SAMPRO records
        sampro_rows = db.query(Experience).filter(
            (Experience.company_name.ilike("%sampro%")) |
            (Experience.job_title.ilike("%ML Engineer%"))
        ).all()
        if len(sampro_rows) > 1:
            for extra in sampro_rows[1:]:
                db.delete(extra)
            db.commit()

        for exp_data in CANONICAL_EXPERIENCES:
            if "sampro" in exp_data["company_name"].lower():
                existing = db.query(Experience).filter(
                    (Experience.company_name.ilike("%sampro%")) |
                    (Experience.job_title == exp_data["job_title"])
                ).first()
            elif "drdo" in exp_data["company_name"].lower() or "diat" in exp_data["company_name"].lower():
                existing = db.query(Experience).filter(
                    (Experience.company_name.ilike("%drdo%")) |
                    (Experience.company_name.ilike("%diat%"))
                ).first()
            else:
                existing = db.query(Experience).filter(
                    Experience.company_name == exp_data["company_name"]
                ).first()

            if not existing:
                db.add(Experience(**exp_data))
            else:
                for key, value in exp_data.items():
                    setattr(existing, key, value)

        db.commit()
        print(f"Synced {len(CANONICAL_EXPERIENCES)} canonical experiences successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error syncing canonical experiences: {e}")


