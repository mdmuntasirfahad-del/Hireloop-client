import JobSearchFilter from "@/components/jobs/JobSearchFilter";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import { getJobs } from "@/lib/api/jobs";

export const metadata = {
    title: "Find Jobs",
    robots: { index: false, follow: false },
};

// Keep the dashboard board aligned with the public job board.
export const dynamic = "force-dynamic";

export default async function SeekerJobsPage() {
    let jobs = [];

    try {
        const result = await getJobs();
        jobs = Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Failed to load jobs:", error);
    }

    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Job board"
                title="Find your next role"
                description="Search open positions and apply to roles that match your skills."
                actions={
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                            aria-hidden="true"
                        />
                        {jobs.length} open {jobs.length === 1 ? "role" : "roles"}
                    </span>
                }
            />

            <div className="mt-8">
                <JobSearchFilter initialJobs={jobs} />
            </div>
        </Container>
    );
}
