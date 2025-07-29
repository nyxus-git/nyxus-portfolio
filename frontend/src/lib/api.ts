// frontend/src/lib/api.ts
// This file handles communication with the backend API.

// Get the base URL from the environment variable (set in .env.local)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// --- Project API Calls ---

// Fetch all projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }
  return response.json();
};

// Fetch a single project by ID (optional, for a project detail page)
export const getProjectById = async (id: number): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch project ${id}: ${response.statusText}`);
  }
  return response.json();
};

// --- Contact API Calls ---

// Send a contact message
export const sendContactMessage = async (messageData: ContactFormData): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/contact/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });

  if (!response.ok) {
    // Try to get error message from response body
    let errorMessage = `Failed to send message: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      // Ignore if error response isn't JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// --- Types for API Data (Define them here or in a separate types file) ---

// Define the structure of a Project based on your backend schema
export type Project = {
  id: number;
  title: string;
  description: string;
  tech_stack: string[]; // Matches the backend model
  // Add image_url, demo_link, github_link here if you add them to the backend later
};

// Define the structure of Contact Form Data
export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};
