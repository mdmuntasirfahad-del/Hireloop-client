export const toDate = (value) => {
    if (!value) return null;

    const normalized =
        typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? `${value}T00:00:00`
            : value;
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
};

export const toISOString = (value) => {
    const date = toDate(value);

    return date ? date.toISOString() : null;
};

export const formatDate = (value) => {
    const date = toDate(value);

    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

export const formatDateTime = (value) => {
    const date = toDate(value);

    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
};

export const formatSalary = (value) => {
    if (value === null || value === undefined || value === "") return "—";

    const raw = String(value).trim();
    const numeric = Number(raw.replace(/,/g, ""));

    if (Number.isFinite(numeric) && numeric > 0 && /^\d[\d,]*$/.test(raw)) {
        return `$${numeric.toLocaleString()}`;
    }

    return raw;
};

export const formatNumber = (value) =>
    new Intl.NumberFormat("en-US").format(Number(value) || 0);

export const titleCase = (value) => {
    const text = String(value || "").trim();

    if (!text) return "—";

    return text
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
};

export const normalizeRole = (role) => {
    const value = String(role || "").toLowerCase();

    if (value === "admin" || value === "recruiter" || value === "seeker") {
        return value;
    }

    return "unassigned";
};

export const normalizeJobStatus = (job = {}) => {
    const status = String(job.status || "").toLowerCase();

    if (status === "active" || status === "pending" || status === "closed") {
        return status;
    }

    return job.isApproved === false ? "pending" : "active";
};

const applicationStatuses = new Set([
    "pending",
    "reviewing",
    "interviewing",
    "rejected",
    "hired",
]);

export const normalizeApplicationStatus = (status) => {
    const value = String(status || "").toLowerCase();

    return applicationStatuses.has(value) ? value : "pending";
};
