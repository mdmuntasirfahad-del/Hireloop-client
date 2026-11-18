"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "@gravity-ui/icons";
import EditProfileModal from "./EditProfileModal";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function ProfileDetailsEditor({ user }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0);

    const openModal = () => {
        setModalKey((value) => value + 1);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        router.refresh();
    };

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className={buttonStyles.secondary}
                aria-label="Edit profile details"
            >
                <Pencil size={14} aria-hidden="true" />
                Edit details
            </button>

            <EditProfileModal
                key={modalKey}
                mode="details"
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                user={{
                    name: user?.name || "",
                    email: user?.email || "",
                    phoneNumber: user?.phoneNumber || "",
                }}
                onSuccess={handleSuccess}
            />
        </>
    );
}
