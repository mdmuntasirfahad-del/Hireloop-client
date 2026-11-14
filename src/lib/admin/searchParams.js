export const ADMIN_PAGE_SIZE = 10;

export const firstSearchParam = (searchParams, key) => {
    const value = searchParams?.[key];

    if (Array.isArray(value)) {
        return typeof value[0] === "string" ? value[0] : "";
    }

    return typeof value === "string" ? value : "";
};

export const readAdminPage = (searchParams) => {
    const parsed = Number.parseInt(firstSearchParam(searchParams, "page"), 10);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export const readAdminQuery = (searchParams) =>
    firstSearchParam(searchParams, "q").trim().slice(0, 120);

export const readAdminFilter = (searchParams, key, allowed) => {
    const value = firstSearchParam(searchParams, key).toLowerCase();

    return allowed.includes(value) ? value : "";
};

export const readAdminRange = (searchParams) => {
    const parsed = Number.parseInt(
        firstSearchParam(searchParams, "range"),
        10
    );

    return [7, 30, 90].includes(parsed) ? parsed : 30;
};
