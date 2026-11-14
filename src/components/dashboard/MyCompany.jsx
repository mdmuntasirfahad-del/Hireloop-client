"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    CircleCheck,
    Factory,
    ShieldCheck,
    Sparkles,
} from "@gravity-ui/icons";
import RegisterCompanyModal from "./RegisterCompanyModal";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const benefits = [
    {
        icon: ShieldCheck,
        text: "Get verified so candidates know your company is legitimate.",
    },
    {
        icon: Sparkles,
        text: "Showcase your culture, website, and team size on every role.",
    },
    {
        icon: CircleCheck,
        text: "Unlock job posting and applicant management from your dashboard.",
    },
];

export default function CompanyNotRegistered() {
    const router = useRouter();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const handleSuccess = () => {
        setIsRegisterModalOpen(false);
        router.refresh();
    };

    return (
        <>
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="Company"
                    title="My company"
                    description="Register your company profile to start hiring on HireLoop."
                />

                <SurfaceCard className="mt-8 overflow-hidden">
                    <div className="grid gap-8 p-7 md:grid-cols-[minmax(0,1fr)_300px] md:items-center md:p-10">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
                                <Factory size={12} aria-hidden="true" />
                                Company profile
                            </span>

                            <h2 className="mt-4 max-w-lg text-2xl font-semibold tracking-tight text-white">
                                Set up your company to start hiring
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                                Add your business details once, then publish
                                roles and manage applicants from a single
                                dashboard.
                            </p>

                            <ul className="mt-6 space-y-3">
                                {benefits.map(({ icon: Icon, text }) => (
                                    <li
                                        key={text}
                                        className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-400"
                                    >
                                        <Icon
                                            size={15}
                                            aria-hidden="true"
                                            className="mt-0.5 shrink-0 text-indigo-400"
                                        />
                                        {text}
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => setIsRegisterModalOpen(true)}
                                className={`${buttonStyles.primary} mt-7`}
                            >
                                Register your company
                                <ArrowRight size={16} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300">
                                <Factory size={24} aria-hidden="true" />
                            </div>

                            <p className="mt-4 text-sm font-semibold text-white">
                                What you get
                            </p>

                            <ul className="mt-3 space-y-2.5 text-[11px] leading-relaxed text-zinc-500">
                                <li>Company profile with logo and website</li>
                                <li>Job posting dashboard and limits</li>
                                <li>Applicant overview in one place</li>
                            </ul>

                            <p className="mt-5 border-t border-white/[0.06] pt-4 text-[10px] leading-relaxed text-zinc-600">
                                Your profile is reviewed before going live.
                            </p>
                        </div>
                    </div>
                </SurfaceCard>
            </Container>

            <RegisterCompanyModal
                isOpen={isRegisterModalOpen}
                onOpenChange={setIsRegisterModalOpen}
                onSuccess={handleSuccess}
            />
        </>
    );
}
