import Link from "next/link";
import { Briefcase, Magnifier } from "@gravity-ui/icons";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/buttonStyles";

export const metadata = {
    title: "Job not found",
    robots: { index: false, follow: false },
};

export default function JobNotFound() {
    return (
        <Container className="py-16 md:py-24">
            <EmptyState
                icon={Briefcase}
                title="Job listing not found"
                description="This role may have been filled or removed. Browse the job board to find similar opportunities."
                action={
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href="/jobs" className={buttonStyles.primary}>
                            <Magnifier size={16} aria-hidden="true" />
                            Browse jobs
                        </Link>

                        <Link href="/" className={buttonStyles.secondary}>
                            Back to home
                        </Link>
                    </div>
                }
            />
        </Container>
    );
}
