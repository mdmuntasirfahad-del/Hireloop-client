"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";
import {
    Briefcase,
    Calendar,
    CircleDollar,
    CircleCheck,
    MapPin,
} from "@gravity-ui/icons";
import { createJob } from "@/lib/action/actions";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const CATEGORIES = [
    "Technology",
    "Design",
    "Marketing",
    "Finance",
    "Human Resources",
    "Sales",
];

const JOB_TYPES = [
    "Full Time",
    "Part Time",
    "Remote",
    "Hybrid",
    "Contract",
    "Internship",
];

const INITIAL_FORM = {
    title: "",
    category: "",
    type: "",
    salary: "",
    location: "",
    deadline: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
};

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0f0f11] px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20";

function Field({ label, hint, children, className = "" }) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                {label}
            </label>
            {children}
            {hint && (
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                    {hint}
                </p>
            )}
        </div>
    );
}

export default function PostJobForm({ company }) {
    const router = useRouter();
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const jobData = {
            ...formData,
            recruiterId: company?.recruiterId,
            companyName: company?.companyName,
            status: "active",
        };

        try {
            const result = await createJob(jobData);

            if (!result?.insertedId) {
                throw new Error("Job was not created");
            }

            toast.success("Job published successfully");
            setFormData(INITIAL_FORM);
            router.push("/dashboard/recruiter/jobs");
        } catch (error) {
            console.error("Error creating job:", error);
            toast.error(
                "We couldn't publish this job. Please check the form and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <SurfaceCard className="p-6 md:p-7">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4">
                    <Briefcase
                        size={18}
                        aria-hidden="true"
                        className="text-indigo-400"
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Role basics
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-500">
                            The essentials candidates see first.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field
                        label="Job title"
                        hint="Be specific — for example, Senior Frontend Engineer."
                        className="md:col-span-2"
                    >
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Developer"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Job category">
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Job type">
                        <select
                            name="type"
                            required
                            value={formData.type}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select a job type</option>
                            {JOB_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
            </SurfaceCard>

            <SurfaceCard className="p-6 md:p-7">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4">
                    <CircleDollar
                        size={18}
                        aria-hidden="true"
                        className="text-indigo-400"
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Compensation and location
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-500">
                            Help candidates understand the offer and where the
                            role is based.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field
                        label="Annual salary"
                        hint="Enter a yearly amount in USD, e.g. 75000."
                    >
                        <div className="relative">
                            <CircleDollar
                                size={15}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                            />
                            <input
                                type="number"
                                name="salary"
                                required
                                min="0"
                                step="1000"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="75000"
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </Field>

                    <Field label="Location">
                        <div className="relative">
                            <MapPin
                                size={15}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                            />
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Dhaka, Bangladesh"
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </Field>

                    <Field
                        label="Application deadline"
                        hint="Applications close at the end of this date."
                    >
                        <div className="relative">
                            <Calendar
                                size={15}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                            />
                            <input
                                type="date"
                                name="deadline"
                                required
                                value={formData.deadline}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </Field>
                </div>
            </SurfaceCard>

            <SurfaceCard className="p-6 md:p-7">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4">
                    <CircleCheck
                        size={18}
                        aria-hidden="true"
                        className="text-indigo-400"
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Role details
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-500">
                            Describe the work, the requirements, and what makes
                            this role worth applying for.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-5">
                    <Field label="Responsibilities">
                        <textarea
                            name="responsibilities"
                            required
                            rows={5}
                            value={formData.responsibilities}
                            onChange={handleChange}
                            placeholder="What will this person own and deliver?"
                            className={`${inputClass} resize-y`}
                        />
                    </Field>

                    <Field label="Requirements">
                        <textarea
                            name="requirements"
                            required
                            rows={5}
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="Skills, experience, and qualifications required."
                            className={`${inputClass} resize-y`}
                        />
                    </Field>

                    <Field
                        label="Benefits (optional)"
                        hint="Perks, flexibility, learning budget, or anything else that stands out."
                    >
                        <textarea
                            name="benefits"
                            rows={4}
                            value={formData.benefits}
                            onChange={handleChange}
                            placeholder="e.g. Health insurance, remote-friendly, annual learning budget."
                            className={`${inputClass} resize-y`}
                        />
                    </Field>
                </div>
            </SurfaceCard>

            <div className="flex flex-col-reverse items-stretch gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-relaxed text-zinc-500">
                    Publishing adds this role to the public job board
                    immediately.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/dashboard/recruiter/jobs"
                        className={buttonStyles.secondary}
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${buttonStyles.primary} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {isSubmitting ? "Publishing..." : "Publish job"}
                    </button>
                </div>
            </div>
        </form>
    );
}
