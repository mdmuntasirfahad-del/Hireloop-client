"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "@heroui/react";

const variantClasses = {
    primary:
        "border-indigo-500/30 bg-indigo-500/15 text-indigo-200 hover:bg-indigo-500/25",
    secondary:
        "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]",
    success:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
    danger:
        "border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20",
};

const selectClass =
    "h-8 rounded-lg border border-white/10 bg-[#0f0f11] px-2.5 text-[11px] text-zinc-200 outline-none transition-colors focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20";

export default function AdminActionForm({
    action,
    fields = {},
    select = null,
    submitLabel = "Update",
    pendingLabel = "Updating…",
    confirmMessage = "",
    variant = "secondary",
    className = "",
}) {
    const [state, formAction, pending] = useActionState(action, null);
    const lastMessage = useRef("");

    useEffect(() => {
        if (!state?.message || state.message === lastMessage.current) return;

        lastMessage.current = state.message;

        if (state.ok) {
            toast.success(state.message);
        } else {
            toast.error(state.message);
        }
    }, [state]);

    const handleSubmit = (event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
            event.preventDefault();
        }
    };

    return (
        <form
            action={formAction}
            onSubmit={handleSubmit}
            className={`flex flex-wrap items-center gap-2 ${className}`}
        >
            {Object.entries(fields).map(([name, value]) => (
                <input
                    key={name}
                    type="hidden"
                    name={name}
                    value={value ?? ""}
                />
            ))}

            {select && (
                <select
                    name={select.name}
                    defaultValue={select.defaultValue}
                    aria-label={select.label || "New value"}
                    className={selectClass}
                >
                    {select.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}

            <button
                type="submit"
                disabled={pending}
                className={`inline-flex h-8 items-center justify-center rounded-lg border px-2.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:cursor-not-allowed disabled:opacity-50 ${
                    variantClasses[variant] || variantClasses.secondary
                }`}
            >
                {pending ? pendingLabel : submitLabel}
            </button>
        </form>
    );
}
