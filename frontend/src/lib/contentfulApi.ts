import { Document } from "@contentful/rich-text-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export interface Certification {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string[];
  certificateImage?: string;
}

export interface Project {
  id?: string;
  projectTitle: string;
  description: Document;
  technologies: string[];
  coverImage?: string;
  liveDemoLink?: string;
  sourceCodeLink?: string;
  slug: string;
}

export interface Experience {
  id?: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  description?: Document;
  location?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  date: string;
  featuredImage?: string;
  description?: string;
  content?: Document;
  author?: string;
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    return await fetchJson<Certification[]>(`${API_BASE_URL}/certifications`);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    return await fetchJson<Project[]>(`${API_BASE_URL}/projects`);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getExperience(): Promise<Experience[]> {
  try {
    return await fetchJson<Experience[]>(`${API_BASE_URL}/experiences`);
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    return await fetchJson<BlogPost[]>(`${API_BASE_URL}/blogs`);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await fetchJson<BlogPost>(`${API_BASE_URL}/blogs/${slug}`);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
