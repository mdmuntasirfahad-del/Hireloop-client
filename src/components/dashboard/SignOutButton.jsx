"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, toast } from "@heroui/react";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);

        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/auth/signin");
                        router.refresh();
                    },
                    onError: () => {
                        toast.error("Failed to sign out. Please try again.");
                    },
                },
            });
        } catch (err) {
            console.error("Sign out failed:", err);
            toast.error("Failed to sign out. Please try again.");
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <Button
            variant="danger"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
            onPress={handleSignOut}
            isDisabled={isSigningOut}
        >
            <ArrowRightFromSquare size={16} />
            {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
    );
}
