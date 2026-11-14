import React, { Suspense } from "react";
import SignInPage from "./SignInPage";
import AuthSkeleton from "../AuthSkeleton";

export const metadata = {
    title: "Sign In",
    description:
        "Access your HireLoop account to explore job opportunities and connect with top companies.",
};

const SignIn = () => {
    return (
        <Suspense fallback={<AuthSkeleton />}>
            <SignInPage />
        </Suspense>
    );
};

export default SignIn;
