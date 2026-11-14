import Link from "next/link";
import { ArrowLeft, ArrowRightFromSquare } from "@gravity-ui/icons";
import SignOutButton from "@/components/dashboard/SignOutButton";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

export const metadata = {
    title: "Logout",
};

export default function AdminLogoutPage() {
    return (
        <Container className="py-8 md:py-10">
            <PageHeader
                eyebrow="HIRELOOP ADMIN"
                title="Sign out"
                description="End your administrator session and return to the HireLoop sign-in page."
            />

            <div className="mt-8 max-w-2xl">
                <SurfaceCard className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300">
                            <ArrowRightFromSquare
                                size={20}
                                aria-hidden="true"
                            />
                        </span>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Sign out of HireLoop Admin?
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                                You will need to sign in again before returning
                                to the admin dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">
                        <SignOutButton />

                        <Link
                            href="/dashboard/admin"
                            className={buttonStyles.secondary}
                        >
                            <ArrowLeft size={15} aria-hidden="true" />
                            Back to overview
                        </Link>
                    </div>
                </SurfaceCard>
            </div>
        </Container>
    );
}
