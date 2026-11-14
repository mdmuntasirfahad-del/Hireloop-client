"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Form,
    TextField,
    Label,
    Input,
    Description,
    FieldError,
    TextArea,
    toast,
} from "@heroui/react";
import {
    Link as LinkIcon,
    Globe,
    FileText,
    Person,
    Envelope,
    CircleCheck,
} from "@gravity-ui/icons";
import { submitApplication } from "@/lib/action/application";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0f0f11] px-3.5 py-2.5 text-xs text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20";

export default function JobApply({ job, applicant, onSubmitted }) {
    const [formData, setFormData] = useState({
        resumeUrl: "",
        portfolioUrl: "",
        coverNote: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const applicationPayload = {
            jobId: job?._id || job?.id,
            jobTitle: job?.title,
            companyName: job?.companyName,
            applicantId: applicant?._id || applicant?.id,
            applicantName: applicant?.name,
            applicantEmail: applicant?.email,
            resumeUrl: formData.resumeUrl,
            portfolioUrl: formData.portfolioUrl || null,
            coverNote: formData.coverNote || null,
            appliedAt: new Date().toISOString(),
        };

        try {
            const result = await submitApplication(applicationPayload);

            if (result.insertedId) {
                setSubmitted(true);
                onSubmitted?.();
                toast.success("Application submitted successfully");
            } else {
                toast.error("Failed to submit application");
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error(
                "We couldn't submit your application. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            resumeUrl: "",
            portfolioUrl: "",
            coverNote: "",
        });
    };

    if (submitted) {
        return (
            <div className="mx-auto max-w-2xl">
                <SurfaceCard className="p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        <CircleCheck size={26} aria-hidden="true" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
                        Application submitted
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                        Your application for{" "}
                        <span className="font-medium text-white">
                            {job?.title}
                        </span>{" "}
                        at{" "}
                        <span className="font-medium text-white">
                            {job?.companyName || "the company"}
                        </span>{" "}
                        has been sent successfully.
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/dashboard/seeker/applications"
                            className={buttonStyles.primary}
                        >
                            View applications
                        </Link>
                        <Link
                            href="/jobs"
                            className={buttonStyles.secondary}
                        >
                            Browse more jobs
                        </Link>
                    </div>
                </SurfaceCard>
            </div>
        );
    }

    return (
        <SurfaceCard className="mx-auto max-w-2xl p-6 md:p-8">
            <div className="border-b border-white/[0.08] pb-5">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                    Apply for {job?.title || "this role"}
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                    Submitting to{" "}
                    <span className="font-medium text-indigo-300">
                        {job?.companyName || "the company"}
                    </span>
                </p>
            </div>

            <Form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Applicant summary */}
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                            <Person size={12} aria-hidden="true" />
                            Applicant name
                        </span>
                        <p className="text-xs font-semibold text-zinc-200">
                            {applicant?.name || "Job seeker"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                            <Envelope size={12} aria-hidden="true" />
                            Email address
                        </span>
                        <p className="truncate text-xs font-semibold text-zinc-200">
                            {applicant?.email || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Resume link */}
                <TextField className="w-full space-y-1.5" isRequired>
                    <Label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                        <LinkIcon
                            size={14}
                            className="text-indigo-400"
                            aria-hidden="true"
                        />
                        Resume / CV URL{" "}
                        <span className="text-red-400">*</span>
                    </Label>
                    <Input
                        type="url"
                        name="resumeUrl"
                        autoComplete="url"
                        value={formData.resumeUrl}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                resumeUrl: event.target.value,
                            })
                        }
                        placeholder="https://drive.google.com/file/d/..."
                        className={inputClass}
                    />
                    <Description className="block text-[11px] text-zinc-500">
                        Provide a publicly viewable link (Google Drive,
                        Dropbox, Notion, or personal server).
                    </Description>
                    <FieldError className="block text-[11px] text-red-400" />
                </TextField>

                {/* Portfolio link */}
                <TextField className="w-full space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                        <Globe
                            size={14}
                            className="text-indigo-400"
                            aria-hidden="true"
                        />
                        Portfolio / GitHub link{" "}
                        <span className="text-[10px] text-zinc-500">
                            (optional)
                        </span>
                    </Label>
                    <Input
                        type="url"
                        name="portfolioUrl"
                        autoComplete="url"
                        value={formData.portfolioUrl}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                portfolioUrl: event.target.value,
                            })
                        }
                        placeholder="https://github.com/username"
                        className={inputClass}
                    />
                    <Description className="block text-[11px] text-zinc-500">
                        Share your portfolio, GitHub profile, or personal
                        website.
                    </Description>
                    <FieldError className="block text-[11px] text-red-400" />
                </TextField>

                {/* Cover note */}
                <TextField className="w-full space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                        <FileText
                            size={14}
                            className="text-indigo-400"
                            aria-hidden="true"
                        />
                        Cover note / message{" "}
                        <span className="text-[10px] text-zinc-500">
                            (optional)
                        </span>
                    </Label>
                    <TextArea
                        rows={4}
                        name="coverNote"
                        value={formData.coverNote}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                coverNote: event.target.value,
                            })
                        }
                        placeholder="Why are you a good fit for this position?"
                        className={`${inputClass} resize-none`}
                    />
                    <Description className="block text-[11px] text-zinc-500">
                        Keep it brief and highlight qualifications relevant to{" "}
                        {job?.title}.
                    </Description>
                    <FieldError className="block text-[11px] text-red-400" />
                </TextField>

                <div className="flex flex-col-reverse items-stretch gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-end">
                    <button
                        type="button"
                        onClick={handleReset}
                        className={buttonStyles.secondary}
                    >
                        Clear form
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.resumeUrl}
                        className={`${buttonStyles.primary} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit application"}
                    </button>
                </div>
            </Form>
        </SurfaceCard>
    );
}
