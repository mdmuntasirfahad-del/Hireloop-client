import SurfaceCard from "@/components/ui/SurfaceCard";

const accentClasses = {
    indigo: "bg-indigo-400/80",
    emerald: "bg-emerald-400/80",
    amber: "bg-amber-400/80",
};

export default function AdminTrendChart({
    title,
    description,
    data = [],
    accent = "indigo",
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

            <div
                className="mt-5 grid items-end gap-2"
                style={{
                    gridTemplateColumns: `repeat(${Math.max(
                        data.length,
                        1
                    )}, minmax(0, 1fr))`,
                }}
            >
                {data.map((item) => (
                    <div
                        key={item.label}
                        className="flex min-w-0 flex-col items-center gap-2"
                    >
                        <span className="text-[10px] font-medium text-zinc-300">
                            {item.value}
                        </span>

                        <div className="flex h-28 w-full items-end rounded-md bg-white/[0.03]">
                            <div
                                className={`w-full rounded-md ${
                                    accentClasses[accent] || accentClasses.indigo
                                }`}
                                style={{
                                    height: `${Math.max(
                                        item.value > 0 ? 6 : 1,
                                        (item.value / maxValue) * 100
                                    )}%`,
                                }}
                                title={`${item.label}: ${item.value}`}
                            />
                        </div>

                        <span className="w-full truncate text-center text-[9px] text-zinc-500">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </SurfaceCard>
    );
}
