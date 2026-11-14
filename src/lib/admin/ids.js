import { ObjectId } from "mongodb";

export const toObjectId = (value) => {
    if (value instanceof ObjectId) return value;

    const text = String(value || "");

    return /^[a-f0-9]{24}$/i.test(text) ? new ObjectId(text) : null;
};

export const toIdString = (value) => (value ? String(value) : "");

export const idFilter = (value) => {
    const text = toIdString(value);
    const variants = text ? [text] : [];
    const objectId = toObjectId(text);

    if (objectId) {
        variants.push(objectId);
    }

    return { _id: { $in: variants } };
};
