export default function SurfaceCard({
    as: Component = "div",
    className = "",
    children,
    ...props
}) {
    return (
        <Component
            className={`rounded-2xl border border-white/[0.08] bg-surface-raised ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
