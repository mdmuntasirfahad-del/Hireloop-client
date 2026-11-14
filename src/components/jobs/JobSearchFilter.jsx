"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TextField, Label, InputGroup, Select, ListBox } from "@heroui/react";
import {
    ChevronLeft,
    ChevronRight,
    Magnifier,
    Xmark,
} from "@gravity-ui/icons";
import JobCard from "@/components/jobs/JobCard";
import EmptyState from "@/components/ui/EmptyState";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { buttonStyles } from "@/components/ui/buttonStyles";

const JOBS_PER_PAGE = 9;

const filterControlClass =
    "w-full rounded-xl border border-white/10 bg-[#0f0f11] px-3 py-2.5 text-xs text-zinc-100 transition-colors focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-500/20 hover:border-white/20";

const paginationButtonClass =
    "inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:cursor-not-allowed disabled:opacity-40";

const withQuery = (pathname, params) => {
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
};

const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const visiblePages = new Set([
        1,
        totalPages,
        currentPage - 1,
        currentPage,
        currentPage + 1,
    ]);

    const sortedPages = [...visiblePages]
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b);

    return sortedPages.flatMap((page, index) => {
        const previousPage = sortedPages[index - 1];
        const isGap = index > 0 && page - previousPage > 1;

        return isGap ? [`ellipsis-${page}`, page] : [page];
    });
};

export default function JobSearchFilter({ initialJobs = [] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL is the source of truth for shareable filter state.
    const searchQuery = searchParams.get("search") || "";
    const selectedCategory = searchParams.get("category") || "all";
    const selectedType = searchParams.get("type") || "all";

    // Local state keeps typing instant while the URL updates after a short pause.
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [syncedSearchQuery, setSyncedSearchQuery] = useState(searchQuery);

    // Adjust local input when navigation (back/forward) changes the URL.
    if (searchQuery !== syncedSearchQuery) {
        setSyncedSearchQuery(searchQuery);
        setSearchInput(searchQuery);
    }

    useEffect(() => {
        if (searchInput === searchQuery) return;

        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (searchInput.trim()) {
                params.set("search", searchInput);
            } else {
                params.delete("search");
            }

            // Any filter change starts from the first page
            params.delete("page");

            router.replace(withQuery(pathname, params), {
                scroll: false,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchInput, searchQuery, searchParams, pathname, router]);

    // Current page comes from the URL so pages are shareable and back/forward works
    const requestedPageParam = Number.parseInt(
        searchParams.get("page") ?? "1",
        10
    );
    const requestedPage = Number.isNaN(requestedPageParam)
        ? 1
        : requestedPageParam;

    // Extract unique categories and types dynamically from current jobs list
    const categories = [
        "all",
        ...new Set(initialJobs.map((job) => job.category).filter(Boolean)),
    ];
    const types = [
        "all",
        ...new Set(initialJobs.map((job) => job.type).filter(Boolean)),
    ];

    // Helper function to update URL search parameters
    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete("page");

        router.replace(withQuery(pathname, params), { scroll: false });
    };

    const clearSearch = () => {
        setSearchInput("");
        updateFilter("search", "");
    };

    const resetFilters = () => {
        setSearchInput("");
        router.replace(pathname, { scroll: false });
    };

    // Combined filtering logic: search query AND category AND type
    const filteredJobs = initialJobs.filter((job) => {
        const query = searchInput.toLowerCase().trim();

        const matchesSearch =
            !query ||
            (job.title && job.title.toLowerCase().includes(query)) ||
            (job.companyName &&
                job.companyName.toLowerCase().includes(query)) ||
            (job.location && job.location.toLowerCase().includes(query));

        const matchesCategory =
            selectedCategory === "all" || job.category === selectedCategory;

        const matchesType =
            selectedType === "all" || job.type === selectedType;

        return matchesSearch && matchesCategory && matchesType;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
    );
    const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const visibleJobs = filteredJobs.slice(
        startIndex,
        startIndex + JOBS_PER_PAGE
    );
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    const hasActiveFilters = Boolean(
        searchInput.trim() ||
            selectedCategory !== "all" ||
            selectedType !== "all"
    );

    const goToPage = (page) => {
        const targetPage = Math.min(Math.max(page, 1), totalPages);
        const params = new URLSearchParams(searchParams.toString());

        if (targetPage === 1) {
            params.delete("page");
        } else {
            params.set("page", String(targetPage));
        }

        router.replace(withQuery(pathname, params), { scroll: false });

        document.getElementById("job-results")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="w-full space-y-7">
            {/* Filter & search bar */}
            <SurfaceCard className="grid grid-cols-1 items-end gap-4 p-4 md:grid-cols-3 md:p-6">
                <TextField className="w-full">
                    <Label className="mb-1.5 block text-xs font-medium text-zinc-300">
                        Search jobs
                    </Label>
                    <InputGroup className={`${filterControlClass} flex items-center gap-2`}>
                        <InputGroup.Prefix>
                            <Magnifier size={16} className="text-zinc-500" />
                        </InputGroup.Prefix>
                        <InputGroup.Input
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(event.target.value)
                            }
                            placeholder="Search by title, company, or city..."
                            className="w-full bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-600"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="rounded-md p-0.5 text-zinc-500 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                                aria-label="Clear search"
                            >
                                <Xmark size={14} />
                            </button>
                        )}
                    </InputGroup>
                </TextField>

                <Select
                    selectedKey={selectedCategory}
                    onSelectionChange={(key) =>
                        updateFilter("category", key || "all")
                    }
                    className="w-full"
                >
                    <Label className="mb-1.5 block text-xs font-medium text-zinc-300">
                        Category
                    </Label>
                    <Select.Trigger className={`${filterControlClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="z-50 min-w-[200px] rounded-xl border border-white/10 bg-[#141416] p-1 shadow-2xl">
                        <ListBox>
                            <ListBox.Item
                                id="all"
                                textValue="All Categories"
                                className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06]"
                            >
                                <Label>All categories</Label>
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                            {categories
                                .filter((category) => category !== "all")
                                .map((category) => (
                                    <ListBox.Item
                                        key={category}
                                        id={category}
                                        textValue={category}
                                        className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06]"
                                    >
                                        <Label>{category}</Label>
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <Select
                    selectedKey={selectedType}
                    onSelectionChange={(key) =>
                        updateFilter("type", key || "all")
                    }
                    className="w-full"
                >
                    <Label className="mb-1.5 block text-xs font-medium text-zinc-300">
                        Job type
                    </Label>
                    <Select.Trigger className={`${filterControlClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="z-50 min-w-[200px] rounded-xl border border-white/10 bg-[#141416] p-1 shadow-2xl">
                        <ListBox>
                            <ListBox.Item
                                id="all"
                                textValue="All Types"
                                className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06]"
                            >
                                <Label>All types</Label>
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                            {types
                                .filter((type) => type !== "all")
                                .map((type) => (
                                    <ListBox.Item
                                        key={type}
                                        id={type}
                                        textValue={type}
                                        className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06]"
                                    >
                                        <Label>{type}</Label>
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                        </ListBox>
                    </Select.Popover>
                </Select>
            </SurfaceCard>

            {/* Results */}
            <div id="job-results" className="scroll-mt-24 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                    <p>
                        {filteredJobs.length > 0 ? (
                            <>
                                Showing{" "}
                                <span className="font-medium text-white">
                                    {startIndex + 1}–
                                    {Math.min(
                                        startIndex + JOBS_PER_PAGE,
                                        filteredJobs.length
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-white">
                                    {filteredJobs.length}
                                </span>{" "}
                                roles
                            </>
                        ) : (
                            <>
                                Showing{" "}
                                <span className="font-medium text-white">0</span>{" "}
                                roles
                            </>
                        )}
                    </p>

                    <div className="flex items-center gap-4">
                        {totalPages > 1 && (
                            <span>
                                Page{" "}
                                <span className="font-medium text-white">
                                    {currentPage}
                                </span>{" "}
                                of {totalPages}
                            </span>
                        )}

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="font-medium text-indigo-300 transition-colors hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                </div>

                {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {visibleJobs.map((job) => (
                            <JobCard key={job._id || job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Magnifier}
                        title="No roles match your filters"
                        description="Try a broader search, or clear the category and job type filters to see more roles."
                        action={
                            <button
                                type="button"
                                onClick={resetFilters}
                                className={buttonStyles.secondary}
                            >
                                Reset filters
                            </button>
                        }
                    />
                )}

                {totalPages > 1 && (
                    <nav
                        aria-label="Job results pagination"
                        className="flex flex-wrap items-center justify-center gap-2 border-t border-white/[0.06] pt-6"
                    >
                        <button
                            type="button"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                            className={paginationButtonClass}
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </button>

                        {pageNumbers.map((page) =>
                            typeof page === "number" ? (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => goToPage(page)}
                                    aria-label={`Go to page ${page}`}
                                    aria-current={
                                        page === currentPage ? "page" : undefined
                                    }
                                    className={`h-9 min-w-9 rounded-xl border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ${
                                        page === currentPage
                                            ? "border-white bg-white text-zinc-950"
                                            : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]"
                                    }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span
                                    key={page}
                                    aria-hidden="true"
                                    className="px-1 text-xs text-zinc-600"
                                >
                                    …
                                </span>
                            )
                        )}

                        <button
                            type="button"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                            className={paginationButtonClass}
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </nav>
                )}
            </div>
        </div>
    );
}
