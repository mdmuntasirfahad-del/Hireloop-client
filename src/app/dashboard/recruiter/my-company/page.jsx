import Link from "next/link";
import { redirect } from "next/navigation";
import { TriangleExclamation } from "@gravity-ui/icons";
import MyCompany from "@/components/dashboard/MyCompany";
import CompanyDetails from "@/components/dashboard/CompanyDetails";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getRecuiterCompanies } from "@/lib/api/companies";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "My Company",
    robots: { index: false, follow: false },
};

export default async function MyCompanyPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/recruiter/my-company");
    }

    let company = null;
    let loadFailed = false;

    try {
        company = await getRecuiterCompanies(user.id);
    } catch (error) {
        console.error("Failed to load recruiter company:", error);
        loadFailed = true;
    }

    if (loadFailed) {
        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="Company"
                    title="My company"
                    description="Manage your company profile and hiring details."
                />

                <div className="mt-8">
                    <EmptyState
                        icon={TriangleExclamation}
                        title="We couldn't load your company"
                        description="The company service is temporarily unavailable. Please try again."
                        action={
                            <a
                                href="/dashboard/recruiter/my-company"
                                className={buttonStyles.secondary}
                            >
                                Try again
                            </a>
                        }
                    />
                </div>
            </Container>
        );
    }

    return company ? (
        <CompanyDetails recruiterCompany={company} recruiter={user} />
    ) : (
        <MyCompany />
    );
}
