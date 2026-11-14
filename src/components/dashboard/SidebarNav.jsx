"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    SquareChartColumn,
    Factory,
    Briefcase,
    Receipt,
    Person,
    Gear,
    Magnifier,
    Bookmark,
    FileText,
    CirclePlus,
    Persons,
    ChartLine,
    ArrowRightFromSquare,
} from "@gravity-ui/icons";

const recruiterMenuItems = [
    {
        name: "Dashboard",
        href: "/dashboard/recruiter",
        icon: SquareChartColumn,
    },
    {
        name: "My company",
        href: "/dashboard/recruiter/my-company",
        icon: Factory,
    },
    {
        name: "Manage jobs",
        href: "/dashboard/recruiter/jobs",
        icon: Briefcase,
    },
    {
        name: "Post a job",
        href: "/dashboard/recruiter/jobs/new",
        icon: CirclePlus,
    },
    {
        name: "Profile",
        href: "/dashboard/recruiter/jobs/profile",
        icon: Person,
    },
];

const seekerMenuItems = [
    {
        name: "Dashboard",
        href: "/dashboard/seeker",
        icon: SquareChartColumn,
    },
    {
        name: "Jobs",
        href: "/dashboard/seeker/jobs",
        icon: Magnifier,
    },
    {
        name: "Saved jobs",
        href: "/dashboard/seeker/saved-jobs",
        icon: Bookmark,
    },
    {
        name: "Applications",
        href: "/dashboard/seeker/applications",
        icon: FileText,
    },
    {
        name: "Billing",
        href: "/dashboard/seeker/billing",
        icon: Receipt,
    },
    {
        name: "Settings",
        href: "/dashboard/seeker/settings",
        icon: Gear,
    },
];

const adminMenuItems = [
    {
        name: "Overview",
        href: "/dashboard/admin",
        icon: SquareChartColumn,
    },
    {
        name: "Users",
        href: "/dashboard/admin/users",
        icon: Persons,
    },
    {
        name: "Jobs",
        href: "/dashboard/admin/jobs",
        icon: Briefcase,
    },
    {
        name: "Companies",
        href: "/dashboard/admin/companies",
        icon: Factory,
    },
    {
        name: "Applications",
        href: "/dashboard/admin/applications",
        icon: FileText,
    },
    {
        name: "Reports",
        href: "/dashboard/admin/reports",
        icon: ChartLine,
    },
    {
        name: "Settings",
        href: "/dashboard/admin/settings",
        icon: Gear,
    },
    {
        name: "Logout",
        href: "/dashboard/admin/logout",
        icon: ArrowRightFromSquare,
    },
];

const navLinksMap = {
    recruiter: recruiterMenuItems,
    seeker: seekerMenuItems,
    admin: adminMenuItems,
};

const sectionLabels = {
    admin: "HIRELOOP ADMIN",
    recruiter: "Workspace",
    seeker: "Workspace",
};

export default function SidebarNav({ role }) {
    const pathname = usePathname();
    const items = navLinksMap[role] || [];

    // Longest matching href wins, so only one item is ever active.
    const activeHref = items
        .filter(
            (item) =>
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
        )
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    return (
        <nav aria-label="Dashboard navigation" className="flex flex-col gap-1">
            <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                {sectionLabels[role] || "Workspace"}
            </p>

            {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === activeHref;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ${
                            isActive
                                ? "bg-indigo-500/10 text-white"
                                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                        }`}
                    >
                        <Icon
                            size={18}
                            aria-hidden="true"
                            className={
                                isActive
                                    ? "shrink-0 text-indigo-300"
                                    : "shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-300"
                            }
                        />

                        <span className="truncate">{item.name}</span>

                        {isActive && (
                            <span
                                aria-hidden="true"
                                className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400"
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
