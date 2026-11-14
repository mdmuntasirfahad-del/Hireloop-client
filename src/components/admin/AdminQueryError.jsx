import Link from "next/link";
import { TriangleExclamation } from "@gravity-ui/icons";
import EmptyState from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function AdminQueryError({
    title = "Could not load this data",
    description = "The admin data service is temporarily unavailable. Try again in a moment.",
    retryHref,
}) {
    return (
        <EmptyState
            icon={TriangleExclamation}
            title={title}
            description={description}
            action={
                retryHref ? (
                    <Link href={retryHref} className={buttonStyles.secondary}>
                        Try again
                    </Link>
                ) : null
            }
        />
    );
}
