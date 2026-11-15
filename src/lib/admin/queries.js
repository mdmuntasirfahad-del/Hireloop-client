import { db } from "@/lib/core/mongo";
import {
    normalizeApplicationStatus,
    normalizeJobStatus,
    normalizeRole,
    titleCase,
    toDate,
    toISOString,
} from "./format";
import { toObjectId } from "./ids";
import { ADMIN_PAGE_SIZE } from "./searchParams";

const DAY_MS = 24 * 60 * 60 * 1000;

const userProjection = {
    name: 1,
    email: 1,
    phoneNumber: 1,
    role: 1,
    plan: 1,
    createdAt: 1,
    emailVerified: 1,
};

const jobProjection = {
    title: 1,
    companyId: 1,
    companyName: 1,
    recruiterId: 1,
    category: 1,
    type: 1,
    location: 1,
    salary: 1,
    status: 1,
    isApproved: 1,
    deadline: 1,
    createdAt: 1,
};

const companyProjection = {
    companyName: 1,
    recruiterId: 1,
    industry: 1,
    location: 1,
    website: 1,
    logoUrl: 1,
    plan: 1,
    isApproved: 1,
    createdAt: 1,
};

const applicationProjection = {
    applicantId: 1,
    applicantName: 1,
    applicantEmail: 1,
    email: 1,
    jobId: 1,
    jobTitle: 1,
    companyName: 1,
    status: 1,
    resumeUrl: 1,
    portfolioUrl: 1,
    coverNote: 1,
    appliedAt: 1,
    createdAt: 1,
};

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchClause = (query, fields) => {
    if (!query) return null;

    const regex = new RegExp(escapeRegex(query), "i");

    return {
        $or: fields.map((field) => ({ [field]: regex })),
    };
};

const dateTime = (value) => toDate(value)?.getTime() || 0;

const sortByDateDesc = (items, getter = (item) => item.createdAt) =>
    [...items].sort((a, b) => dateTime(getter(b)) - dateTime(getter(a)));

const normalizeUser = (user) => ({
    id: String(user._id),
    name: user.name || user.email || "Unnamed user",
    email: user.email || "—",
    phoneNumber: user.phoneNumber || "",
    role: normalizeRole(user.role),
    plan: user.plan || "",
    createdAt: toISOString(user.createdAt),
    emailVerified: Boolean(user.emailVerified),
});

const normalizeApplication = (application) => ({
    id: String(application._id),
    applicantId: application.applicantId ? String(application.applicantId) : "",
    applicantName: application.applicantName || "Applicant",
    applicantEmail:
        application.applicantEmail || application.email || "—",
    jobId: application.jobId ? String(application.jobId) : "",
    jobTitle: application.jobTitle || "—",
    companyName: application.companyName || "—",
    status: normalizeApplicationStatus(application.status),
    resumeUrl: application.resumeUrl || "",
    portfolioUrl: application.portfolioUrl || "",
    coverNote: application.coverNote || "",
    appliedAt: toISOString(
        application.appliedAt || application.createdAt
    ),
});

const loadRecruiters = async (recruiterIds) => {
    const objectIds = [
        ...new Set(
            recruiterIds
                .map((id) => toObjectId(id))
                .filter(Boolean)
                .map((id) => String(id))
        ),
    ].map((id) => toObjectId(id));

    if (objectIds.length === 0) return [];

    return db
        .collection("user")
        .find(
            { _id: { $in: objectIds } },
            { projection: { name: 1, email: 1 } }
        )
        .toArray();
};

const loadCompanies = async () =>
    db
        .collection("companies")
        .find(
            {},
            {
                projection: {
                    companyName: 1,
                    recruiterId: 1,
                    logoUrl: 1,
                },
            }
        )
        .toArray();

const enrichJobs = async (jobs) => {
    if (!jobs.length) return [];

    const [recruiters, companies] = await Promise.all([
        loadRecruiters(jobs.map((job) => job.recruiterId)),
        loadCompanies(),
    ]);

    const recruiterMap = new Map(
        recruiters.map((recruiter) => [String(recruiter._id), recruiter])
    );
    const companyByRecruiter = new Map();
    const companyById = new Map();

    companies.forEach((company) => {
        if (company.recruiterId) {
            companyByRecruiter.set(String(company.recruiterId), company);
        }

        companyById.set(String(company._id), company);
    });

    return jobs.map((job) => {
        const recruiter = recruiterMap.get(String(job.recruiterId));
        const company =
            companyByRecruiter.get(String(job.recruiterId)) ||
            (job.companyId ? companyById.get(String(job.companyId)) : null);
        const id = String(job._id);

        return {
            id,
            title: job.title || "Untitled job",
            companyName: job.companyName || company?.companyName || "—",
            companyLogoUrl: company?.logoUrl || "",
            recruiterName:
                recruiter?.name ||
                recruiter?.email ||
                (job.recruiterId ? "Recruiter" : "—"),
            recruiterEmail: recruiter?.email || "",
            category: job.category || "—",
            type: job.type || "—",
            location: job.location || "—",
            salary: job.salary || "",
            status: normalizeJobStatus(job),
            deadline: job.deadline || "",
            createdAt: toISOString(job.createdAt),
            publicHref: `/jobs/${id}`,
        };
    });
};

const enrichCompanies = async (companies) => {
    if (!companies.length) return [];

    const [recruiters, jobs] = await Promise.all([
        loadRecruiters(companies.map((company) => company.recruiterId)),
        db
            .collection("jobs")
            .find(
                {},
                {
                    projection: {
                        recruiterId: 1,
                        companyId: 1,
                        companyName: 1,
                    },
                }
            )
            .toArray(),
    ]);

    const recruiterMap = new Map(
        recruiters.map((recruiter) => [String(recruiter._id), recruiter])
    );

    return companies.map((company) => {
        const id = String(company._id);
        const recruiterId = company.recruiterId
            ? String(company.recruiterId)
            : "";
        const recruiter = recruiterMap.get(recruiterId);

        const jobsCount = jobs.filter((job) => {
            if (recruiterId && String(job.recruiterId || "") === recruiterId) {
                return true;
            }

            if (String(job.companyId || "") === id) {
                return true;
            }

            return Boolean(
                company.companyName &&
                    job.companyName === company.companyName
            );
        }).length;

        return {
            id,
            companyName: company.companyName || "Unnamed company",
            recruiterId,
            recruiterName:
                recruiter?.name ||
                recruiter?.email ||
                (recruiterId ? "Recruiter" : "—"),
            recruiterEmail: recruiter?.email || "",
            industry: company.industry || "—",
            location: company.location || "—",
            website: company.website || "",
            logoUrl: company.logoUrl || "",
            plan: company.plan || "",
            isApproved: company.isApproved === true,
            status: company.isApproved === true ? "approved" : "pending",
            jobsCount,
            createdAt: toISOString(company.createdAt),
        };
    });
};

const normalizeJobStatusExpression = {
    $let: {
        vars: {
            rawStatus: { $toLower: { $ifNull: ["$status", ""] } },
        },
        in: {
            $switch: {
                branches: [
                    {
                        case: {
                            $in: [
                                "$$rawStatus",
                                ["active", "pending", "closed"],
                            ],
                        },
                        then: "$$rawStatus",
                    },
                    {
                        case: { $eq: ["$isApproved", false] },
                        then: "pending",
                    },
                ],
                default: "active",
            },
        },
    },
};

const paginate = async ({ collection, filter, page, projection, sort }) => {
    const total = await collection.countDocuments(filter);
    const totalPages = Math.max(
        1,
        Math.ceil(total / ADMIN_PAGE_SIZE)
    );
    const safePage = Math.min(Math.max(1, page), totalPages);
    const items = await collection
        .find(filter, { projection })
        .sort(sort || { createdAt: -1, _id: -1 })
        .skip((safePage - 1) * ADMIN_PAGE_SIZE)
        .limit(ADMIN_PAGE_SIZE)
        .toArray();

    return {
        items,
        total,
        page: safePage,
        totalPages,
        pageSize: ADMIN_PAGE_SIZE,
    };
};

export const getAdminUsers = async ({ page, q, role }) => {
    const clauses = [];
    const query = searchClause(q, ["name", "email"]);

    if (query) clauses.push(query);

    if (role === "unassigned") {
        clauses.push({
            $or: [
                { role: { $exists: false } },
                { role: null },
                { role: "" },
            ],
        });
    } else if (role === "seeker" || role === "recruiter" || role === "admin") {
        clauses.push({ role });
    }

    const result = await paginate({
        collection: db.collection("user"),
        filter: clauses.length ? { $and: clauses } : {},
        page,
        projection: userProjection,
        sort: { createdAt: -1, _id: -1 },
    });

    return {
        ...result,
        items: result.items.map(normalizeUser),
    };
};

export const getAdminJobs = async ({ page, q, status }) => {
    const clauses = [];
    const query = searchClause(q, [
        "title",
        "companyName",
        "location",
        "category",
        "type",
    ]);

    if (query) clauses.push(query);
    if (status === "active" || status === "pending" || status === "closed") {
        clauses.push({
            $expr: {
                $eq: [normalizeJobStatusExpression, status],
            },
        });
    }

    const result = await paginate({
        collection: db.collection("jobs"),
        filter: clauses.length ? { $and: clauses } : {},
        page,
        projection: jobProjection,
        sort: { createdAt: -1, _id: -1 },
    });

    return {
        ...result,
        items: await enrichJobs(result.items),
    };
};

export const getAdminCompanies = async ({ page, q, approval }) => {
    const clauses = [];
    const query = searchClause(q, [
        "companyName",
        "industry",
        "location",
    ]);

    if (query) clauses.push(query);
    if (approval === "approved") {
        clauses.push({ isApproved: true });
    } else if (approval === "pending") {
        clauses.push({ isApproved: { $ne: true } });
    }

    const result = await paginate({
        collection: db.collection("companies"),
        filter: clauses.length ? { $and: clauses } : {},
        page,
        projection: companyProjection,
        sort: { isApproved: 1, createdAt: -1, _id: -1 },
    });

    return {
        ...result,
        items: await enrichCompanies(result.items),
    };
};

export const getAdminApplications = async ({ page, q, status }) => {
    const clauses = [];
    const query = searchClause(q, [
        "applicantName",
        "applicantEmail",
        "email",
        "jobTitle",
        "companyName",
    ]);

    if (query) clauses.push(query);

    if (status === "pending") {
        clauses.push({
            $or: [
                { status: { $exists: false } },
                { status: null },
                { status: "" },
                { status: "pending" },
            ],
        });
    } else if (
        ["reviewing", "interviewing", "rejected", "hired"].includes(status)
    ) {
        clauses.push({ status });
    }

    const result = await paginate({
        collection: db.collection("applications"),
        filter: clauses.length ? { $and: clauses } : {},
        page,
        projection: applicationProjection,
        sort: { createdAt: -1, _id: -1 },
    });

    return {
        ...result,
        items: result.items.map(normalizeApplication),
    };
};

export const getAdminOverview = async () => {
    const [users, jobs, companies, applications] = await Promise.all([
        db
            .collection("user")
            .find(
                {},
                {
                    projection: {
                        name: 1,
                        email: 1,
                        role: 1,
                        plan: 1,
                        createdAt: 1,
                    },
                }
            )
            .toArray(),
        db.collection("jobs").find({}, { projection: jobProjection }).toArray(),
        db
            .collection("companies")
            .find({}, { projection: companyProjection })
            .toArray(),
        db
            .collection("applications")
            .find({}, { projection: applicationProjection })
            .toArray(),
    ]);

    const roleCounts = {
        seeker: 0,
        recruiter: 0,
        admin: 0,
        unassigned: 0,
    };

    users.forEach((user) => {
        roleCounts[normalizeRole(user.role)] += 1;
    });

    const jobStatusCounts = {
        active: 0,
        pending: 0,
        closed: 0,
    };

    jobs.forEach((job) => {
        jobStatusCounts[normalizeJobStatus(job)] += 1;
    });

    const pendingCompanies = sortByDateDesc(
        companies.filter((company) => company.isApproved !== true)
    );

    const recentJobs = sortByDateDesc(jobs).slice(0, 5);
    const recentApplications = sortByDateDesc(applications).slice(0, 5);

    return {
        counts: {
            users: users.length,
            seekers: roleCounts.seeker,
            recruiters: roleCounts.recruiter,
            admins: roleCounts.admin,
            unassigned: roleCounts.unassigned,
            jobs: jobs.length,
            activeJobs: jobStatusCounts.active,
            pendingJobs: jobStatusCounts.pending,
            closedJobs: jobStatusCounts.closed,
            companies: companies.length,
            pendingCompanies: pendingCompanies.length,
            applications: applications.length,
        },
        recentUsers: sortByDateDesc(users).slice(0, 5).map(normalizeUser),
        pendingCompanies: await enrichCompanies(pendingCompanies.slice(0, 5)),
        recentJobs: await enrichJobs(recentJobs),
        recentApplications: recentApplications.map(normalizeApplication),
    };
};

const buildBuckets = (items, days, getDate = (item) => item.createdAt) => {
    const bucketCount = days <= 7 ? 7 : 6;
    const bucketSizeDays = Math.ceil(days / bucketCount);
    const now = new Date();
    const buckets = [];

    for (let index = bucketCount - 1; index >= 0; index -= 1) {
        const end = new Date(
            now.getTime() - index * bucketSizeDays * DAY_MS
        );
        const start = new Date(
            end.getTime() - bucketSizeDays * DAY_MS
        );
        const label =
            bucketSizeDays === 1
                ? new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                  }).format(start)
                : `${new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                  }).format(start)} – ${new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                  }).format(end)}`;

        buckets.push({ start, end, label, value: 0 });
    }

    items.forEach((item) => {
        const date = toDate(getDate(item));

        if (!date || date < buckets[0].start || date > now) return;

        const bucket = buckets.find(
            (candidate) =>
                date > candidate.start && date <= candidate.end
        );

        if (bucket) bucket.value += 1;
    });

    return buckets.map(({ label, value }) => ({ label, value }));
};

const countBy = (items, getKey) => {
    const counts = new Map();

    items.forEach((item) => {
        const key = getKey(item) || "Unspecified";
        counts.set(key, (counts.get(key) || 0) + 1);
    });

    return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
};

export const getAdminReports = async (days = 30) => {
    const rangeDays = [7, 30, 90].includes(days) ? days : 30;
    const since = new Date(Date.now() - rangeDays * DAY_MS);

    const [users, jobs, companies, applications] = await Promise.all([
        db
            .collection("user")
            .find({}, { projection: { name: 1, role: 1, createdAt: 1 } })
            .toArray(),
        db.collection("jobs").find({}, { projection: jobProjection }).toArray(),
        db
            .collection("companies")
            .find({}, { projection: companyProjection })
            .toArray(),
        db
            .collection("applications")
            .find({}, { projection: applicationProjection })
            .toArray(),
    ]);

    const inRange = (value) => {
        const date = toDate(value);
        return Boolean(date && date >= since);
    };

    const newUsers = users.filter((user) => inRange(user.createdAt));
    const newJobs = jobs.filter((job) => inRange(job.createdAt));
    const newCompanies = companies.filter((company) =>
        inRange(company.createdAt)
    );
    const newApplications = applications.filter((application) =>
        inRange(application.appliedAt || application.createdAt)
    );

    const pipelineOrder = [
        "pending",
        "reviewing",
        "interviewing",
        "hired",
        "rejected",
    ];
    const pipelineCounts = new Map(
        pipelineOrder.map((status) => [status, 0])
    );

    applications.forEach((application) => {
        const status = normalizeApplicationStatus(application.status);
        pipelineCounts.set(status, (pipelineCounts.get(status) || 0) + 1);
    });

    const topCategories = countBy(jobs, (job) => job.category);
    const topLocations = countBy(jobs, (job) => job.location);

    return {
        rangeDays,
        since: toISOString(since),
        newUsers: newUsers.length,
        newJobs: newJobs.length,
        newCompanies: newCompanies.length,
        newApplications: newApplications.length,
        totals: {
            users: users.length,
            jobs: jobs.length,
            companies: companies.length,
            applications: applications.length,
            activeJobs: jobs.filter(
                (job) => normalizeJobStatus(job) === "active"
            ).length,
            pendingCompanies: companies.filter(
                (company) => company.isApproved !== true
            ).length,
        },
        trends: {
            users: buildBuckets(newUsers, rangeDays),
            jobs: buildBuckets(newJobs, rangeDays),
            applications: buildBuckets(newApplications, rangeDays),
        },
        topCategories: topCategories.slice(0, 6),
        topLocations: topLocations.slice(0, 6),
        pipeline: pipelineOrder.map((status) => ({
            status,
            label: titleCase(status),
            value: pipelineCounts.get(status) || 0,
        })),
    };
};

export const getAdminExportRows = async (type, days = 0) => {
    const cutoff = days
        ? new Date(Date.now() - Number(days) * DAY_MS)
        : null;
    const inRange = (value) => {
        if (!cutoff) return true;

        const date = toDate(value);

        return Boolean(date && date >= cutoff);
    };

    if (type === "users") {
        const users = await db
            .collection("user")
            .find({}, { projection: userProjection })
            .toArray();

        return {
            headers: [
                "Name",
                "Email",
                "Phone",
                "Role",
                "Plan",
                "Joined",
            ],
            rows: users
                .filter((user) => inRange(user.createdAt))
                .sort((a, b) => dateTime(b.createdAt) - dateTime(a.createdAt))
                .map((user) => [
                    user.name || "",
                    user.email || "",
                    user.phoneNumber || "",
                    normalizeRole(user.role),
                    user.plan || "",
                    formatDateForExport(user.createdAt),
                ]),
        };
    }

    if (type === "jobs") {
        const jobs = await db
            .collection("jobs")
            .find({}, { projection: jobProjection })
            .toArray();
        const enriched = await enrichJobs(
            jobs.filter((job) => inRange(job.createdAt))
        );

        return {
            headers: [
                "Title",
                "Company",
                "Recruiter",
                "Category",
                "Type",
                "Location",
                "Salary",
                "Status",
                "Posted",
            ],
            rows: enriched.map((job) => [
                job.title,
                job.companyName,
                job.recruiterName,
                job.category,
                job.type,
                job.location,
                job.salary,
                job.status,
                formatDateForExport(job.createdAt),
            ]),
        };
    }

    if (type === "companies") {
        const companies = await db
            .collection("companies")
            .find({}, { projection: companyProjection })
            .toArray();
        const enriched = await enrichCompanies(
            companies.filter((company) => inRange(company.createdAt))
        );

        return {
            headers: [
                "Company",
                "Recruiter",
                "Industry",
                "Location",
                "Plan",
                "Approval",
                "Jobs",
                "Created",
            ],
            rows: enriched.map((company) => [
                company.companyName,
                company.recruiterName,
                company.industry,
                company.location,
                company.plan,
                company.status,
                company.jobsCount,
                formatDateForExport(company.createdAt),
            ]),
        };
    }

    if (type === "applications") {
        const applications = await db
            .collection("applications")
            .find({}, { projection: applicationProjection })
            .toArray();
        const normalized = applications
            .filter((application) =>
                inRange(application.appliedAt || application.createdAt)
            )
            .map(normalizeApplication);

        return {
            headers: [
                "Applicant",
                "Email",
                "Job",
                "Company",
                "Status",
                "Applied",
            ],
            rows: normalized.map((application) => [
                application.applicantName,
                application.applicantEmail,
                application.jobTitle,
                application.companyName,
                application.status,
                formatDateForExport(application.appliedAt),
            ]),
        };
    }

    return null;
};

const formatDateForExport = (value) => {
    const date = toDate(value);

    if (!date) return "";

    return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
};
