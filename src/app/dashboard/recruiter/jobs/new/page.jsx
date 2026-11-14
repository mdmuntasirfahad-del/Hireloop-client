import Link from "next/link";
import { redirect } from "next/navigation";
import { Factory } from "@gravity-ui/icons";
import PostJobForm from "./PostJobForm";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getRecuiterCompanies } from "@/lib/api/companies";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "Post a Job",
    robots: { index: false, follow: false },
};

export default async function PostJobPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/recruiter/jobs/new");
    }

    const company = await getRecuiterCompanies(user.id).catch(() => null);

    if (!company) {
        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="Jobs"
                    title="Post a new job"
                    description="Publish a new role and start receiving applications."
                />

                <div className="mt-8">
                    <EmptyState
                        icon={Factory}
                        title="Set up your company first"
                        description="You need a company profile before publishing a job on HireLoop."
                        action={
                            <Link
                                href="/dashboard/recruiter/my-company"
                                className={buttonStyles.primary}
                            >
                                Register company
                            </Link>
                        }
                    />
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Jobs"
                title="Post a new job"
                description={`Publish a new role for ${
                    company.companyName || "your company"
                }. Clear, specific listings attract better applicants.`}
                actions={
                    <Link
                        href="/dashboard/recruiter/jobs"
                        className={buttonStyles.secondary}
                    >
                        Back to jobs
                    </Link>
                }
            />

            <div className="mt-8 max-w-5xl">
                <PostJobForm company={company} />
            </div>
        </Container>
    );
}
