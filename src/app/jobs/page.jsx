import Link from "next/link";
import { TriangleExclamation } from "@gravity-ui/icons";
import JobSearchFilter from "@/components/jobs/JobSearchFilter";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { getJobs } from "@/lib/api/jobs";

export const metadata = {
    title: "Browse Jobs",
    description:
        "Explore open roles from hiring teams on HireLoop. Filter by category, job type, and location.",
};

// The board should always reflect the latest roles instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function JobsPage() {
    let jobList = [];
    let loadFailed = false;

    try {
        const jobs = await getJobs();
        jobList = Array.isArray(jobs) ? jobs : [];
    } catch (error) {
        console.error("Failed to load jobs:", error);
        loadFailed = true;
    }

    return (
        <Container className="py-10 md:py-14">
            <PageHeader
                eyebrow="Job board"
                title="Explore open positions"
                description="Discover your next career opportunity on HireLoop. Search by title, company, or city, then narrow the list by category and job type."
                actions={
                    !loadFailed ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
                            <span
                                className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                                aria-hidden="true"
                            />
                            {jobList.length} open{" "}
                            {jobList.length === 1 ? "role" : "roles"}
                        </span>
                    ) : null
                }
            />

            <div className="mt-8">
                {loadFailed ? (
                    <EmptyState
                        icon={TriangleExclamation}
                        title="We couldn't load jobs right now"
                        description="The job board is temporarily unavailable. Check your connection and try again."
                        action={
                            <Link href="/jobs" className={buttonStyles.secondary}>
                                Try again
                            </Link>
                        }
                    />
                ) : (
                    <JobSearchFilter initialJobs={jobList} />
                )}
            </div>
        </Container>
    );
}
