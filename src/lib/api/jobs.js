import { serverFetch } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const hiddenStatuses = new Set(["pending", "closed"]);

// Jobs without an explicit status remain public; only moderation states hide them.
const isPublicJob = (job) =>
    !hiddenStatuses.has(String(job?.status || "").toLowerCase());

const publicJobs = (jobs) =>
    Array.isArray(jobs) ? jobs.filter(isPublicJob) : [];

const normalizeCompanyName = (value) =>
    String(value || "")
        .trim()
        .toLowerCase();

const loadCompanies = async () => {
    try {
        const companies = await serverFetch("/api/companies", {
            next: { revalidate: 300, tags: ["companies"] },
        });

        return Array.isArray(companies) ? companies : [];
    } catch (error) {
        // Jobs should still render if company data is temporarily unavailable.
        console.error("Failed to load companies for job logos:", error);
        return [];
    }
};

const attachCompanyLogos = async (jobs) => {
    const list = Array.isArray(jobs) ? jobs : [];

    if (list.length === 0) return list;

    const companies = await loadCompanies();

    if (companies.length === 0) return list;

    const byRecruiter = new Map();
    const byId = new Map();
    const byName = new Map();

    companies.forEach((company) => {
        if (company?.recruiterId) {
            byRecruiter.set(String(company.recruiterId), company);
        }

        if (company?._id) {
            byId.set(String(company._id), company);
        }

        if (company?.companyName) {
            byName.set(normalizeCompanyName(company.companyName), company);
        }
    });

    return list.map((job) => {
        if (!job) return job;

        const company =
            byRecruiter.get(String(job.recruiterId || "")) ||
            (job.companyId ? byId.get(String(job.companyId)) : null) ||
            (job.companyName
                ? byName.get(normalizeCompanyName(job.companyName))
                : null);

        return {
            ...job,
            companyLogo: job.companyLogo || company?.logoUrl || "",
        };
    });
};

export const getJobs = async () => {
    const jobs = await serverFetch("/api/jobs");

    return publicJobs(await attachCompanyLogos(jobs));
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
    const job = await serverFetch(`/api/jobs/${jobId}`);

    if (!job) return job;

    const [enrichedJob] = await attachCompanyLogos([job]);

    return enrichedJob;
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
