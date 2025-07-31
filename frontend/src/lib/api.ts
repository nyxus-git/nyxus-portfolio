// frontend/src/lib/api.ts

// Use NEXT_PUBLIC_API_BASE_URL from environment variables for Vercel deployment.
// Fallback to http://localhost:8000/api/v1 for local development.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// --- Project API Definitions ---

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_path: string | null;
  image_url: string | null;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/`, {
      cache: 'no-store' // This tells Next.js and the browser NOT to cache this response.
                        // Every call to getProjects will now go to the network.
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: Project[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
}

// --- Contact Form API Definitions ---

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Ensure this function is EXPORTED
export async function sendContactMessage(data: ContactFormData): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to send contact message:", error);
    throw error;
  }
}