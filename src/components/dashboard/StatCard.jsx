import SurfaceCard from "@/components/ui/SurfaceCard";

/**
 * Single stat card used across dashboard overview pages.
 */
export function StatCard({ title, value, icon: Icon, hint }) {
    return (
        <SurfaceCard className="p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-500">
                        {title}
                    </p>

                    <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-white">
                        {value}
                    </p>
                </div>

                {Icon && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                        <Icon size={18} aria-hidden="true" />
                    </span>
                )}
            </div>

            {hint && (
                <p className="mt-3 border-t border-white/[0.06] pt-3 text-[11px] leading-relaxed text-zinc-500">
                    {hint}
                </p>
            )}
        </SurfaceCard>
    );
}
