"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAdminAction } from "@/lib/admin/guard";
import { idFilter, toIdString } from "@/lib/admin/ids";
import { db } from "@/lib/core/mongo";

const userRoles = new Set(["seeker", "recruiter"]);
const jobStatuses = new Set(["active", "pending", "closed"]);
const applicationStatuses = new Set([
    "pending",
    "reviewing",
    "interviewing",
    "rejected",
    "hired",
]);

const refreshAdmin = (...paths) => {
    const uniquePaths = new Set(["/dashboard/admin", ...paths]);

    uniquePaths.forEach((path) => revalidatePath(path));
};

const actionError = (message) => ({ ok: false, message });

export const updateUserRole = async (_previousState, formData) => {
    const admin = await requireAdminAction();
    const userId = toIdString(formData.get("userId"));
    const role = String(formData.get("role") || "").toLowerCase();

    if (!userId) return actionError("Choose a user to update.");
    if (!userRoles.has(role)) {
        return actionError("That role cannot be assigned from the admin panel.");
    }

    if (userId === admin.id) {
        return actionError("You cannot change your own admin role.");
    }

    const user = await db
        .collection("user")
        .findOne(idFilter(userId), {
            projection: { name: 1, email: 1, role: 1 },
        });

    if (!user) return actionError("That user no longer exists.");

    if (user.role === "admin") {
        return actionError("Administrator accounts cannot be changed here.");
    }

    await db.collection("user").updateOne(idFilter(userId), {
        $set: {
            role,
            updatedAt: new Date(),
        },
    });

    refreshAdmin("/dashboard/admin/users");

    return {
        ok: true,
        message: `${user.name || user.email || "User"} is now a ${role}.`,
    };
};

export const updateJobStatus = async (_previousState, formData) => {
    await requireAdminAction();

    const jobId = toIdString(formData.get("jobId"));
    const status = String(formData.get("status") || "").toLowerCase();

    if (!jobId) return actionError("Choose a job to update.");
    if (!jobStatuses.has(status)) {
        return actionError("That job status is not supported.");
    }

    const job = await db
        .collection("jobs")
        .findOne(idFilter(jobId), {
            projection: { title: 1 },
        });

    if (!job) return actionError("That job no longer exists.");

    await db.collection("jobs").updateOne(idFilter(jobId), {
        $set: {
            status,
            isApproved: status === "active",
            updatedAt: new Date(),
        },
    });

    refreshAdmin("/dashboard/admin/jobs");
    revalidatePath("/");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);

    return {
        ok: true,
        message: `${job.title || "Job"} is now ${status}.`,
    };
};

export const setCompanyApproval = async (_previousState, formData) => {
    const admin = await requireAdminAction();
    const companyId = toIdString(formData.get("companyId"));
    const approved = String(formData.get("approved") || "") === "true";

    if (!companyId) return actionError("Choose a company to update.");

    const company = await db
        .collection("companies")
        .findOne(idFilter(companyId), {
            projection: { companyName: 1 },
        });

    if (!company) return actionError("That company no longer exists.");

    await db.collection("companies").updateOne(idFilter(companyId), {
        $set: {
            isApproved: approved,
            approvedAt: approved ? new Date() : null,
            approvedBy: approved ? admin.id : null,
            updatedAt: new Date(),
        },
    });

    refreshAdmin("/dashboard/admin/companies");

    return {
        ok: true,
        message: `${company.companyName || "Company"} ${
            approved ? "approved" : "moved back to pending"
        }.`,
    };
};

export const updateApplicationStatus = async (
    _previousState,
    formData
) => {
    await requireAdminAction();

    const applicationId = toIdString(formData.get("applicationId"));
    const status = String(formData.get("status") || "").toLowerCase();

    if (!applicationId) return actionError("Choose an application to update.");
    if (!applicationStatuses.has(status)) {
        return actionError("That application status is not supported.");
    }

    const application = await db
        .collection("applications")
        .findOne(idFilter(applicationId), {
            projection: { applicantName: 1, jobTitle: 1 },
        });

    if (!application) {
        return actionError("That application no longer exists.");
    }

    await db.collection("applications").updateOne(idFilter(applicationId), {
        $set: {
            status,
            updatedAt: new Date(),
        },
    });

    refreshAdmin("/dashboard/admin/applications");

    return {
        ok: true,
        message: `${application.applicantName || "Application"} marked ${status}.`,
    };
};

export const updateAdminProfile = async (_previousState, formData) => {
    await requireAdminAction();

    const name = String(formData.get("name") || "").trim();
    const phoneNumber = String(formData.get("phoneNumber") || "").trim();

    if (name.length < 2 || name.length > 80) {
        return actionError("Enter a name between 2 and 80 characters.");
    }

    if (phoneNumber.length > 30) {
        return actionError("The phone number is too long.");
    }

    try {
        await auth.api.updateUser({
            headers: await headers(),
            body: {
                name,
                phoneNumber,
            },
        });
    } catch (error) {
        console.error("Failed to update admin profile:", error);
        return actionError("Could not update your profile. Try again.");
    }

    revalidatePath("/dashboard", "layout");

    return { ok: true, message: "Admin profile updated." };
};
