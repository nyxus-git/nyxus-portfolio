import { getContentfulClient } from "./contentfulClient";
import { EntrySkeletonType } from "contentful";
import { Document } from "@contentful/rich-text-types";

// --- Certifications ---
export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string[];
  certificateImage?: string;
}

interface CertificationSkeleton extends EntrySkeletonType {
  contentTypeId: "certification";
  fields: {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    credentialId?: string;
    credentialUrl?: string;
    skills?: string[];
  };
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const response = await getContentfulClient().getEntries<CertificationSkeleton>({
      content_type: "certification",
      include: 1,
    });

    return response.items.map((item) => ({
      name: item.fields.name || "Unknown",
      issuingOrganization: item.fields.issuingOrganization || "Unknown",
      issueDate: item.fields.issueDate || "",
      credentialId: item.fields.credentialId || "",
      credentialUrl: item.fields.credentialUrl || "",
      skills: item.fields.skills || [],
    }));
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
}

// --- Projects ---
export interface Project {
  projectTitle: string;
  description: Document;
  technologies: string[];
  coverImage?: string;
  liveDemoLink?: string;
  sourceCodeLink?: string;
  slug: string;
}

interface ProjectSkeleton extends EntrySkeletonType {
  contentTypeId: "project";
  fields: {
    projectName: string;
    slug: string;
    description: Document;
    technologies?: string[];
    featuredImage?: { fields: { file: { url: string } } }[];
    liveUrl?: string;
    sourceCodeUrl?: string;
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await getContentfulClient().getEntries<ProjectSkeleton>({
      content_type: "project",
      include: 1,
    });

    return response.items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const coverImage = (item.fields.featuredImage as any)?.[0]?.fields?.file?.url;

      return {
        projectTitle: item.fields.projectName || "Untitled Project",
        description: item.fields.description,
        technologies: item.fields.technologies || [],
        coverImage: coverImage ? `https:${coverImage}` : undefined,
        liveDemoLink: item.fields.liveUrl,
        sourceCodeLink: item.fields.sourceCodeUrl,
        slug: item.fields.slug,
      };
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// --- Experience ---
export interface Experience {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  description?: Document;
  location?: string;
}

interface ExperienceSkeleton extends EntrySkeletonType {
  contentTypeId: "experiance";
  fields: {
    companyName: string;
    jobTitle: string;
    startDate: string;
    endDate?: string;
    description?: Document;
    location?: string;
  };
}

export async function getExperience(): Promise<Experience[]> {
  try {
    const response = await getContentfulClient().getEntries<ExperienceSkeleton>({
      content_type: "experiance",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: ["-fields.startDate"] as any,
    });

    return response.items.map((item) => ({
      companyName: item.fields.companyName || "Unknown Company",
      jobTitle: item.fields.jobTitle || "Unknown Role",
      startDate: item.fields.startDate || "",
      endDate: item.fields.endDate,
      description: item.fields.description,
      location: item.fields.location,
    }));
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}

// --- Blogs ---
export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  featuredImage?: string;
  description?: string;
  content?: Document;
  author?: string;
}

interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: "blogPost";
  fields: {
    title: string;
    slug: string;
    date: string;
    featuredImage?: { fields: { file: { url: string } } };
    content?: Document;
    author?: string;
  };
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const response = await getContentfulClient().getEntries<BlogPostSkeleton>({
      content_type: "blogPost",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: ["-fields.date"] as any,
      include: 2,
    });

    return response.items.map((item) => {
      let authorName = "Unknown";
      // Runtime check for linked entry
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (item.fields.author && (item.fields.author as any).fields && (item.fields.author as any).fields.fullName) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authorName = (item.fields.author as any).fields.fullName;
      } else if (typeof item.fields.author === 'string') {
        authorName = item.fields.author;
      }

      return {
        title: item.fields.title || "Untitled Post",
        slug: item.fields.slug,
        date: item.fields.date,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        featuredImage: (item.fields.featuredImage as any)?.fields?.file?.url
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? `https:${(item.fields.featuredImage as any).fields.file.url}`
          : undefined,
        content: item.fields.content,
        author: authorName,
      };
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await getContentfulClient().getEntries<BlogPostSkeleton>({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
      include: 2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    if (response.items.length === 0) return null;

    const item = response.items[0];
    let authorName = "Unknown";
    // Runtime check for linked entry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (item.fields.author && (item.fields.author as any).fields && (item.fields.author as any).fields.fullName) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorName = (item.fields.author as any).fields.fullName;
    } else if (typeof item.fields.author === 'string') {
      authorName = item.fields.author;
    }

    return {
      title: item.fields.title || "Untitled Post",
      slug: item.fields.slug,
      date: item.fields.date,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      featuredImage: (item.fields.featuredImage as any)?.fields?.file?.url
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? `https:${(item.fields.featuredImage as any).fields.file.url}`
        : undefined,
      content: item.fields.content,
      author: authorName,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
