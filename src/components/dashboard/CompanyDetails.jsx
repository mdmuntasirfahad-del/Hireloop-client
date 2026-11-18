"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    CircleCheck,
    CircleXmark,
    Clock,
    Factory,
    Globe,
    LocationArrow,
    Pencil,
    Persons,
} from "@gravity-ui/icons";
import RegisterCompanyModal from "./RegisterCompanyModal";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

function StatusBadge({ company }) {
    const status =
        company?.status || (company?.isApproved ? "Approved" : "Pending");

    if (status === "Approved") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
                <CircleCheck size={13} aria-hidden="true" />
                Approved
            </span>
        );
    }

    if (status === "Rejected") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-medium text-red-300">
                <CircleXmark size={13} aria-hidden="true" />
                Rejected
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-medium text-amber-300">
            <Clock size={13} aria-hidden="true" />
            Pending review
        </span>
    );
}

function DetailTile({ icon: Icon, label, children }) {
    return (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                <Icon size={14} aria-hidden="true" className="text-indigo-400" />
                {label}
            </span>
            <div className="mt-1.5 truncate text-sm text-zinc-200">
                {children}
            </div>
        </div>
    );
}

export default function CompanyDetails({ recruiterCompany }) {
    const router = useRouter();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [companyData, setCompanyData] = useState(recruiterCompany);

    if (!companyData) return null;

    const companyName = companyData.companyName || "My company";
    const industry = companyData.industry || "Industry not specified";
    const jobLimit = Number(companyData.jobLimit) || 3;
    const activeJobs = Number(companyData.activeJobsCount) || 0;

    const handleUpdateSuccess = (updatedCompany) => {
        setCompanyData((previous) => ({
            ...previous,
            ...updatedCompany,
            isApproved: false,
            status: "Pending",
        }));
        setIsDetailsModalOpen(false);
        setIsLogoModalOpen(false);
        router.refresh();
    };

    return (
        <>
            <Container className="py-8 md:py-10">
                <PageHeader
                    eyebrow="Company"
                    title={companyName}
                    description={`${industry}${
                        companyData.location ? ` · ${companyData.location}` : ""
                    }`}
                    actions={
                        <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge company={companyData} />

                            <button
                                type="button"
                                onClick={() => setIsDetailsModalOpen(true)}
                                className={buttonStyles.secondary}
                                aria-label="Edit company details"
                            >
                                <Pencil size={14} aria-hidden="true" />
                                Edit details
                            </button>
                        </div>
                    }
                />

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                    <SurfaceCard className="p-6 md:p-7">
                        <div className="flex flex-col gap-5 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center">
                            <div className="relative shrink-0">
                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400">
                                    {companyData.logoUrl ? (
                                        <img
                                            src={companyData.logoUrl}
                                            alt={`${companyName} logo`}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Factory size={28} aria-hidden="true" />
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsLogoModalOpen(true)}
                                    aria-label="Change company logo"
                                    title="Change company logo"
                                    className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#18181b] text-zinc-300 shadow-lg transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                >
                                    <Pencil size={12} aria-hidden="true" />
                                </button>
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-xl font-semibold tracking-tight text-white">
                                    {companyName}
                                </h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    {companyData.employeeCount
                                        ? `${companyData.employeeCount} employees`
                                        : "Employee count not specified"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <DetailTile icon={Globe} label="Website">
                                {companyData.website ? (
                                    <a
                                        href={
                                            companyData.website.startsWith("http")
                                                ? companyData.website
                                                : `https://${companyData.website}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-300 transition-colors hover:text-indigo-200"
                                    >
                                        {companyData.website}
                                    </a>
                                ) : (
                                    "Not specified"
                                )}
                            </DetailTile>

                            <DetailTile icon={LocationArrow} label="Location">
                                {companyData.location || "Not specified"}
                            </DetailTile>

                            <DetailTile icon={Persons} label="Employee count">
                                {companyData.employeeCount
                                    ? `${companyData.employeeCount} employees`
                                    : "Not specified"}
                            </DetailTile>

                            <DetailTile icon={Briefcase} label="Job posting limit">
                                {companyData.plan || "Free"} plan · {activeJobs}/
                                {jobLimit} active jobs
                            </DetailTile>
                        </div>

                        <div className="mt-6 border-t border-white/[0.06] pt-6">
                            <h3 className="text-xs font-medium text-zinc-500">
                                About the company
                            </h3>
                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                                {companyData.description ||
                                    "No company description provided yet."}
                            </p>
                        </div>
                    </SurfaceCard>

                    <SurfaceCard className="p-6">
                        <h2 className="text-sm font-semibold text-white">
                            Hiring readiness
                        </h2>

                        <ul className="mt-4 space-y-3 text-xs leading-relaxed text-zinc-400">
                            <li className="flex gap-2.5">
                                <CircleCheck
                                    size={15}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-emerald-400"
                                />
                                Company profile created
                            </li>
                            <li className="flex gap-2.5">
                                {companyData.isApproved ? (
                                    <CircleCheck
                                        size={15}
                                        aria-hidden="true"
                                        className="mt-0.5 shrink-0 text-emerald-400"
                                    />
                                ) : (
                                    <Clock
                                        size={15}
                                        aria-hidden="true"
                                        className="mt-0.5 shrink-0 text-amber-400"
                                    />
                                )}
                                {companyData.isApproved
                                    ? "Verified by the HireLoop team"
                                    : "Verification is pending review"}
                            </li>
                            <li className="flex gap-2.5">
                                <CircleCheck
                                    size={15}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-emerald-400"
                                />
                                {activeJobs} of {jobLimit} job slots in use
                            </li>
                        </ul>

                        <p className="mt-5 border-t border-white/[0.06] pt-4 text-[11px] leading-relaxed text-zinc-500">
                            Editing your company profile resets it to pending
                            review.
                        </p>
                    </SurfaceCard>
                </div>
            </Container>

            <RegisterCompanyModal
                mode="details"
                isOpen={isDetailsModalOpen}
                onOpenChange={setIsDetailsModalOpen}
                onSuccess={handleUpdateSuccess}
                initialData={companyData}
            />

            <RegisterCompanyModal
                mode="logo"
                isOpen={isLogoModalOpen}
                onOpenChange={setIsLogoModalOpen}
                onSuccess={handleUpdateSuccess}
                initialData={companyData}
            />
        </>
    );
}
