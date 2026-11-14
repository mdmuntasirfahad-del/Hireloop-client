import { serverFetch } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const hiddenStatuses = new Set(["pending", "closed"]);

// Jobs without an explicit status remain public; only moderation states hide them.
const isPublicJob = (job) =>
    !hiddenStatuses.has(String(job?.status || "").toLowerCase());

const publicJobs = (jobs) =>
    Array.isArray(jobs) ? jobs.filter(isPublicJob) : [];

export const getJobs = async () => {
    const jobs = await serverFetch("/api/jobs");

    return publicJobs(jobs);
};

// Home page cards: cached so the landing page stays static between refreshes.
export const getHomeJobs = async () => {
    const jobs = await serverFetch("/api/jobs", {
        cache: "force-cache",
        next: { revalidate: 300 },
    });

    return publicJobs(jobs);
};

export const getJobsById = async (jobId) => {
    return serverFetch(`/api/jobs/${jobId}`);
};

export const getCompanyJobs = async (recruiterId, status = "active") => {
    const res = await fetch(
        `${baseUrl}/api/jobs?recruiterId=${recruiterId}&status=${status}`
    );
    return res.json();
};

export const getRecruiterJobs = (recruiterId) => {
    return serverFetch(`/api/jobs?recruiterId=${recruiterId}`);
};
