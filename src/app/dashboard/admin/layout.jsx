import { getUserSessionRole } from "@/lib/core/session";

export const metadata = {
    title: {
        default: "Admin",
        template: "%s | HireLoop Admin",
    },
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const AdminDashboardLayout = async ({ children }) => {
    await getUserSessionRole("admin");

    return children;
};

export default AdminDashboardLayout;
