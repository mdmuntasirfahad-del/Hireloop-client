import { getAdminExportRows } from "@/lib/admin/queries";
import { getAdminFromRequest } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

const exportTypes = new Set(["users", "jobs", "companies", "applications"]);

const csvCell = (value) => {
    const text = value === null || value === undefined ? "" : String(value);

    return `"${text.replace(/"/g, '""')}"`;
};

const toCsv = (headers, rows) =>
    [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");

export async function GET(request) {
    const admin = await getAdminFromRequest(request);

    if (!admin) {
        return new Response("Unauthorized", {
            status: 401,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    const range = Number.parseInt(searchParams.get("range") || "0", 10);
    const days = [7, 30, 90].includes(range) ? range : 0;

    if (!exportTypes.has(type)) {
        return new Response("Unknown export type", {
            status: 400,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    }

    const data = await getAdminExportRows(type, days);

    if (!data) {
        return new Response("Unknown export type", {
            status: 400,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    }

    const csv = toCsv(data.headers, data.rows);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `hireloop-${type}-${days ? `${days}d-` : ""}${date}.csv`;

    return new Response(`\uFEFF${csv}`, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
}
