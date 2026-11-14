import SurfaceCard from "@/components/ui/SurfaceCard";

const accentClasses = {
    indigo: "bg-indigo-400/80",
    emerald: "bg-emerald-400/80",
    amber: "bg-amber-400/80",
    fuchsia: "bg-fuchsia-400/80",
};

export default function AdminBreakdownList({
    title,
    description,
    data = [],
    accent = "indigo",
    emptyLabel = "No data yet.",
}) {
    const maxValue = Math.max(1, ...data.map((item) => item.value));

    return (
        <SurfaceCard className="p-5">
            <div>
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                {description && (
                    <p className="mt-0.5 text-xs text-zinc-500">
                        {description}
                    </p>
                )}
            </div>

            {data.length > 0 ? (
                <ul className="mt-5 space-y-4">
                    {data.map((item) => (
                        <li key={item.label}>
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="min-w-0 truncate text-zinc-300">
                                    {item.label}
                                </span>
                                <span className="shrink-0 text-zinc-500">
                                    {item.value}
                                </span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                                <div
                                    className={`h-full rounded-full ${
                                        accentClasses[accent] ||
                                        accentClasses.indigo
                                    }`}
                                    style={{
                                        width: `${Math.max(
                                            item.value > 0 ? 4 : 0,
                                            (item.value / maxValue) * 100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-6 text-sm text-zinc-500">{emptyLabel}</p>
            )}
        </SurfaceCard>
    );
}
