import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "./core/mongo";

const publicRoles = new Set(["seeker", "recruiter"]);

const plansForRole = {
    seeker: "seeker_free",
    recruiter: "recruiter_free",
};

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            phoneNumber: {
                type: "string",
                required: false,
                input: true,
            },
            role: {
                type: "string",
                required: true,
                input: true,
                default: "seeker",
            },
            plan: {
                type: "string",
                required: false,
                input: true,
                default: "seeker_free",
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // Public sign-up may only create seekers or recruiters.
                    // Admin accounts are promoted directly in the database.
                    const role = publicRoles.has(user.role)
                        ? user.role
                        : "seeker";

                    return {
                        data: {
                            ...user,
                            role,
                            plan: plansForRole[role],
                        },
                    };
                },
            },
            update: {
                before: async (data, context) => {
                    // Authorization fields may only change through guarded admin
                    // actions, never through Better Auth's update-user endpoint.
                    const sessionUser = context?.context?.session?.user;

                    if (!sessionUser) {
                        return;
                    }

                    return {
                        data: {
                            ...data,
                            role: sessionUser.role,
                            plan: sessionUser.plan,
                        },
                    };
                },
            },
        },
    },
});
