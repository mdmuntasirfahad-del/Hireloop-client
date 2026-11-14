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
import { createCompany } from "@/lib/action/companies";
import { useSession } from "@/lib/auth-client";

export default function RegisterCompanyModal({ isOpen, onOpenChange, onSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");
    const [logoFileName, setLogoFileName] = useState("");
    const [error, setError] = useState("");
    const {data:session} = useSession();

    const userId = session?.user?.id;

    // Handle ImgBB Logo Upload
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (up to 5MB as per label)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            return;
        }

        setUploading(true);
        setError("");
        setLogoFileName(file.name);

        try {
            const formData = new FormData();
            formData.append("image", file);

            // Replace with your actual ImgBB API Key or your server route handling ImgBB
            // NOTE: For production security, route this through your Next.js API route (/api/upload-logo)
            // to hide your ImgBB API key from the client bundle.
            const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setLogoUrl(data.data.url); // ImgBB hosted public URL
            } else {
                setError("Failed to upload image to ImgBB.");
                setLogoFileName("");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("An error occurred during logo upload.");
            setLogoFileName("");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        if (payload.insertedId){
            toast.success("Company profile created successfully!")
        }

        // Pass data back to parent component (e.g. PostJobPage)
        if (onSuccess) {
            onSuccess(companyData);
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
                        aria-label="Register new company"
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
                                            Register New Company
                                        </Modal.Heading>

                                        <p className="mt-1.5 text-[11px] text-[#929292]">
                                            Enter your business details to start hiring on HireLoop.
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
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-7 px-6 py-7 md:grid-cols-2">

                                        {/* Company Name */}
                                        <FormField label="Company Name">
                                            <input
                                                name="companyName"
                                                type="text"
                                                required
                                                placeholder="e.g. Acme Corp"
                                                className="form-input w-full rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 text-[12px] text-white outline-none placeholder:text-[#6c6c6c] focus:border-[#505050]"
                                            />
                                        </FormField>

                                        {/* Industry */}
                                        <FormField label="Industry / Category">
                                            <div className="relative">
                                                <select
                                                    name="industry"
                                                    defaultValue="Technology"
                                                    className="form-input w-full appearance-none rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 pr-10 text-[12px] text-white outline-none focus:border-[#505050]"
                                                >
                                                    <option value="Technology">Technology</option>
                                                    <option value="Finance">Finance</option>
                                                    <option value="Healthcare">Healthcare</option>
                                                    <option value="Education">Education</option>
                                                    <option value="Retail">Retail</option>
                                                    <option value="Manufacturing">Manufacturing</option>
                                                    <option value="Other">Other</option>
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
                                                    defaultValue="1-10"
                                                    className="form-input w-full appearance-none rounded-md border border-[#2d2d2d] bg-[#202020] px-3.5 py-2.5 pr-10 text-[12px] text-white outline-none focus:border-[#505050]"
                                                >
                                                    <option value="1-10">1-10 employees</option>
                                                    <option value="11-50">11-50 employees</option>
                                                    <option value="51-200">51-200 employees</option>
                                                    <option value="201-500">201-500 employees</option>
                                                    <option value="501-1000">501-1000 employees</option>
                                                    <option value="1000+">1000+ employees</option>
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
                                        <FormField label="Company Logo">
                                            <label
                                                className="
                          flex
                          cursor-pointer
                          items-center
                          gap-4
                        "
                                            >
                                                <div
                                                    className="
                            flex
                            h-[50px]
                            w-[50px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            border
                            border-dashed
                            border-[#555]
                            bg-[#292929]
                            text-[#aaa]
                            transition
                            hover:border-[#777]
                            hover:bg-[#303030]
                            overflow-hidden
                          "
                                                >
                                                    {logoUrl ? (
                                                        <img src={logoUrl} alt="Logo preview" className="h-full w-full object-cover" />
                                                    ) : uploading ? (
                                                        <div className="text-[9px] text-zinc-400 animate-pulse">...</div>
                                                    ) : (
                                                        <ArrowUpFromLine size={18} />
                                                    )}
                                                </div>

                                                <div className="flex-1 truncate">
                                                    <p className="text-[11px] font-medium text-white flex items-center gap-1.5">
                                                        {uploading ? "Uploading to ImgBB..." : logoFileName ? "Logo Uploaded" : "Upload image"}
                                                        {logoUrl && <CircleCheck size={14} className="text-emerald-400" />}
                                                    </p>

                                                    <p className="mt-0.5 text-[9px] text-[#777] truncate">
                                                        {logoFileName || "PNG, JPG up to 5MB"}
                                                    </p>
                                                </div>

                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                            {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
                                        </FormField>

                                        {/* Description */}
                                        <FormField
                                            label="Brief Description"
                                            className="md:col-span-2"
                                        >
                                            <textarea
                                                name="description"
                                                rows={4}
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
                                        disabled={uploading}
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
                                        {uploading ? "Uploading Logo..." : "Register Company"}
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