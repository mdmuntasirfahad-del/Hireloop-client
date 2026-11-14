import Link from "next/link";
import { Bookmark, Magnifier } from "@gravity-ui/icons";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

export const metadata = {
    title: "Saved Jobs",
    robots: { index: false, follow: false },
};

export default function SeekerSavedJobsPage() {
    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="Saved jobs"
                title="Your saved roles"
                description="Keep track of the jobs you want to revisit before applying."
                actions={
                    <Link
                        href="/dashboard/seeker/jobs"
                        className={buttonStyles.primary}
                    >
                        <Magnifier size={16} aria-hidden="true" />
                        Find jobs
                    </Link>
                }
            />

            <div className="mt-8">
                <SurfaceCard className="p-3">
                    <EmptyState
                        icon={Bookmark}
                        title="No saved jobs yet"
                        description="Jobs you save will appear here so you can compare them and apply when you are ready."
                        action={
                            <Link
                                href="/dashboard/seeker/jobs"
                                className={buttonStyles.secondary}
                            >
                                Browse jobs
                            </Link>
                        }
                        className="border-0 bg-transparent"
                    />
                </SurfaceCard>
            </div>
        </Container>
    );
}
