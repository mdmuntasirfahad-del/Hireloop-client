"use server"

import { revalidatePath, updateTag } from "next/cache"
import { idFilter } from "../admin/ids"
import { db } from "../core/mongo"
import { getUserSession } from "../core/session"
import { serverMutation } from "../core/server"

const textFields = {
    companyName: { label: "Company name", max: 120, required: true },
    industry: { label: "Industry", max: 80 },
    website: { label: "Website", max: 300 },
    location: { label: "Location", max: 120 },
    employeeCount: { label: "Employee count", max: 40 },
    description: { label: "Description", max: 2000 },
}

const actionError = (message) => ({ ok: false, message })

// Bare domains are allowed, but a non-http(s) scheme is not.
const hasInvalidWebsiteProtocol = (value) => {
    const match = String(value || "").match(/^([a-z][a-z0-9+.-]*):/i)

    return match ? !/^https?$/i.test(match[1]) : false
}

const refreshCompany = () => {
    const paths = [
        "/",
        "/jobs",
        "/dashboard/recruiter",
        "/dashboard/recruiter/my-company",
        "/dashboard/recruiter/jobs",
        "/dashboard/recruiter/jobs/new",
        "/dashboard/recruiter/jobs/profile",
        "/dashboard/admin",
        "/dashboard/admin/companies",
        "/dashboard/admin/jobs",
    ]

    paths.forEach((path) => revalidatePath(path))
    revalidatePath("/jobs/[id]", "page")
    updateTag("companies")
}

export const createCompany = async (newCompanyData)=>{
    return await serverMutation('/api/companies', newCompanyData )
}

export const updateCompany = async (payload) => {
    const user = await getUserSession()

    if (!user) {
        return actionError("Sign in to update your company profile.")
    }

    if (user.role !== "recruiter") {
        return actionError("Only recruiters can update a company profile.")
    }

    const companyId = String(payload?.companyId || "").trim()

    if (!companyId) {
        return actionError("Choose a company to update.")
    }

    const company = await db
        .collection("companies")
        .findOne(idFilter(companyId), {
            projection: { recruiterId: 1 },
        })

    if (!company) {
        return actionError("That company profile no longer exists.")
    }

    if (String(company.recruiterId || "") !== String(user.id)) {
        return actionError("You can only update your own company profile.")
    }

    const updates = {}

    for (const [key, config] of Object.entries(textFields)) {
        if (!Object.prototype.hasOwnProperty.call(payload, key)) continue

        const value = String(payload[key] ?? "").trim()

        if (config.required && !value) {
            return actionError(`${config.label} is required.`)
        }

        if (value.length > config.max) {
            return actionError(
                `${config.label} must be ${config.max} characters or fewer.`
            )
        }

        if (key === "website" && value && hasInvalidWebsiteProtocol(value)) {
            return actionError("Website must be a valid http(s) URL.")
        }

        updates[key] = value
    }

    if (Object.prototype.hasOwnProperty.call(payload, "logoUrl")) {
        const logoUrl = String(payload.logoUrl ?? "").trim()

        if (logoUrl.length > 500) {
            return actionError("Logo URL is too long.")
        }

        if (logoUrl && !/^https?:\/\//i.test(logoUrl)) {
            return actionError(
                "Logo URL must start with http:// or https://."
            )
        }

        updates.logoUrl = logoUrl
    }

    if (Object.keys(updates).length === 0) {
        return actionError("Nothing to update.")
    }

    const updatedAt = new Date()

    await db.collection("companies").updateOne(idFilter(companyId), {
        $set: {
            ...updates,
            isApproved: false,
            approvedAt: null,
            approvedBy: null,
            updatedAt,
        },
    })

    refreshCompany()

    return {
        ok: true,
        message: "Company profile updated. It is pending review again.",
        company: {
            ...updates,
            isApproved: false,
        },
    }
}


// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
// export const createCompany=async (newCompanyData) => {
//     const res= await fetch(`${baseUrl}/api/companies`, {
//         method: "POST",
//         headers: {  
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newCompanyData),
//     });
//     return res.json();
// }
