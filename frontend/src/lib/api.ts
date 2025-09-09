const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

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
      cache: 'no-store'
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

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactMessage(data: ContactFormData): Promise<{ message: string }> {
  try {
    // The change is here: using a relative path for the Next.js API route
    const response = await fetch(`/api/contact`, {
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
