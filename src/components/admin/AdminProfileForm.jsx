"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "@heroui/react";
import { updateAdminProfile } from "@/lib/action/admin";
import { buttonStyles } from "@/components/ui/buttonStyles";

const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-[#0f0f11] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20";

export default function AdminProfileForm({ name = "", phoneNumber = "" }) {
    const [state, formAction, pending] = useActionState(
        updateAdminProfile,
        null
    );
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

    return (
        <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                    <span className="text-xs font-medium text-zinc-400">
                        Full name
                    </span>
                    <input
                        type="text"
                        name="name"
                        defaultValue={name}
                        required
                        minLength={2}
                        maxLength={80}
                        autoComplete="name"
                        className={inputClass}
                    />
                </label>

                <label className="block">
                    <span className="text-xs font-medium text-zinc-400">
                        Phone number
                    </span>
                    <input
                        type="tel"
                        name="phoneNumber"
                        defaultValue={phoneNumber}
                        maxLength={30}
                        autoComplete="tel"
                        className={inputClass}
                    />
                </label>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className={`${buttonStyles.primary} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    {pending ? "Saving…" : "Save profile"}
                </button>

                <p className="text-[11px] text-zinc-500">
                    Your email address is managed through your sign-in account.
                </p>
            </div>
        </form>
    );
}
