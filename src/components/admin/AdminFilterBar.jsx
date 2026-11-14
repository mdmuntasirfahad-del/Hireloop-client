import Link from "next/link";
import { Magnifier } from "@gravity-ui/icons";
import { buttonStyles } from "@/components/ui/buttonStyles";

const controlClass =
    "h-10 w-full rounded-xl border border-white/10 bg-[#0f0f11] px-3 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20";

export default function AdminFilterBar({
    basePath,
    query = "",
    queryPlaceholder = "Search…",
    filters = [],
}) {
    const hasFilters =
        Boolean(query) || filters.some((filter) => filter.value);

    return (
        <form
            action={basePath}
            method="get"
            className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-surface-raised p-4 lg:flex-row lg:items-center"
        >
            <input type="hidden" name="page" value="1" />

            <div className="relative min-w-0 flex-1">
                <Magnifier
                    size={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder={queryPlaceholder}
                    aria-label="Search"
                    className={`${controlClass} pl-9`}
                />
            </div>

            {filters.map((filter) => (
                <label key={filter.name} className="lg:w-44">
                    <span className="sr-only">{filter.label}</span>
                    <select
                        name={filter.name}
                        defaultValue={filter.value || ""}
                        className={controlClass}
                    >
                        {filter.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            ))}

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    className={`${buttonStyles.secondary} h-10 !px-4 !py-0 !text-xs`}
                >
                    Apply
                </button>

                {hasFilters && (
                    <Link
                        href={basePath}
                        className={`${buttonStyles.ghost} h-10 !px-3 !py-0 !text-xs`}
                    >
                        Reset
                    </Link>
                )}
            </div>
        </form>
    );
}
