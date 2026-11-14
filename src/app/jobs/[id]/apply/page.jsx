import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock } from "@gravity-ui/icons";
import { getJobsById } from "@/lib/api/jobs";
import { getApplicationsByApplicant } from "@/lib/api/applications";
import { getPlanById } from "@/lib/api/plans";
import { getUserSession } from "@/lib/core/session";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/buttonStyles";
import ApplyPanel from "./ApplyPanel";

export const metadata = {
    title: "Apply",
    robots: { index: false, follow: false },
};

const isValidObjectId = (value) => /^[a-f0-9]{24}$/i.test(value);

const ApplyPage = async ({ params }) => {
    const user = await getUserSession();
    const { id } = await params;

    if (!user) {
        redirect(`/auth/signin?redirect=/jobs/${id}/apply`);
    }

    if (user.role !== "seeker") {
        return (
            <Container className="py-16 md:py-24">
                <EmptyState
                    icon={Lock}
                    title="Seeker account required"
                    description="Only job seekers can apply for roles. Sign in with a seeker account to continue."
                    action={
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href={`/auth/signin?redirect=/jobs/${id}/apply`}
                                className={buttonStyles.primary}
                            >
                                Sign in as a seeker
                            </Link>
                            <Link
                                href="/jobs"
                                className={buttonStyles.secondary}
                            >
                                Browse jobs
                            </Link>
                        </div>
                    }
                />
            </Container>
        );
    }

    const job = isValidObjectId(id)
        ? await getJobsById(id).catch(() => null)
        : null;

    if (!job) {
        notFound();
    }

    const applications = await getApplicationsByApplicant(user.id).catch(
        () => []
    );
    const plan = await getPlanById(user?.plan || "seeker_free").catch(
        () => null
    );

    const applicationCount = Array.isArray(applications)
        ? applications.length
        : 0;
    const maxApplications = Number(plan?.maxApplicationsPerMonth) || 0;

    return (
        <ApplyPanel
            user={user}
            job={job}
            initialCount={applicationCount}
            maxApplications={maxApplications}
        />
    );
};

export default ApplyPage;
