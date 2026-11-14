import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, CirclePlus, Factory } from "@gravity-ui/icons";
import JobsTable from "@/components/dashboard/JobsTable";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getRecuiterCompanies } from "@/lib/api/companies";
import { getRecruiterJobs } from "@/lib/api/jobs";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
    title: "Manage Jobs",
    robots: { index: false, follow: false },
};

export default async function RecruiterJobsPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/recruiter/jobs");
    }

    const company = await getRecuiterCompanies(user.id).catch(() => null);

    if (!company) {
        return (
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="Jobs"
                    title="Manage jobs"
                    description="Create and manage the roles your company is hiring for."
                />

                <div className="mt-8">
                    <EmptyState
                        icon={Factory}
                        title="Set up your company first"
                        description="Register your company profile before publishing job posts on HireLoop."
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

    let jobs = [];

    try {
        const result = await getRecruiterJobs(
            company.recruiterId || user.id
        );
        jobs = Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Failed to load company jobs:", error);
    }

    const activeJobs = jobs.filter(
        (job) => (job.status || "active") === "active"
    ).length;

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Jobs"
                title="Manage jobs"
                description={`Manage ${company.companyName || "your company"}'s job postings and keep the board up to date.`}
                actions={
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
                            <span
                                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                                aria-hidden="true"
                            />
                            {activeJobs} active
                        </span>

                        <Link
                            href="/dashboard/recruiter/jobs/new"
                            className={buttonStyles.primary}
                        >
                            <CirclePlus size={16} aria-hidden="true" />
                            Post a job
                        </Link>
                    </div>
                }
            />

            <div className="mt-8">
                {jobs.length > 0 ? (
                    <JobsTable jobs={jobs} />
                ) : (
                    <EmptyState
                        icon={Briefcase}
                        title="No job posts yet"
                        description="Publish your first role to start receiving applications from candidates."
                        action={
                            <Link
                                href="/dashboard/recruiter/jobs/new"
                                className={buttonStyles.primary}
                            >
                                <CirclePlus size={16} aria-hidden="true" />
                                Post your first job
                            </Link>
                        }
                    />
                )}
            </div>
        </Container>
    );
}
