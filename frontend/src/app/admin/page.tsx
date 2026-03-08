"use client";

import { useEffect, useMemo, useState } from "react";

type CollectionKey = "projects" | "experiences" | "certifications" | "blogs";

type ProjectForm = {
  projectTitle: string;
  slug: string;
  descriptionText: string;
  technologiesText: string;
  coverImage: string;
  liveDemoLink: string;
  sourceCodeLink: string;
};

type ExperienceForm = {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  location: string;
  descriptionText: string;
};

type CertificationForm = {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skillsText: string;
  certificateImage: string;
};

type BlogForm = {
  title: string;
  slug: string;
  date: string;
  author: string;
  featuredImage: string;
  contentText: string;
};

type RecordItem = Record<string, unknown> & { id: string };
type SiteConfig = { resumeUrl: string };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
const AUTH_STORAGE_KEY = "portfolio_admin_basic_auth";

const collectionLabels: Record<CollectionKey, string> = {
  projects: "Projects",
  experiences: "Experience",
  certifications: "Certifications",
  blogs: "Blogs",
};

const emptyProjectForm: ProjectForm = {
  projectTitle: "",
  slug: "",
  descriptionText: "",
  technologiesText: "",
  coverImage: "",
  liveDemoLink: "",
  sourceCodeLink: "",
};

const emptyExperienceForm: ExperienceForm = {
  companyName: "",
  jobTitle: "",
  startDate: "",
  endDate: "",
  location: "",
  descriptionText: "",
};

const emptyCertificationForm: CertificationForm = {
  name: "",
  issuingOrganization: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  skillsText: "",
  certificateImage: "",
};

const emptyBlogForm: BlogForm = {
  title: "",
  slug: "",
  date: "",
  author: "",
  featuredImage: "",
  contentText: "",
};

function toBasicAuth(username: string, password: string): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function textToRichDocument(text: string) {
  const paragraphs = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    nodeType: "document",
    data: {},
    content: paragraphs.map((line) => ({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: line, marks: [], data: {} }],
    })),
  };
}

function richDocumentToText(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  const content = (doc as { content?: unknown[] }).content;
  if (!Array.isArray(content)) return "";

  const lines: string[] = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const textNodes = (block as { content?: unknown[] }).content;
    if (!Array.isArray(textNodes)) continue;
    const line = textNodes
      .map((node) => {
        if (!node || typeof node !== "object") return "";
        const value = (node as { value?: unknown }).value;
        return typeof value === "string" ? value : "";
      })
      .join("")
      .trim();
    if (line) lines.push(line);
  }

  return lines.join("\n\n");
}

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");

  const [collection, setCollection] = useState<CollectionKey>("projects");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    resumeUrl: "/Rohan_Resume.pdf",
  });

  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [experienceForm, setExperienceForm] =
    useState<ExperienceForm>(emptyExperienceForm);
  const [certificationForm, setCertificationForm] = useState<CertificationForm>(
    emptyCertificationForm,
  );
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlogForm);

  const endpoint = useMemo(() => `${API_BASE_URL}/${collection}`, [collection]);
  const adminEndpoint = useMemo(
    () => `${API_BASE_URL}/admin/${collection}`,
    [collection],
  );

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) setAuthHeader(stored);
  }, []);

  useEffect(() => {
    setEditingId(null);
    setStatusText("");
    if (authHeader) {
      void loadItems();
      void loadSiteConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeader, collection]);

  async function login() {
    setAuthError("");
    const header = toBasicAuth(username, password);
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      setAuthError("Invalid ID or password.");
      return;
    }

    sessionStorage.setItem(AUTH_STORAGE_KEY, header);
    setAuthHeader(header);
    setUsername("");
    setPassword("");
  }

  function logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthHeader(null);
    setRecords([]);
    setEditingId(null);
    setStatusText("");
  }

  async function loadSiteConfig() {
    try {
      const response = await fetch(`${API_BASE_URL}/site-config`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = (await response.json()) as Partial<SiteConfig>;
      setSiteConfig({ resumeUrl: data.resumeUrl || "/Rohan_Resume.pdf" });
    } catch {
      setSiteConfig({ resumeUrl: "/Rohan_Resume.pdf" });
    }
  }

  async function uploadImage(file: File): Promise<string> {
    if (!authHeader) throw new Error("Not authenticated");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/admin/upload/image`, {
      method: "POST",
      headers: { Authorization: authHeader },
      body: formData,
    });
    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Image upload failed");
    }
    const data = (await response.json()) as { url: string };
    return data.url;
  }

  async function uploadResume(file: File) {
    if (!authHeader) return;
    setResumeUploading(true);
    setStatusText("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_BASE_URL}/admin/upload/resume`, {
        method: "POST",
        headers: { Authorization: authHeader },
        body: formData,
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Resume upload failed");
      }
      await loadSiteConfig();
      setStatusText("Resume uploaded and old file replaced.");
    } catch (error) {
      setStatusText(
        error instanceof Error ? error.message : "Resume upload failed.",
      );
    } finally {
      setResumeUploading(false);
    }
  }

  async function deleteResume() {
    if (!authHeader) return;
    setStatusText("");
    const response = await fetch(`${API_BASE_URL}/admin/upload/resume`, {
      method: "DELETE",
      headers: { Authorization: authHeader },
    });
    if (!response.ok) {
      setStatusText("Resume delete failed.");
      return;
    }
    await loadSiteConfig();
    setStatusText("Custom resume removed.");
  }

  async function loadItems() {
    setLoading(true);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to fetch records.");
      const data = (await response.json()) as RecordItem[];
      setRecords(Array.isArray(data) ? data : []);
      setStatusText(
        `Loaded ${Array.isArray(data) ? data.length : 0} ${collectionLabels[collection]}.`,
      );
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  function resetCurrentForm() {
    setEditingId(null);
    if (collection === "projects") setProjectForm(emptyProjectForm);
    if (collection === "experiences") setExperienceForm(emptyExperienceForm);
    if (collection === "certifications")
      setCertificationForm(emptyCertificationForm);
    if (collection === "blogs") setBlogForm(emptyBlogForm);
  }

  function buildPayload() {
    if (collection === "projects") {
      return {
        projectTitle: projectForm.projectTitle,
        slug: projectForm.slug || slugify(projectForm.projectTitle),
        description: textToRichDocument(projectForm.descriptionText),
        technologies: projectForm.technologiesText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        coverImage: projectForm.coverImage || null,
        liveDemoLink: projectForm.liveDemoLink || null,
        sourceCodeLink: projectForm.sourceCodeLink || null,
      };
    }

    if (collection === "experiences") {
      return {
        companyName: experienceForm.companyName,
        jobTitle: experienceForm.jobTitle,
        startDate: experienceForm.startDate,
        endDate: experienceForm.endDate || null,
        description: textToRichDocument(experienceForm.descriptionText),
        location: experienceForm.location || null,
      };
    }

    if (collection === "certifications") {
      return {
        name: certificationForm.name,
        issuingOrganization: certificationForm.issuingOrganization,
        issueDate: certificationForm.issueDate,
        credentialId: certificationForm.credentialId || "",
        credentialUrl: certificationForm.credentialUrl || "",
        skills: certificationForm.skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        certificateImage: certificationForm.certificateImage || "",
      };
    }

    return {
      title: blogForm.title,
      slug: blogForm.slug || slugify(blogForm.title),
      date: blogForm.date,
      featuredImage: blogForm.featuredImage || null,
      author: blogForm.author || null,
      content: textToRichDocument(blogForm.contentText),
    };
  }

  function setCurrentImageUrl(url: string) {
    if (collection === "projects") {
      setProjectForm((prev) => ({ ...prev, coverImage: url }));
      return;
    }
    if (collection === "certifications") {
      setCertificationForm((prev) => ({ ...prev, certificateImage: url }));
      return;
    }
    if (collection === "blogs") {
      setBlogForm((prev) => ({ ...prev, featuredImage: url }));
    }
  }

  async function submitForm() {
    if (!authHeader) return;
    setSaving(true);
    setStatusText("");
    try {
      const payload = buildPayload();
      const isEdit = Boolean(editingId);
      const response = await fetch(
        isEdit ? `${adminEndpoint}/${editingId}` : adminEndpoint,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Save failed");
      }

      setStatusText(isEdit ? "Updated successfully." : "Created successfully.");
      resetCurrentForm();
      await loadItems();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    if (!authHeader) return;
    setStatusText("");
    const response = await fetch(`${adminEndpoint}/${id}`, {
      method: "DELETE",
      headers: { Authorization: authHeader },
    });
    if (!response.ok) {
      setStatusText("Delete failed.");
      return;
    }
    if (editingId === id) resetCurrentForm();
    setStatusText("Deleted successfully.");
    await loadItems();
  }

  function editItem(item: RecordItem) {
    setEditingId(item.id);
    if (collection === "projects") {
      setProjectForm({
        projectTitle: String(item.projectTitle || ""),
        slug: String(item.slug || ""),
        descriptionText: richDocumentToText(item.description),
        technologiesText: Array.isArray(item.technologies)
          ? item.technologies.join(", ")
          : "",
        coverImage: String(item.coverImage || ""),
        liveDemoLink: String(item.liveDemoLink || ""),
        sourceCodeLink: String(item.sourceCodeLink || ""),
      });
      return;
    }

    if (collection === "experiences") {
      setExperienceForm({
        companyName: String(item.companyName || ""),
        jobTitle: String(item.jobTitle || ""),
        startDate: String(item.startDate || ""),
        endDate: String(item.endDate || ""),
        location: String(item.location || ""),
        descriptionText: richDocumentToText(item.description),
      });
      return;
    }

    if (collection === "certifications") {
      setCertificationForm({
        name: String(item.name || ""),
        issuingOrganization: String(item.issuingOrganization || ""),
        issueDate: String(item.issueDate || ""),
        credentialId: String(item.credentialId || ""),
        credentialUrl: String(item.credentialUrl || ""),
        skillsText: Array.isArray(item.skills) ? item.skills.join(", ") : "",
        certificateImage: String(item.certificateImage || ""),
      });
      return;
    }

    setBlogForm({
      title: String(item.title || ""),
      slug: String(item.slug || ""),
      date: String(item.date || ""),
      author: String(item.author || ""),
      featuredImage: String(item.featuredImage || ""),
      contentText: richDocumentToText(item.content),
    });
  }

  if (!authHeader) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0f3d22_0%,_#071126_45%,_#04070f_100%)] px-4 py-12 text-white">
        <div className="mx-auto mt-16 max-w-md rounded-3xl border border-white/15 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-black text-lime-300">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-300">
            Use your backend `.env` admin ID and password.
          </p>
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 outline-none focus:border-lime-400"
              placeholder="Admin ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 outline-none focus:border-lime-400"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 py-3 font-bold text-black"
              onClick={login}
            >
              Sign In
            </button>
            {authError ? (
              <p className="text-sm text-red-300">{authError}</p>
            ) : null}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0f3d22_0%,_#071126_45%,_#04070f_100%)] px-4 py-6 text-white sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-black/35 p-5 shadow-xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-lime-300 sm:text-4xl">
                Content Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-300 sm:text-base">
                Add and update portfolio data. Changes are saved to MongoDB and
                reflected on frontend.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold"
                onClick={loadItems}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button
                className="rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl sm:p-5">
          <h2 className="text-xl font-bold text-emerald-200">Resume Manager</h2>
          <p className="mt-1 text-sm text-gray-300 break-all">
            Current Resume URL: {siteConfig.resumeUrl}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadResume(file);
                e.currentTarget.value = "";
              }}
              className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-lime-500 file:px-3 file:py-2 file:font-semibold file:text-black"
            />
            <button
              className="rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
              onClick={deleteResume}
            >
              Delete Custom Resume
            </button>
            {resumeUploading ? (
              <span className="text-sm text-gray-300">Uploading resume...</span>
            ) : null}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(
            [
              "projects",
              "experiences",
              "certifications",
              "blogs",
            ] as CollectionKey[]
          ).map((key) => (
            <button
              key={key}
              onClick={() => setCollection(key)}
              className={`rounded-2xl border px-4 py-4 text-left ${
                collection === key
                  ? "border-lime-300/70 bg-lime-400/20"
                  : "border-white/10 bg-black/25"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-gray-300">
                Collection
              </p>
              <p className="text-lg font-bold">{collectionLabels[key]}</p>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl sm:p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-200">
                {editingId
                  ? `Edit ${collectionLabels[collection]}`
                  : `Create ${collectionLabels[collection]}`}
              </h2>
              {editingId ? (
                <button
                  className="rounded-lg border border-white/15 px-3 py-1 text-xs"
                  onClick={resetCurrentForm}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>

            {collection === "projects" ? (
              <ProjectFields
                form={projectForm}
                setForm={setProjectForm}
                uploading={uploading}
                onUpload={async (file) => {
                  setUploading(true);
                  try {
                    const url = await uploadImage(file);
                    setCurrentImageUrl(url);
                    setStatusText("Image uploaded.");
                  } catch (error) {
                    setStatusText(
                      error instanceof Error
                        ? error.message
                        : "Image upload failed.",
                    );
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            ) : null}
            {collection === "experiences" ? (
              <ExperienceFields
                form={experienceForm}
                setForm={setExperienceForm}
              />
            ) : null}
            {collection === "certifications" ? (
              <CertificationFields
                form={certificationForm}
                setForm={setCertificationForm}
                uploading={uploading}
                onUpload={async (file) => {
                  setUploading(true);
                  try {
                    const url = await uploadImage(file);
                    setCurrentImageUrl(url);
                    setStatusText("Image uploaded.");
                  } catch (error) {
                    setStatusText(
                      error instanceof Error
                        ? error.message
                        : "Image upload failed.",
                    );
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            ) : null}
            {collection === "blogs" ? (
              <BlogFields
                form={blogForm}
                setForm={setBlogForm}
                uploading={uploading}
                onUpload={async (file) => {
                  setUploading(true);
                  try {
                    const url = await uploadImage(file);
                    setCurrentImageUrl(url);
                    setStatusText("Image uploaded.");
                  } catch (error) {
                    setStatusText(
                      error instanceof Error
                        ? error.message
                        : "Image upload failed.",
                    );
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            ) : null}

            <div className="mt-4 flex gap-3">
              <button
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2 font-bold text-black"
                onClick={submitForm}
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                className="rounded-xl border border-white/15 px-4 py-2"
                onClick={resetCurrentForm}
              >
                Clear
              </button>
            </div>
            {statusText ? (
              <p className="mt-3 text-sm text-gray-300">{statusText}</p>
            ) : null}
          </div>

          <div className="space-y-3 lg:col-span-3">
            {records.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold">
                      {recordTitle(collection, item)}
                    </p>
                    <p className="text-xs text-gray-400 break-all">
                      ID: {item.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg bg-lime-500 px-3 py-1.5 text-sm font-semibold text-black"
                      onClick={() => editItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {records.length === 0 && !loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300">
                No records in {collectionLabels[collection]}.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "url";
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-300">{label}</span>
      <input
        className="w-full rounded-xl border border-white/10 bg-gray-900/80 px-3 py-2 outline-none focus:border-lime-400"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-300">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-xl border border-white/10 bg-gray-900/80 px-3 py-2 outline-none focus:border-lime-400"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function FileUploader({
  label,
  accept,
  onUpload,
  uploading,
}: {
  label: string;
  accept: string;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-300">{label}</span>
      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onUpload(file);
          e.currentTarget.value = "";
        }}
        className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-lime-500 file:px-3 file:py-2 file:font-semibold file:text-black"
      />
      {uploading ? (
        <span className="text-xs text-gray-400">Uploading...</span>
      ) : null}
    </label>
  );
}

function ProjectFields({
  form,
  setForm,
  onUpload,
  uploading,
}: {
  form: ProjectForm;
  setForm: (form: ProjectForm) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  return (
    <div className="space-y-3">
      <Field
        label="Project Title"
        value={form.projectTitle}
        onChange={(v) => setForm({ ...form, projectTitle: v })}
      />
      <Field
        label="Slug (optional)"
        value={form.slug}
        onChange={(v) => setForm({ ...form, slug: v })}
        placeholder="auto from title if empty"
      />
      <Field
        label="Cover Image URL"
        value={form.coverImage}
        onChange={(v) => setForm({ ...form, coverImage: v })}
        type="url"
      />
      <FileUploader
        label="Upload Cover Image"
        accept="image/*"
        onUpload={onUpload}
        uploading={uploading}
      />
      <Field
        label="Live Demo URL"
        value={form.liveDemoLink}
        onChange={(v) => setForm({ ...form, liveDemoLink: v })}
        type="url"
      />
      <Field
        label="Source Code URL"
        value={form.sourceCodeLink}
        onChange={(v) => setForm({ ...form, sourceCodeLink: v })}
        type="url"
      />
      <Field
        label="Technologies (comma separated)"
        value={form.technologiesText}
        onChange={(v) => setForm({ ...form, technologiesText: v })}
      />
      <Area
        label="Description"
        value={form.descriptionText}
        onChange={(v) => setForm({ ...form, descriptionText: v })}
      />
    </div>
  );
}

function ExperienceFields({
  form,
  setForm,
}: {
  form: ExperienceForm;
  setForm: (form: ExperienceForm) => void;
}) {
  return (
    <div className="space-y-3">
      <Field
        label="Company Name"
        value={form.companyName}
        onChange={(v) => setForm({ ...form, companyName: v })}
      />
      <Field
        label="Job Title"
        value={form.jobTitle}
        onChange={(v) => setForm({ ...form, jobTitle: v })}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Start Date"
          value={form.startDate}
          onChange={(v) => setForm({ ...form, startDate: v })}
          type="date"
        />
        <Field
          label="End Date (optional)"
          value={form.endDate}
          onChange={(v) => setForm({ ...form, endDate: v })}
          type="date"
        />
      </div>
      <Field
        label="Location"
        value={form.location}
        onChange={(v) => setForm({ ...form, location: v })}
      />
      <Area
        label="Description"
        value={form.descriptionText}
        onChange={(v) => setForm({ ...form, descriptionText: v })}
      />
    </div>
  );
}

function CertificationFields({
  form,
  setForm,
  onUpload,
  uploading,
}: {
  form: CertificationForm;
  setForm: (form: CertificationForm) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  return (
    <div className="space-y-3">
      <Field
        label="Certification Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
      />
      <Field
        label="Issuing Organization"
        value={form.issuingOrganization}
        onChange={(v) => setForm({ ...form, issuingOrganization: v })}
      />
      <Field
        label="Issue Date"
        value={form.issueDate}
        onChange={(v) => setForm({ ...form, issueDate: v })}
        type="date"
      />
      <Field
        label="Credential ID"
        value={form.credentialId}
        onChange={(v) => setForm({ ...form, credentialId: v })}
      />
      <Field
        label="Credential URL"
        value={form.credentialUrl}
        onChange={(v) => setForm({ ...form, credentialUrl: v })}
        type="url"
      />
      <Field
        label="Skills (comma separated)"
        value={form.skillsText}
        onChange={(v) => setForm({ ...form, skillsText: v })}
      />
      <Field
        label="Certificate Image URL"
        value={form.certificateImage}
        onChange={(v) => setForm({ ...form, certificateImage: v })}
        type="url"
      />
      <FileUploader
        label="Upload Certificate Image"
        accept="image/*"
        onUpload={onUpload}
        uploading={uploading}
      />
    </div>
  );
}

function BlogFields({
  form,
  setForm,
  onUpload,
  uploading,
}: {
  form: BlogForm;
  setForm: (form: BlogForm) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  return (
    <div className="space-y-3">
      <Field
        label="Blog Title"
        value={form.title}
        onChange={(v) => setForm({ ...form, title: v })}
      />
      <Field
        label="Slug (optional)"
        value={form.slug}
        onChange={(v) => setForm({ ...form, slug: v })}
        placeholder="auto from title if empty"
      />
      <Field
        label="Date"
        value={form.date}
        onChange={(v) => setForm({ ...form, date: v })}
        type="date"
      />
      <Field
        label="Author"
        value={form.author}
        onChange={(v) => setForm({ ...form, author: v })}
      />
      <Field
        label="Featured Image URL"
        value={form.featuredImage}
        onChange={(v) => setForm({ ...form, featuredImage: v })}
        type="url"
      />
      <FileUploader
        label="Upload Featured Image"
        accept="image/*"
        onUpload={onUpload}
        uploading={uploading}
      />
      <Area
        label="Blog Content"
        value={form.contentText}
        onChange={(v) => setForm({ ...form, contentText: v })}
      />
    </div>
  );
}

function recordTitle(collection: CollectionKey, item: RecordItem): string {
  if (collection === "projects")
    return String(item.projectTitle || "Untitled project");
  if (collection === "experiences")
    return `${String(item.jobTitle || "Role")} @ ${String(item.companyName || "Company")}`;
  if (collection === "certifications")
    return String(item.name || "Untitled certification");
  return String(item.title || "Untitled blog");
}
