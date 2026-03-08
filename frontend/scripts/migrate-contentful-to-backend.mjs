import { createClient } from "contentful";
import "dotenv/config";

const space =
  process.env.CONTENTFUL_SPACE_ID ||
  process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken =
  process.env.CONTENTFUL_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const apiBaseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000/api";
const adminToken = process.env.ADMIN_TOKEN || process.env.PORTFOLIO_ADMIN_TOKEN;
const adminUsername =
  process.env.ADMIN_USERNAME || process.env.PORTFOLIO_ADMIN_USERNAME;
const adminPassword =
  process.env.ADMIN_PASSWORD || process.env.PORTFOLIO_ADMIN_PASSWORD;

if (!space || !accessToken) {
  console.error(
    "Missing Contentful credentials. Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN.",
  );
  process.exit(1);
}

if (!adminToken && !(adminUsername && adminPassword)) {
  console.error(
    "Missing admin auth. Set ADMIN_TOKEN or ADMIN_USERNAME + ADMIN_PASSWORD.",
  );
  process.exit(1);
}

const client = createClient({ space, accessToken });

function imageUrl(asset) {
  const url = asset?.fields?.file?.url;
  return url ? `https:${url}` : undefined;
}

async function loadProjects() {
  const response = await client.getEntries({
    content_type: "project",
    include: 1,
  });

  return response.items.map((item) => ({
    projectTitle: item.fields.projectName || "Untitled Project",
    slug: item.fields.slug,
    description: item.fields.description || null,
    technologies: item.fields.technologies || [],
    coverImage: imageUrl(item.fields.featuredImage?.[0]),
    liveDemoLink: item.fields.liveUrl || "",
    sourceCodeLink: item.fields.sourceCodeUrl || "",
  }));
}

async function loadExperiences() {
  const response = await client.getEntries({
    content_type: "experiance",
    order: ["-fields.startDate"],
  });

  return response.items.map((item) => ({
    companyName: item.fields.companyName || "Unknown Company",
    jobTitle: item.fields.jobTitle || "Unknown Role",
    startDate: item.fields.startDate || "",
    endDate: item.fields.endDate || null,
    description: item.fields.description || null,
    location: item.fields.location || "",
  }));
}

async function loadCertifications() {
  const response = await client.getEntries({
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
    certificateImage: "",
  }));
}

async function loadBlogs() {
  const response = await client.getEntries({
    content_type: "blogPost",
    order: ["-fields.date"],
    include: 2,
  });

  return response.items.map((item) => {
    let authorName = "Unknown";
    const author = item.fields.author;
    if (author && typeof author === "object" && author.fields?.fullName) {
      authorName = author.fields.fullName;
    } else if (typeof author === "string") {
      authorName = author;
    }

    return {
      title: item.fields.title || "Untitled Post",
      slug: item.fields.slug,
      date: item.fields.date || "",
      featuredImage: imageUrl(item.fields.featuredImage),
      content: item.fields.content || null,
      author: authorName,
    };
  });
}

async function migrate() {
  const [projects, experiences, certifications, blogs] = await Promise.all([
    loadProjects(),
    loadExperiences(),
    loadCertifications(),
    loadBlogs(),
  ]);

  const headers = {
    "Content-Type": "application/json",
  };
  if (adminToken) {
    headers["x-admin-token"] = adminToken;
  } else {
    headers.Authorization = `Basic ${Buffer.from(`${adminUsername}:${adminPassword}`).toString("base64")}`;
  }

  const response = await fetch(`${apiBaseUrl}/admin/bootstrap`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      projects,
      experiences,
      certifications,
      blogs,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bootstrap failed (${response.status}): ${error}`);
  }

  const result = await response.json();
  console.log("Migration complete:", result);
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
