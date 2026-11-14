import React, { Suspense } from "react";
import SignUpPage from "./SignUpPage";
import AuthSkeleton from "../AuthSkeleton";

export const metadata = {
    title: "Sign Up",
    description:
        "Create a new HireLoop account to find your next role or hire your next teammate.",
};

const SignUp = () => {
    return (
        <Suspense fallback={<AuthSkeleton />}>
            <SignUpPage />
        </Suspense>
    );
};

export default SignUp;
