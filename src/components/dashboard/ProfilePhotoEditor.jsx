"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AvatarFallback,
    AvatarImage,
    AvatarRoot,
} from "@heroui/react";
import { Pencil } from "@gravity-ui/icons";
import EditProfileModal from "./EditProfileModal";

export default function ProfilePhotoEditor({ image = "", name = "" }) {
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState(image);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0);

    const openModal = () => {
        // Remount the modal so an unsaved preview never leaks across opens.
        setModalKey((value) => value + 1);
        setIsModalOpen(true);
    };

    const handleSuccess = (nextImage) => {
        setAvatarUrl(nextImage || "");
        setIsModalOpen(false);
        router.refresh();
    };

    return (
        <div className="relative shrink-0">
            <AvatarRoot
                size="lg"
                className="h-16 w-16 rounded-2xl border border-white/10 bg-white/[0.04]"
            >
                <AvatarImage
                    src={avatarUrl || "/images/profile.jpg"}
                    alt={name || "Recruiter"}
                />
                <AvatarFallback className="text-xl font-bold">
                    {name?.charAt(0)?.toUpperCase() || "R"}
                </AvatarFallback>
            </AvatarRoot>

            <button
                type="button"
                onClick={openModal}
                aria-label="Change profile photo"
                title="Change profile photo"
                className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#18181b] text-zinc-300 shadow-lg transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
                <Pencil size={12} aria-hidden="true" />
            </button>

            <EditProfileModal
                key={modalKey}
                mode="photo"
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                user={{ image: avatarUrl, name }}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
