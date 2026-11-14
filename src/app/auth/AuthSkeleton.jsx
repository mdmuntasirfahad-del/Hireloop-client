export default function AuthSkeleton() {
    return (
        <div className="w-full animate-pulse rounded-2xl border border-white/[0.08] bg-surface-raised p-6 sm:p-8">
            <div className="mx-auto h-3 w-24 rounded bg-white/10" />
            <div className="mx-auto mt-3 h-7 w-52 rounded bg-white/10" />
            <div className="mx-auto mt-3 h-4 w-64 rounded bg-white/[0.06]" />

            <div className="mt-8 space-y-4">
                <div className="h-12 rounded-xl bg-white/[0.06]" />
                <div className="h-12 rounded-xl bg-white/[0.06]" />
                <div className="h-11 rounded-xl bg-white/10" />
            </div>

            <div className="mt-6 h-px bg-white/[0.06]" />
            <div className="mx-auto mt-5 h-4 w-44 rounded bg-white/[0.06]" />
        </div>
    );
}
