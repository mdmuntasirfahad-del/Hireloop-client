export default function PageHeader({
    eyebrow,
    title,
    description,
    actions,
    align = "left",
    className = "",
}) {
    const isCentered = align === "center";

    return (
        <div className={`border-b border-white/[0.06] pb-6 ${className}`}>
            <div
                className={
                    isCentered
                        ? "flex flex-col items-center text-center"
                        : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                }
            >
                <div className="min-w-0">
                    {eyebrow && (
                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-300">
                            {eyebrow}
                        </p>
                    )}

                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {title}
                    </h1>

                    {description && (
                        <p
                            className={`mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 ${
                                isCentered ? "mx-auto" : ""
                            }`}
                        >
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div
                        className={
                            isCentered
                                ? "mt-5 flex shrink-0 items-center justify-center gap-3"
                                : "flex shrink-0 items-center gap-3"
                        }
                    >
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
