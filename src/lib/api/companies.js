import { serverFetch } from "../core/server";
import { getUserSession } from "../core/session";

// to get recruiter companies
export const getRecuiterCompanies = async (recruiterId) => {

    return serverFetch(`/api/my/companies?recruiterId=${recruiterId}`)
}

//to get logged in recruuiter companies 

export const getLoggedInRecruiterCompany = async () =>{
    const user = await getUserSession();
    return getRecuiterCompanies(user?.id);
}