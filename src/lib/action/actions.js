"use server"

import { revalidatePath } from "next/cache"
import { serverMutation } from "../core/server"



export const createJob = async(newJobData) => {

    const result = await serverMutation('/api/jobs', newJobData)

    if (result?.insertedId) {
        revalidatePath('/')
    }

    return result
}



// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
// export const createJob=async (newJobData) => {
//     const res= await fetch(`${baseUrl}/api/jobs`, {
//         method: "POST",
//         headers: {  
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newJobData),
//     });
//     return res.json();
// }