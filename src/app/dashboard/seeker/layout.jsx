import { getUserSessionRole } from "@/lib/core/session";

export default async function SeekerLayout({ children }) {
    await getUserSessionRole('seeker');

    return children;
}
