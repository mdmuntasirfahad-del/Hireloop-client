import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getAdminSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user?.role === "admin" ? session.user : null;
};

export const requireAdminAction = async () => {
    const user = await getAdminSession();

    if (!user) {
        throw new Error("Unauthorized");
    }

    return user;
};

export const getAdminFromRequest = async (request) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    return session?.user?.role === "admin" ? session.user : null;
};
