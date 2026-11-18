"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "../auth"
import { getUserSession } from "../core/session"

const actionError = (message) => ({ ok: false, message })

const refreshProfile = () => {
    // The dashboard layout renders the sidebar avatar and name.
    revalidatePath("/dashboard", "layout")
    revalidatePath("/dashboard/recruiter/jobs/profile")
}

export const updateProfilePhoto = async (payload) => {
    const user = await getUserSession()

    if (!user) {
        return actionError("Sign in to update your profile photo.")
    }

    const image = String(payload?.image ?? "").trim()

    if (image.length > 500) {
        return actionError("That photo URL is too long.")
    }

    if (image && !/^https?:\/\//i.test(image)) {
        return actionError("The photo URL must start with http:// or https://.")
    }

    try {
        await auth.api.updateUser({
            headers: await headers(),
            body: { image },
        })
    } catch (error) {
        console.error("Failed to update profile photo:", error)
        return actionError("Could not update your profile photo. Try again.")
    }

    refreshProfile()

    return {
        ok: true,
        message: image ? "Profile photo updated." : "Profile photo removed.",
        image,
    }
}

export const updateProfileDetails = async (payload) => {
    const user = await getUserSession()

    if (!user) {
        return actionError("Sign in to update your profile details.")
    }

    const name = String(payload?.name ?? "").trim()
    const phoneNumber = String(payload?.phoneNumber ?? "").trim()

    if (name.length < 2 || name.length > 80) {
        return actionError("Enter a name between 2 and 80 characters.")
    }

    if (phoneNumber.length > 30) {
        return actionError("The phone number is too long.")
    }

    try {
        await auth.api.updateUser({
            headers: await headers(),
            body: { name, phoneNumber },
        })
    } catch (error) {
        console.error("Failed to update profile details:", error)
        return actionError("Could not update your profile. Try again.")
    }

    refreshProfile()

    return {
        ok: true,
        message: "Profile details updated.",
        name,
        phoneNumber,
    }
}
