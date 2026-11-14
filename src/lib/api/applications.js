import { serverFetch } from "../core/server";

export const getApplicationsByApplicant = (applicantId) => {
    return serverFetch(`/api/application?applicantId=${applicantId}`);
};

export const getApplicationsByJob = (jobId) => {
    return serverFetch(`/api/application?jobId=${jobId}`);
};
