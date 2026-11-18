import Link from "next/link";
import { redirect } from "next/navigation";
import { Factory, TriangleExclamation } from "@gravity-ui/icons";
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
                description={`Publish a new role for ${company.companyName || "your company"
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
                {company.isApproved === true ? (
                    <PostJobForm company={company} />
                ) : (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                                <TriangleExclamation
                                    size={18}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-semibold text-white">
                                        Company approval pending
                                    </h2>

                                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-amber-300">
                                        Pending review
                                    </span>
                                </div>

                                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-400">
                                    Your company profile is waiting for
                                    review. You can publish jobs as soon as an
                                    admin approves it.
                                </p>

                                <Link
                                    href="/dashboard/recruiter/my-company"
                                    className={`${buttonStyles.secondary} mt-4`}
                                >
                                    View company profile
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}
