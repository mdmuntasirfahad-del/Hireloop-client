import { auth } from "../auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export const getUserSession = async () => {

    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })

    return session?.user || null

}

export const getUserSessionRole = async (role) => {

    const user = await getUserSession();

    if (!user) {
        redirect(`/auth/signin?redirect=/dashboard/${role}`);
    }

    if (user.role !== role) {
        redirect("/unauthorized");
    }

    return user;
}
