// Call our FastAPI backend which proxies to HuggingFace (avoids CORS)
const BACKEND_BASE = "https://nyxus-backend.onrender.com/api";

const API_BASE_URL = BACKEND_BASE;
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
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: number;
  order_index: number;
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/projects/`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
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
export async function uploadFile(file: File, token: string): Promise<{ url: string; filename: string }> {
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
