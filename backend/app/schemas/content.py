from pydantic import BaseModel, Field


class ProjectIn(BaseModel):
    projectTitle: str
    description: dict | None = None
    technologies: list[str] = Field(default_factory=list)
    coverImage: str | None = None
    liveDemoLink: str | None = None
    sourceCodeLink: str | None = None
    slug: str


class ExperienceIn(BaseModel):
    companyName: str
    jobTitle: str
    startDate: str
    endDate: str | None = None
    description: dict | None = None
    location: str | None = None


class CertificationIn(BaseModel):
    name: str
    issuingOrganization: str
    issueDate: str
    credentialId: str | None = None
    credentialUrl: str | None = None
    skills: list[str] = Field(default_factory=list)
    certificateImage: str | None = None


class BlogIn(BaseModel):
    title: str
    slug: str
    date: str
    featuredImage: str | None = None
    content: dict | None = None
    author: str | None = None


class BootstrapPayload(BaseModel):
    projects: list[ProjectIn] = Field(default_factory=list)
    experiences: list[ExperienceIn] = Field(default_factory=list)
    certifications: list[CertificationIn] = Field(default_factory=list)
    blogs: list[BlogIn] = Field(default_factory=list)


class AssistantRequest(BaseModel):
    prompt: str


class AdminLoginRequest(BaseModel):
    username: str
    password: str
