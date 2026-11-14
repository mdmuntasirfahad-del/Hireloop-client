import Link from "next/link";
import { ArrowChevronLeft, ArrowChevronRight } from "@gravity-ui/icons";

const buildHref = (basePath, filters, page) => {
    const params = new URLSearchParams();

    Object.entries(filters || {}).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
    });

    if (page > 1) {
        params.set("page", String(page));
    }

    const query = params.toString();

    return query ? `${basePath}?${query}` : basePath;
};

const visiblePages = (page, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);

    return [...pages]
        .filter((value) => value >= 1 && value <= totalPages)
        .sort((a, b) => a - b);
};

const controlClass =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:pointer-events-none disabled:opacity-40";

export default function AdminPagination({
    basePath,
    page,
    totalPages,
    filters = {},
}) {
    if (totalPages <= 1) return null;

    const pages = visiblePages(page, totalPages);

    return (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
                Page <span className="text-zinc-300">{page}</span> of{" "}
                <span className="text-zinc-300">{totalPages}</span>
            </p>

            <nav
                aria-label="Admin pagination"
                className="flex flex-wrap items-center gap-1.5"
            >
                {page > 1 ? (
                    <Link
                        href={buildHref(basePath, filters, page - 1)}
                        aria-label="Previous page"
                        className={controlClass}
                    >
                        <ArrowChevronLeft size={14} aria-hidden="true" />
                    </Link>
                ) : (
                    <span
                        aria-hidden="true"
                        className={`${controlClass} opacity-40`}
                    >
                        <ArrowChevronLeft size={14} />
                    </span>
                )}

                {pages.map((value, index) => {
                    const previous = pages[index - 1];
                    const showGap = previous && value - previous > 1;

                    return (
                        <span key={value} className="contents">
                            {showGap && (
                                <span className="px-1 text-xs text-zinc-600">
                                    …
                                </span>
                            )}

                            <Link
                                href={buildHref(basePath, filters, value)}
                                aria-current={value === page ? "page" : undefined}
                                className={`${controlClass} ${
                                    value === page
                                        ? "border-indigo-400/40 bg-indigo-500/15 text-white"
                                        : ""
                                }`}
                            >
                                {value}
                            </Link>
                        </span>
                    );
                })}

                {page < totalPages ? (
                    <Link
                        href={buildHref(basePath, filters, page + 1)}
                        aria-label="Next page"
                        className={controlClass}
                    >
                        <ArrowChevronRight size={14} aria-hidden="true" />
                    </Link>
                ) : (
                    <span
                        aria-hidden="true"
                        className={`${controlClass} opacity-40`}
                    >
                        <ArrowChevronRight size={14} />
                    </span>
                )}
            </nav>
        </div>
    );
}
