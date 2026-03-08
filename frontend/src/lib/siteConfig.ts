const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export interface SiteConfig {
  resumeUrl: string;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-config`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return { resumeUrl: "/Rohan_Resume.pdf" };
    }
    const data = (await response.json()) as Partial<SiteConfig>;
    return { resumeUrl: data.resumeUrl || "/Rohan_Resume.pdf" };
  } catch {
    return { resumeUrl: "/Rohan_Resume.pdf" };
  }
}
