const PROD_API_BASE_URL = "https://nyxus-backend.onrender.com/api";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port === "3000")
    ? "http://127.0.0.1:8000/api"
    : process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api"
    : PROD_API_BASE_URL);

const API_BASE_URL = BACKEND_BASE;

/**
 * Resilient fetch wrapper:
 * 1. Attempts request against API_BASE_URL (defaults to local 127.0.0.1:8000).
 * 2. If connection fails / NetworkError occurs while running locally, automatically
 *    falls back to production backend (nyxus-backend.onrender.com).
 */
export async function safeApiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const primaryUrl = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (primaryErr) {
    // If local fetch fails (e.g. backend offline / restarting / network error),
    // and we're currently trying local backend, attempt fallback to production API
    if (API_BASE_URL.includes("localhost") || API_BASE_URL.includes("127.0.0.1")) {
      const fallbackUrl = `${PROD_API_BASE_URL}${cleanEndpoint}`;
      try {
        console.warn(`[API] Local backend unreachable at ${primaryUrl}, falling back to production API...`);
        const fallbackRes = await fetch(fallbackUrl, options);
        return fallbackRes;
      } catch {
        // Both failed, throw original error
      }
    }
    throw primaryErr;
  }
}

/**
 * Image URL resolver.
 * - Legacy Cloudinary URLs → automatically mapped to local /images/... path
 * - /uploads/...  → /images/uploads/...
 * - /images/... or any relative path → returned as-is (served by Next.js static files)
 * - Absolute URLs (https://...) → returned as-is
 */
export function getImageUrl(
  url: string | null | undefined,
  _width = 900
): string | null {
  if (!url) return null;

  // Legacy compat: map known seeded Cloudinary URLs to local static paths
  if (url.includes("res.cloudinary.com")) {
    const filename = url.split("/").pop() || "";
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const projectWebpNames = [
      "nyxai_cover", "nyxai_voice", "docmind_cover", "docmind_rag",
      "voicecanvas_cover", "voicecanvas_editor", "codesage_cover", "codesage_ast",
      "chronoai_cover", "chronoai_meeting", "morphlens_cover", "morphlens_analytics",
      "dreamforge_cover", "dreamforge_viewport"
    ];
    if (projectWebpNames.includes(nameWithoutExt)) {
      return `/images/projects/${nameWithoutExt}.webp`;
    }
    if (["ml_roadmap.jpg", "arch_linux.png", "neural_net.png"].includes(filename)) {
      return `/images/blogs/${filename}`;
    }
    if (filename.includes("profile")) {
      return "/profile.jpeg";
    }
    if (["yz3mvks64tidtjsxmiki.png", "bujxvn5q3le3umo6ysju.png", "zq3jxhewh181z4btqzug.png"].includes(filename)) {
      return `/images/uploads/${filename}`;
    }
    return url;
  }

  // Legacy compat: old /uploads/... path mapped to /images/uploads/...
  if (url.startsWith("/uploads/")) {
    return url.replace("/uploads/", "/images/uploads/");
  }

  // Local static file (/images/...) or any other URL — return as-is
  return url;
}

/**
 * Always returns null — no LQIP blur placeholders in local-static mode.
 */
export function getBlurUrl(_url: string | null | undefined): string | null {
  return null;
}

export async function adminLogin(username: string, password: string): Promise<string> {
  const res = await safeApiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  return data.access_token;
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handleAuthError(res: Response): void {
  if ((res.status === 401 || res.status === 403) && typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.href = "/admin/login?expired=1";
    }
  }
}

export async function verifyAdminToken(): Promise<boolean> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  if (!token) return false;
  try {
    let res = await safeApiFetch("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 404) {
      // Compat fallback if backend hasn't restarted with /auth/verify yet
      res = await safeApiFetch("/projects/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
    }
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("admin_token");
      return false;
    }
    return res.ok;
  } catch {
    return true;
  }
}

// ─── Project ─────────────────────────────────────────────────────────────────
export interface Project {
  id: number;
  slug?: string | null;
  title: string;
  tagline?: string | null;
  description: string;
  long_description?: string | null;
  features?: string[];
  architecture?: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  screenshots?: string[];
  featured: number;
  order_index: number;
  is_visible?: number; // 1 = public, 0 = hidden
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await safeApiFetch("/projects/", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch projects:", err);
    return [];
  }
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const res = await safeApiFetch("/projects/admin/all", {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(`Failed to fetch admin projects (${res.status})`);
  }
  return res.json();
}

export async function toggleProjectVisibility(id: number): Promise<Project> {
  const res = await safeApiFetch(`/projects/${id}/visibility`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(await res.text());
  }
  return res.json();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await safeApiFetch(`/projects/slug/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (res.ok) return await res.json();
    // Fallback to searching the full list in case of slug discrepancy or offline server
    const all = await getProjects();
    return all.find((p) => p.slug === slug || String(p.id) === slug) || null;
  } catch (err) {
    console.warn(`Failed to fetch project by slug (${slug}):`, err);
    return null;
  }
}

export async function getProject(idOrSlug: string | number): Promise<Project | null> {
  try {
    // If numeric, try by ID first
    if (typeof idOrSlug === "number" || /^\d+$/.test(String(idOrSlug))) {
      const res = await safeApiFetch(`/projects/${idOrSlug}`, { cache: "no-store" });
      if (res.ok) return await res.json();
    }
    // Try by slug
    return await getProjectBySlug(String(idOrSlug));
  } catch (err) {
    console.warn(`Failed to fetch project (${idOrSlug}):`, err);
    return null;
  }
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  const res = await safeApiFetch("/projects/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateProject(id: number, data: Omit<Project, "id">): Promise<Project> {
  const res = await safeApiFetch(`/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await safeApiFetch(`/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ─── Experience ───────────────────────────────────────────────────────────────
export interface ProjectLink {
  label: string;
  url: string;
  display_order?: number;
}

export interface CompanyProject {
  name: string;
  tagline?: string | null;
  description?: string | null;
  role?: string | null;
  category?: string | null;
  is_published?: boolean;
  // Legacy single-URL fields (kept for backward compat)
  live_url?: string | null;
  github_url?: string | null;
  // Multi-link support
  links?: ProjectLink[];
  // Responsibilities (detailed bullet points)
  responsibilities?: string[];
  impact: string[];
  tech_stack: string[];
}

export interface Experience {
  id: number;
  job_title: string;
  company_name: string;
  company_url?: string | null;
  role_type?: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  highlights?: string[];
  skills?: string[];
  projects?: CompanyProject[];
  order_index: number;
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const res = await safeApiFetch("/experience/", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch experiences:", err);
    return [];
  }
}

export async function getExperience(id: number | string): Promise<Experience | null> {
  try {
    const res = await safeApiFetch(`/experience/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch experience (${id}):`, err);
    return null;
  }
}

export async function createExperience(data: Omit<Experience, "id">): Promise<Experience> {
  const res = await safeApiFetch("/experience/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateExperience(id: number, data: Omit<Experience, "id">): Promise<Experience> {
  const res = await safeApiFetch(`/experience/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteExperience(id: number): Promise<void> {
  const res = await safeApiFetch(`/experience/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ─── Certification ────────────────────────────────────────────────────────────
export interface Certification {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  credential_id: string | null;
  credential_url: string | null;
  skills: string[];
  image_url: string | null;
  order_index: number;
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const res = await safeApiFetch("/certifications/", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch certifications:", err);
    return [];
  }
}

export async function createCertification(data: Omit<Certification, "id">): Promise<Certification> {
  const res = await safeApiFetch("/certifications/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCertification(id: number, data: Omit<Certification, "id">): Promise<Certification> {
  const res = await safeApiFetch(`/certifications/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCertification(id: number): Promise<void> {
  const res = await safeApiFetch(`/certifications/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  author: string;
  date: string;
  tags: string | null;
  published: number;
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await safeApiFetch("/blogs/", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch blogs:", err);
    return [];
  }
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  const res = await safeApiFetch("/blogs/all", {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(`Failed to fetch blogs (${res.status})`);
  }
  return res.json();
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await safeApiFetch(`/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch blog (${slug}):`, err);
    return null;
  }
}

export async function createBlog(data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const res = await safeApiFetch("/blogs/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateBlog(id: number, data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const res = await safeApiFetch(`/blogs/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBlog(id: number): Promise<void> {
  const res = await safeApiFetch(`/blogs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ─── File Upload ─────────────────────────────────────────────────────────────
export interface UploadedImage {
  url: string;
  public_id: string;
  filename: string;
  width?: number;
  height?: number;
  bytes?: number;
  created_at?: string;
  format?: string;
}

export async function uploadFile(
  file: File,
  token: string,
  replaceUrl?: string | null
): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);
  if (replaceUrl) {
    formData.append("replace_url", replaceUrl);
  }

  const res = await safeApiFetch("/upload/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    handleAuthError(res);
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to upload file");
  }

  return res.json();
}

export async function listUploads(
  token: string,
  nextCursor?: string
): Promise<{ images: UploadedImage[]; next_cursor?: string; source: string }> {
  const params = new URLSearchParams({ max_results: "40" });
  if (nextCursor) params.set("next_cursor", nextCursor);
  const res = await safeApiFetch(`/upload/?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    handleAuthError(res);
    throw new Error("Failed to list uploads");
  }
  return res.json();
}

export async function deleteUpload(publicId: string, token: string): Promise<void> {
  const res = await safeApiFetch(`/upload/${encodeURIComponent(publicId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    handleAuthError(res);
    throw new Error("Failed to delete image");
  }
}

// ─── Skills ───────────────────────────────────────────────────────────────────
export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  order_index: number;
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const res = await safeApiFetch("/skills", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch skills:", err);
    return [];
  }
}

export async function createSkill(data: Omit<Skill, "id">): Promise<Skill> {
  const res = await safeApiFetch("/skills", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSkill(id: number, data: Omit<Skill, "id">): Promise<Skill> {
  const res = await safeApiFetch(`/skills/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteSkill(id: number): Promise<void> {
  const res = await safeApiFetch(`/skills/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ─── About ────────────────────────────────────────────────────────────────────
export interface About {
  id: number;
  name: string;
  tagline: string | null;
  bio: string | null;
  bio2: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  leetcode_url: string | null;
  resume_url: string | null;
  profile_image: string | null;
  roles: string | null;
}

export async function getAbout(): Promise<About | null> {
  try {
    const res = await safeApiFetch("/about", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch about:", err);
    return null;
  }
}

export async function updateAbout(data: Omit<About, "id">): Promise<About> {
  const res = await safeApiFetch("/about", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactMessage(data: ContactFormData): Promise<{ message: string }> {
  const res = await fetch(`/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(err.detail || err.message || `HTTP error ${res.status}`);
  }
  return res.json();
}
