const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";


export const serverFetch = async (path, options = {}) => {
    const res = await fetch(`${baseUrl}${path}`, options);

    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const text = await res.text();
    return text ? JSON.parse(text) : null;
}


export const serverMutation = async (path, data) => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    // handle 401,404,500
    return res.json();
}