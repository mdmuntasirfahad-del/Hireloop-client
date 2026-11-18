"use client";

import React, { useState } from "react";
import { Modal, Button, toast } from "@heroui/react";
import {
    Xmark,
    LocationArrow,
    ArrowUpFromLine,
    ChevronDown,
    CircleCheck,
} from "@gravity-ui/icons";
import { createCompany, updateCompany } from "@/lib/action/companies";
import { useSession } from "@/lib/auth-client";
import { uploadImageToImgbb } from "@/lib/upload/imgbb";

const modalCopy = {
    create: {
        heading: "Register New Company",
        description:
            "Enter your business details to start hiring on HireLoop.",
        submit: "Register Company",
    },
    details: {
        heading: "Edit Company Details",
        description:
            "Update your company information. Changes are reviewed by the HireLoop team.",
        submit: "Save changes",
    },
    logo: {
        heading: "Change Company Logo",
        description:
            "Upload a new logo for your company profile and job posts.",
        submit: "Save logo",
    },
};

const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Other",
];

const employeeCountOptions = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
];

const stripProtocol = (value) =>
    String(value || "").replace(/^https?:\/\//i, "");

export default function RegisterCompanyModal({
    isOpen,
    onOpenChange,
    onSuccess,
    initialData = null,
    mode = "create",
}) {
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
    const [logoFileName, setLogoFileName] = useState("");
    const [error, setError] = useState("");
    const { data: session } = useSession();

    const userId = session?.user?.id;
    const activeMode = modalCopy[mode] ? mode : "create";
    const copy = modalCopy[activeMode];
    const isLogoMode = activeMode === "logo";
    const isDetailsMode = activeMode === "details";

    // Handle ImgBB Logo Upload
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        setLogoFileName(file.name);

        try {
            const url = await uploadImageToImgbb(file);
            setLogoUrl(url); // ImgBB hosted public URL
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message || "An error occurred during logo upload.");
            setLogoFileName("");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (activeMode === "create") {
            const formData = new FormData(e.currentTarget);

            const companyData = {
                companyName: formData.get("companyName"),
                industry: formData.get("industry"),
                website: formData.get("website"),
                location: formData.get("location"),
                employeeCount: formData.get("employeeCount"),
                logoUrl: logoUrl, // Saved ImgBB URL for database storage
                description: formData.get("description"),
                isApproved: false, // Pending state until reviewed by admin
                plan: "Free",     // Default starting plan (limit 3 active jobs)
                jobLimit: 3,
                recruiterId: userId
            };

            const payload = await createCompany(companyData)

            if (payload.insertedId) {
                toast.success("Company profile created successfully!")
            }

            // Pass data back to parent component (e.g. PostJobPage)
            if (onSuccess) {
                onSuccess(companyData);
            }

            return;
        }

        if (!initialData?._id) {
            toast.error("Company profile is missing.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            let updates;
            let successData;

            if (isLogoMode) {
                updates = {
                    companyId: initialData._id,
                    logoUrl,
                };

                successData = {
                    logoUrl,
                    isApproved: false,
                };
            } else {
                const formData = new FormData(e.currentTarget);

                const details = {
                    companyName: formData.get("companyName"),
                    industry: formData.get("industry"),
                    website: formData.get("website"),
                    location: formData.get("location"),
                    employeeCount: formData.get("employeeCount"),
                    description: formData.get("description"),
                };

                updates = {
                    companyId: initialData._id,
                    ...details,
                };

                successData = {
                    ...details,
                    isApproved: false,
                };
            }

            const payload = await updateCompany(updates);

            if (!payload?.ok) {
                const message =
                    payload?.message || "Failed to update the company profile.";

                setError(message);
                toast.error(message);
                return;
            }

            toast.success(payload.message || "Company profile updated.");

            if (onSuccess) {
                onSuccess(successData);
            }
        } catch (err) {
            console.error("Company update error:", err);
            toast.error("Failed to update the company profile.");
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
                                <div
                                    className="
                    flex
                    items-start
                    justify-between
                    border-b
                    border-[#363636]
                    bg-[#1a1a1a]
                    px-6
                    py-6
                  "
                                >
                                    <div>
                                        <Modal.Heading
                                            className="
                        text-[19px]
                        font-medium
                        leading-none
                        tracking-[-0.01em]
                        text-white
                      "
                                        >
                                            {copy.heading}
                                        </Modal.Heading>

                                        <p className="mt-1.5 text-[11px] text-[#929292]">
                                            {copy.description}
                                        </p>
                                    </div>

                                    {/* Close button */}
                                    <button
                                        type="button"
                                        onClick={close}
                                        aria-label="Close"
                                        className="
                      mt-0.5
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-md
                      text-[#a5a5a5]
                      transition
                      hover:bg-white/5
                      hover:text-white
                    "
                                    >
                                        <Xmark size={18} />
                                    </button>
                                </div>

                                {/* ================= BODY ================= */}
                                <Modal.Body className="p-0">
                                    {isLogoMode ? (
                                        <div className="flex flex-col items-center gap-5 px-6 py-9">
                                            <label className="flex cursor-pointer flex-col items-center gap-4 text-center">
                                                <LogoPreview
                                                    logoUrl={logoUrl}
                                                    uploading={uploading}
                                                    size={26}
                                                    className="
                            flex
                            h-24
                            w-24
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-2xl
                            border
                            border-dashed
                            border-[#555]
                            bg-[#292929]
                            text-[#aaa]
                            transition
                            hover:border-[#777]
                            hover:bg-[#303030]
                          "
                                                />

                                                <div>
                                                    <p className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-white">
                                                        {uploading
                                                            ? "Uploading to ImgBB..."
                                                            : logoUrl
                                                              ? "Replace logo"
                                                              : "Upload logo"}
                                                        {logoUrl && !uploading && (
                                                            <CircleCheck
                                                                size={14}
                                                                className="text-emerald-400"
                                                            />
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-[#777]">
                                                        {logoFileName ||
                                                            "PNG, JPG up to 5MB"}
                                                    </p>
                                                </div>

                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg"
                                                    onChange={handleLogoUpload}
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
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-7 px-6 py-7 md:grid-cols-2">
                                            {/* Company Name */}
                                            <FormField label="Company Name">
                                                <input
                                                    name="companyName"
                                                    type="text"
                                                    required
                                                    defaultValue={
                                                        initialData?.companyName ||
                                                        ""
                                                    }
                                                    placeholder="e.g. Acme Corp"
                                                    className="form-input w-full rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 text-[12px] text-white outline-none placeholder:text-[#6c6c6c] focus:border-[#505050]"
                                                />
                                            </FormField>

                                            {/* Industry */}
                                            <FormField label="Industry / Category">
                                                <div className="relative">
                                                    <select
                                                        name="industry"
                                                        defaultValue={
                                                            initialData?.industry ||
                                                            "Technology"
                                                        }
                                                        className="form-input w-full appearance-none rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 pr-10 text-[12px] text-white outline-none focus:border-[#505050]"
                                                    >
                                                        {industryOptions.map(
                                                            (option) => (
                                                                <option
                                                                    key={option}
                                                                    value={option}
                                                                >
                                                                    {option}
                                                                </option>
                                                            )
                                                        )}

                                                        {initialData?.industry &&
                                                            !industryOptions.includes(
                                                                initialData.industry
                                                            ) && (
                                                                <option
                                                                    value={
                                                                        initialData.industry
                                                                    }
                                                                >
                                                                    {
                                                                        initialData.industry
                                                                    }
                                                                </option>
                                                            )}
                                                    </select>

                                                    <ChevronDown
                                                        size={16}
                                                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#777]
                          "
                                                    />
                                                </div>
                                            </FormField>

                                            {/* Website */}
                                            <FormField label="Website URL">
                                                <div className="flex h-[38px] overflow-hidden rounded-md border border-[#2d2d2d] bg-[#202020]">
                                                    <div className="flex items-center bg-[#292929] px-4 text-[11px] text-[#9a9a9a]">
                                                        https://
                                                    </div>

                                                    <input
                                                        name="website"
                                                        type="text"
                                                        defaultValue={stripProtocol(
                                                            initialData?.website
                                                        )}
                                                        placeholder="www.company.com"
                                                        className="
                            min-w-0
                            flex-1
                            bg-transparent
                            px-4
                            text-[12px]
                            text-white
                            outline-none
                            placeholder:text-[#6c6c6c]
                          "
                                                    />
                                                </div>
                                            </FormField>

                                            {/* Location */}
                                            <FormField label="Location">
                                                <div className="relative">
                                                    <LocationArrow
                                                        size={18}
                                                        className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-[#9b9b9b]
                          "
                                                    />

                                                    <input
                                                        name="location"
                                                        type="text"
                                                        required
                                                        defaultValue={
                                                            initialData?.location ||
                                                            ""
                                                        }
                                                        placeholder="City, Country"
                                                        className="form-input w-full rounded-md border border-[#2d2d2d] bg-[#202020] py-2.5 pl-12 pr-3.5 text-[12px] text-white outline-none placeholder:text-[#6c6c6c] focus:border-[#505050]"
                                                    />
                                                </div>
                                            </FormField>

                                            {/* Employee Count */}
                                            <FormField label="Employee Count Range">
                                                <div className="relative">
                                                    <select
                                                        name="employeeCount"
                                                        defaultValue={
                                                            initialData?.employeeCount ||
                                                            "1-10"
                                                        }
                                                        className="form-input w-full appearance-none rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 pr-10 text-[12px] text-white outline-none focus:border-[#505050]"
                                                    >
                                                        {employeeCountOptions.map(
                                                            (option) => (
                                                                <option
                                                                    key={option}
                                                                    value={option}
                                                                >
                                                                    {option} employees
                                                                </option>
                                                            )
                                                        )}

                                                        {initialData?.employeeCount &&
                                                            !employeeCountOptions.includes(
                                                                initialData.employeeCount
                                                            ) && (
                                                                <option
                                                                    value={
                                                                        initialData.employeeCount
                                                                    }
                                                                >
                                                                    {
                                                                        initialData.employeeCount
                                                                    }{" "}
                                                                    employees
                                                                </option>
                                                            )}
                                                    </select>

                                                    <ChevronDown
                                                        size={16}
                                                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#777]
                          "
                                                    />
                                                </div>
                                            </FormField>

                                            {/* Company Logo with ImgBB upload integration */}
                                            {!isDetailsMode && (
                                                <FormField label="Company Logo">
                                                    <label
                                                        className="
                          flex
                          cursor-pointer
                          items-center
                          gap-4
                        "
                                                    >
                                                        <LogoPreview
                                                            logoUrl={logoUrl}
                                                            uploading={uploading}
                                                            className="
                            flex
                            h-[50px]
                            w-[50px]
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-md
                            border
                            border-dashed
                            border-[#555]
                            bg-[#292929]
                            text-[#aaa]
                            transition
                            hover:border-[#777]
                            hover:bg-[#303030]
                          "
                                                        />

                                                        <div className="flex-1 truncate">
                                                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-white">
                                                                {uploading
                                                                    ? "Uploading to ImgBB..."
                                                                    : logoUrl
                                                                      ? "Replace image"
                                                                      : "Upload image"}
                                                                {logoUrl && (
                                                                    <CircleCheck
                                                                        size={14}
                                                                        className="text-emerald-400"
                                                                    />
                                                                )}
                                                            </p>

                                                            <p className="mt-0.5 truncate text-[9px] text-[#777]">
                                                                {logoFileName ||
                                                                    "PNG, JPG up to 5MB"}
                                                            </p>
                                                        </div>

                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpeg,image/jpg"
                                                            onChange={
                                                                handleLogoUpload
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                    {error && (
                                                        <p className="mt-1 text-[10px] text-red-400">
                                                            {error}
                                                        </p>
                                                    )}
                                                </FormField>
                                            )}

                                            {/* Description */}
                                            <FormField
                                                label="Brief Description"
                                                className="md:col-span-2"
                                            >
                                                <textarea
                                                    name="description"
                                                    rows={4}
                                                    defaultValue={
                                                        initialData?.description ||
                                                        ""
                                                    }
                                                    placeholder="Tell us about your company's mission and culture..."
                                                    className="
                          min-h-[94px]
                          w-full
                          resize-none
                          rounded-md
                          border
                          border-[#2d2d2d]
                          bg-[#202020]
                          px-4
                          py-3
                          text-[12px]
                          text-white
                          outline-none
                          transition
                          placeholder:text-[#707070]
                          focus:border-[#505050]
                        "
                                                />
                                            </FormField>
                                        </div>
                                    )}
                                </Modal.Body>

                                {/* ================= FOOTER ================= */}
                                <Modal.Footer
                                    className="
                    flex
                    justify-end
                    gap-4
                    border-t
                    border-[#363636]
                    bg-[#1a1a1a]
                    px-6
                    py-6
                  "
                                >
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onPress={close}
                                        className="
                      h-10
                      min-w-[92px]
                      rounded-md
                      border
                      border-[#303030]
                      bg-transparent
                      text-[12px]
                      text-white
                      hover:bg-[#252525]
                    "
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={uploading || saving}
                                        variant="primary"
                                        className="
                      h-10
                      min-w-[164px]
                      rounded-md
                      bg-white
                      px-6
                      text-[12px]
                      font-semibold
                      text-black
                      hover:bg-[#e8e8e8]
                      disabled:opacity-50
                    "
                                    >
                                        {uploading
                                            ? "Uploading Logo..."
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
   Reusable Logo Preview
========================================= */

function LogoPreview({ logoUrl, uploading, className = "", size = 18 }) {
    return (
        <div className={className}>
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt="Company logo preview"
                    className="h-full w-full object-cover"
                />
            ) : uploading ? (
                <span className="animate-pulse text-[9px] text-zinc-400">
                    ...
                </span>
            ) : (
                <ArrowUpFromLine size={size} />
            )}
        </div>
    );
}

/* =========================================
   Reusable Form Field
========================================= */

function FormField({ label, children, className = "" }) {
    return (
        <div className={className}>
            <label className="mb-2 block text-[12px] font-medium text-[#e2e2e2]">
                {label}
            </label>

            {children}
        </div>
    );
}
