import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";

export default async function DashboardPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard");
    }

    if (user.role === "admin") {
        redirect("/dashboard/admin");
    }

    redirect(
        user.role === "recruiter"
            ? "/dashboard/recruiter"
            : "/dashboard/seeker"
    );
}
