"use client";

import { useState } from "react";
import {
    AvatarFallback,
    AvatarImage,
    AvatarRoot,
    Button,
    Modal,
    toast,
} from "@heroui/react";
import { CircleCheck, Envelope, Xmark } from "@gravity-ui/icons";
import {
    updateProfileDetails,
    updateProfilePhoto,
} from "@/lib/action/profile";
import { uploadImageToImgbb } from "@/lib/upload/imgbb";

const modalCopy = {
    photo: {
        heading: "Change Profile Photo",
        description: "Upload a new photo for your HireLoop profile.",
        submit: "Save photo",
    },
    details: {
        heading: "Edit Profile Details",
        description: "Update the name and phone number on your account.",
        submit: "Save changes",
    },
};

export default function EditProfileModal({
    isOpen,
    onOpenChange,
    mode = "photo",
    user = {},
    onSuccess,
}) {
    const activeMode = modalCopy[mode] ? mode : "photo";
    const copy = modalCopy[activeMode];
    const isPhotoMode = activeMode === "photo";
    const initial = user?.name?.charAt(0)?.toUpperCase() || "R";

    const [previewUrl, setPreviewUrl] = useState(user?.image || "");
    const [fileName, setFileName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handlePhotoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        setFileName(file.name);

        try {
            const url = await uploadImageToImgbb(file);
            setPreviewUrl(url);
        } catch (err) {
            console.error("Profile photo upload error:", err);
            setError(err.message || "An error occurred during photo upload.");
            setFileName("");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving || uploading) return;

        setSaving(true);
        setError("");

        try {
            if (isPhotoMode) {
                const payload = await updateProfilePhoto({
                    image: previewUrl,
                });

                if (!payload?.ok) {
                    const message =
                        payload?.message ||
                        "Failed to update the profile photo.";

                    setError(message);
                    toast.error(message);
                    return;
                }

                toast.success(payload.message || "Profile photo updated.");

                if (onSuccess) {
                    onSuccess(payload.image);
                }

                return;
            }

            const formData = new FormData(event.currentTarget);

            const payload = await updateProfileDetails({
                name: formData.get("name"),
                phoneNumber: formData.get("phoneNumber"),
            });

            if (!payload?.ok) {
                const message =
                    payload?.message || "Failed to update your profile.";

                setError(message);
                toast.error(message);
                return;
            }

            toast.success(payload.message || "Profile details updated.");

            if (onSuccess) {
                onSuccess(payload);
            }
        } catch (err) {
            console.error("Profile update error:", err);

            const message = isPhotoMode
                ? "Failed to update the profile photo."
                : "Failed to update your profile.";

            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal>
            <Modal.Backdrop
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                variant="opaque"
                className="bg-black/70 backdrop-blur-[2px]"
            >
                <Modal.Container
                    size="lg"
                    placement="center"
                    scroll="inside"
                    className="px-4"
                >
                    <Modal.Dialog
                        aria-label={copy.heading}
                        className="
              w-full
              max-w-[566px]
              overflow-hidden
              rounded-xl
              border
              border-[#383838]
              bg-[#111111]
              p-0
              text-white
              shadow-2xl
            "
                    >
                        {({ close }) => (
                            <form onSubmit={handleSubmit}>
                                {/* ================= HEADER ================= */}
                                <div className="flex items-start justify-between border-b border-[#363636] bg-[#1a1a1a] px-6 py-6">
                                    <div>
                                        <Modal.Heading className="text-[19px] font-medium leading-none tracking-[-0.01em] text-white">
                                            {copy.heading}
                                        </Modal.Heading>

                                        <p className="mt-1.5 text-[11px] text-[#929292]">
                                            {copy.description}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={close}
                                        aria-label="Close"
                                        className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md text-[#a5a5a5] transition hover:bg-white/5 hover:text-white"
                                    >
                                        <Xmark size={18} />
                                    </button>
                                </div>

                                {/* ================= BODY ================= */}
                                <Modal.Body className="p-0">
                                    {isPhotoMode ? (
                                        <div className="flex flex-col items-center gap-5 px-6 py-9">
                                            <label className="flex cursor-pointer flex-col items-center gap-4 text-center">
                                                <AvatarRoot className="h-24 w-24 overflow-hidden rounded-2xl border border-dashed border-[#555] bg-[#292929] text-[#aaa] transition hover:border-[#777] hover:bg-[#303030]">
                                                    {previewUrl ? (
                                                        <AvatarImage
                                                            src={previewUrl}
                                                            alt="Profile photo preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : null}

                                                    <AvatarFallback className="text-2xl font-bold text-[#aaa]">
                                                        {uploading ? (
                                                            <span className="animate-pulse text-[11px]">
                                                                ...
                                                            </span>
                                                        ) : (
                                                            initial
                                                        )}
                                                    </AvatarFallback>
                                                </AvatarRoot>

                                                <div>
                                                    <p className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-white">
                                                        {uploading
                                                            ? "Uploading to ImgBB..."
                                                            : previewUrl
                                                              ? "Replace photo"
                                                              : "Upload photo"}
                                                        {previewUrl &&
                                                            !uploading && (
                                                                <CircleCheck
                                                                    size={14}
                                                                    className="text-emerald-400"
                                                                />
                                                            )}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-[#777]">
                                                        {fileName ||
                                                            "PNG, JPG up to 5MB"}
                                                    </p>
                                                </div>

                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg"
                                                    onChange={handlePhotoUpload}
                                                    className="hidden"
                                                />
                                            </label>

                                            {error && (
                                                <p className="text-[11px] text-red-400">
                                                    {error}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-7 px-6 py-7">
                                            <FormField label="Full name">
                                                <input
                                                    name="name"
                                                    type="text"
                                                    required
                                                    minLength={2}
                                                    maxLength={80}
                                                    defaultValue={
                                                        user?.name || ""
                                                    }
                                                    placeholder="e.g. Alex Morgan"
                                                    className="form-input w-full rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 text-[12px] text-white outline-none placeholder:text-[#6c6c6c] focus:border-[#505050]"
                                                />
                                            </FormField>

                                            <FormField label="Phone number">
                                                <div className="relative">
                                                    <input
                                                        name="phoneNumber"
                                                        type="tel"
                                                        maxLength={30}
                                                        defaultValue={
                                                            user?.phoneNumber ||
                                                            ""
                                                        }
                                                        placeholder="+1 555 000 0000"
                                                        className="form-input w-full rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 text-[12px] text-white outline-none placeholder:text-[#6c6c6c] focus:border-[#505050]"
                                                    />
                                                </div>
                                            </FormField>

                                            <FormField label="Email address">
                                                <div className="relative">
                                                    <Envelope
                                                        size={15}
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c6c6c]"
                                                    />
                                                    <input
                                                        type="email"
                                                        value={user?.email || ""}
                                                        readOnly
                                                        aria-readonly="true"
                                                        className="w-full cursor-not-allowed rounded-md border border-[#2d2d2d] bg-[#1a1a1a] py-2.5 pl-9 pr-3.5 text-[12px] text-[#8a8a8a] outline-none"
                                                    />
                                                </div>

                                                <p className="mt-1.5 text-[10px] text-[#777]">
                                                    Email is managed by your
                                                    sign-in account and cannot be
                                                    changed here.
                                                </p>
                                            </FormField>

                                            {error && (
                                                <p className="text-[11px] text-red-400">
                                                    {error}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </Modal.Body>

                                {/* ================= FOOTER ================= */}
                                <Modal.Footer className="flex justify-end gap-4 border-t border-[#363636] bg-[#1a1a1a] px-6 py-6">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onPress={close}
                                        className="h-10 min-w-[92px] rounded-md border border-[#303030] bg-transparent text-[12px] text-white hover:bg-[#252525]"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={uploading || saving}
                                        variant="primary"
                                        className="h-10 min-w-[164px] rounded-md bg-white px-6 text-[12px] font-semibold text-black hover:bg-[#e8e8e8] disabled:opacity-50"
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : saving
                                              ? "Saving..."
                                              : copy.submit}
                                    </Button>
                                </Modal.Footer>
                            </form>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

/* =========================================
   Reusable Form Field
========================================= */

function FormField({ label, children }) {
    return (
        <div>
            <label className="mb-2 block text-[12px] font-medium text-[#e2e2e2]">
                {label}
            </label>

            {children}
        </div>
    );
}
