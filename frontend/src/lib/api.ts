const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port === "3000")
    ? "http://localhost:8000/api"
    : process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://nyxus-backend.onrender.com/api");

const API_BASE_URL = BACKEND_BASE;

/**
 * Hybrid image URL resolver.
 * - /uploads/...  → proxied through the backend (admin uploads stored on Render/local)
 * - res.cloudinary.com → injects f_auto,q_auto,w_<width> for instant WebP/AVIF + compression
 * - anything else  → returned as-is (local /images/..., absolute https, etc.)
 */
export function getImageUrl(
  url: string | null | undefined,
  width = 900
): string | null {
  if (!url) return null;

  // Case 1: Backend local upload (fallback when Cloudinary not configured)
  if (url.startsWith("/uploads/")) {
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${backendOrigin}${url}`;
  }

  // Case 2: Cloudinary — inject transformation params if not already present
  if (url.includes("res.cloudinary.com") && !url.includes("/f_auto")) {
    return url.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width},c_limit/`
    );
  }

  // Case 3: Local static file or any other URL — return as-is
  return url;
}

/**
 * Returns a tiny 40px blurred LQIP placeholder for Cloudinary images.
 * Only ~300 bytes — renders instantly as a blur before the real image loads.
 */
export function getBlurUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("res.cloudinary.com") && !url.includes("/f_auto")) {
    return url.replace(
      "/image/upload/",
      "/image/upload/f_auto,q_10,w_40,e_blur:1000/"
    );
  }
  return null;
}
export async function adminLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/projects/`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const res = await fetch(`${API_BASE_URL}/projects/slug/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (res.ok) return res.json();
  // Fallback to searching the full list in case of slug discrepancy or offline server
  const all = await getProjects();
  return all.find(p => p.slug === slug || String(p.id) === slug) || null;
}

export async function getProject(idOrSlug: string | number): Promise<Project | null> {
  // If numeric, try by ID first
  if (typeof idOrSlug === "number" || /^\d+$/.test(String(idOrSlug))) {
    const res = await fetch(`${API_BASE_URL}/projects/${idOrSlug}`, { cache: "no-store" });
    if (res.ok) return res.json();
  }
  // Try by slug
  return getProjectBySlug(String(idOrSlug));
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateProject(id: number, data: Omit<Project, "id">): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
}

// ─── Experience ───────────────────────────────────────────────────────────────
export interface Experience {
  id: number;
  job_title: string;
  company_name: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  order_index: number;
}

export async function getExperiences(): Promise<Experience[]> {
  const res = await fetch(`${API_BASE_URL}/experience/`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function createExperience(data: Omit<Experience, "id">): Promise<Experience> {
  const res = await fetch(`${API_BASE_URL}/experience/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateExperience(id: number, data: Omit<Experience, "id">): Promise<Experience> {
  const res = await fetch(`${API_BASE_URL}/experience/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteExperience(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/experience/${id}`, { method: "DELETE", headers: authHeaders() });
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
  const res = await fetch(`${API_BASE_URL}/certifications/`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function createCertification(data: Omit<Certification, "id">): Promise<Certification> {
  const res = await fetch(`${API_BASE_URL}/certifications/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCertification(id: number, data: Omit<Certification, "id">): Promise<Certification> {
  const res = await fetch(`${API_BASE_URL}/certifications/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCertification(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/certifications/${id}`, { method: "DELETE", headers: authHeaders() });
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
  const res = await fetch(`${API_BASE_URL}/blogs/`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE_URL}/blogs/all`, { headers: authHeaders(), cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function createBlog(data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const res = await fetch(`${API_BASE_URL}/blogs/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateBlog(id: number, data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBlog(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, { method: "DELETE", headers: authHeaders() });
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

export async function uploadFile(file: File, token: string): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to upload file");
  }
  
  const data = await res.json();
  // Adjust the URL if the backend is on a different origin in development
  if (data.url.startsWith("/")) {
    data.url = API_BASE_URL.replace("/api", "") + data.url;
  }
  return data;
}

export async function listUploads(
  token: string,
  nextCursor?: string
): Promise<{ images: UploadedImage[]; next_cursor?: string; source: string }> {
  const params = new URLSearchParams({ max_results: "40" });
  if (nextCursor) params.set("next_cursor", nextCursor);
  const res = await fetch(`${API_BASE_URL}/upload/?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to list uploads");
  return res.json();
}

export async function deleteUpload(publicId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/upload/${encodeURIComponent(publicId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete image");
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
  const res = await fetch(`${API_BASE_URL}/skills`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function createSkill(data: Omit<Skill, "id">): Promise<Skill> {
  const res = await fetch(`${API_BASE_URL}/skills`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSkill(id: number, data: Omit<Skill, "id">): Promise<Skill> {
  const res = await fetch(`${API_BASE_URL}/skills/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteSkill(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/skills/${id}`, { method: "DELETE", headers: authHeaders() });
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
  const res = await fetch(`${API_BASE_URL}/about`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function updateAbout(data: Omit<About, "id">): Promise<About> {
  const res = await fetch(`${API_BASE_URL}/about`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
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
