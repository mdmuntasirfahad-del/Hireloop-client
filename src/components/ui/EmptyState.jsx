export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className = "",
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-surface-raised px-6 py-16 text-center ${className}`}
        >
            {Icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400">
                    <Icon size={22} aria-hidden="true" />
                </div>
            )}

            <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>

            {description && (
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-zinc-400">
                    {description}
                </p>
            )}

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
