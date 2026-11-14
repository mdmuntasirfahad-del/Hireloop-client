import Link from "next/link";
import {
    ArrowRight,
    PersonPlus,
    Rocket,
    Sparkles,
} from "@gravity-ui/icons";
import JobCTA from "@/components/JobCTA";
import JobDiscovery from "@/components/JobDiscovery";
import JobFeatures from "@/components/JobFeatures";
import JobHero from "@/components/JobHero";
import JobPricing from "@/components/JobPricing";
import JobStats from "@/components/JobStats";
import { getHomeJobs } from "@/lib/api/jobs";

// Refresh the landing page's featured roles every five minutes.
export const revalidate = 300;

const getTimestamp = (value) => {
    if (!value) return 0;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const formatSalary = (value) => {
    if (value === null || value === undefined || value === "") return null;

    const raw = String(value).trim();
    const numeric = Number(raw.replace(/,/g, ""));

    if (Number.isFinite(numeric) && numeric > 0 && /^\d[\d,]*$/.test(raw)) {
        return `$${numeric.toLocaleString()} / year`;
    }

    return raw;
};

const summarize = (value, fallback) => {
    if (!value) return fallback;

    const text = String(value).replace(/\s+/g, " ").trim();
    if (text.length <= 140) return text;

    return `${text.slice(0, 137).trimEnd()}...`;
};

const toHomeJob = (job) => ({
    id: String(job._id),
    href: `/jobs/${job._id}`,
    title: job.title || "Untitled role",
    description: summarize(
        job.responsibilities,
        job.category
            ? `${job.category} role at ${job.companyName || "HireLoop"}.`
            : "View the full role details and apply on HireLoop."
    ),
    location: job.location || null,
    type: job.type || null,
    salary: formatSalary(job.salary),
});

const steps = [
    {
        icon: PersonPlus,
        title: "Create your profile",
        description:
            "Tell us your role, skills, and salary expectations. It only takes a few minutes.",
    },
    {
        icon: Sparkles,
        title: "Get matched by AI",
        description:
            "Receive a daily brief of curated roles that fit your experience and goals.",
    },
    {
        icon: Rocket,
        title: "Apply in one click",
        description:
            "Send a tailored application and track every response from your dashboard.",
    },
];

const trustHighlights = [
    { label: "Hiring teams", value: "12,000+" },
    { label: "Open roles", value: "50,000+" },
    { label: "Job seekers", value: "2M+" },
];

function SectionDivider() {
    return (
        <div
            aria-hidden="true"
            className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
    );
}

export default async function Home() {
    let homeJobs = [];

    try {
        const jobs = await getHomeJobs();

        homeJobs = [...jobs]
            .sort(
                (a, b) =>
                    getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
            )
            .slice(0, 6)
            .map(toHomeJob);
    } catch (error) {
        console.error("Failed to load featured jobs:", error);
    }

    return (
        <div className="relative overflow-x-clip bg-black text-white selection:bg-indigo-500/30 selection:text-white">
            <JobHero />

            {/* Trust strip */}
            <section className="border-y border-white/[0.06] bg-[#080808]">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-7 text-center sm:justify-between">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                        Trusted by 12,000+ hiring teams
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                        {trustHighlights.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-baseline gap-2"
                            >
                                <span className="text-sm font-semibold text-zinc-200">
                                    {item.value}
                                </span>
                                <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <JobStats />

            {/* Constrain the discovery grid without touching the component */}
            <div className="mx-auto max-w-6xl">
                <JobDiscovery items={homeJobs} />
            </div>

            <SectionDivider />

            {/* How it works */}
            <section className="px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <p className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-zinc-300">
                            <span
                                className="h-1.5 w-1.5 bg-indigo-500"
                                aria-hidden="true"
                            />
                            How it works
                            <span
                                className="h-1.5 w-1.5 bg-indigo-500"
                                aria-hidden="true"
                            />
                        </p>

                        <h2 className="mx-auto mt-4 max-w-lg text-balance text-4xl font-medium leading-tight sm:text-5xl">
                            From first search to signed offer
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
                            HireLoop removes the busywork between finding a
                            role and getting hired.
                        </p>
                    </div>

                    <ol className="mt-14 grid gap-5 md:grid-cols-3">
                        {steps.map(
                            ({ icon: Icon, title, description }, index) => (
                                <li
                                    key={title}
                                    className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 transition-colors group-hover:border-indigo-400/40 group-hover:text-indigo-200">
                                            <Icon size={20} aria-hidden="true" />
                                        </span>

                                        <span className="font-mono text-xs text-zinc-600">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    <h3 className="mt-6 text-lg font-medium text-white">
                                        {title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                        {description}
                                    </p>
                                </li>
                            )
                        )}
                    </ol>

                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                            Create a free account
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* Keep the feature band full-width while constraining the grid */}
            <div className="bg-[#161616]">
                <div className="mx-auto max-w-6xl">
                    <JobFeatures />
                </div>
            </div>

            <JobPricing />

            <SectionDivider />

            <JobCTA />
        </div>
    );
}
