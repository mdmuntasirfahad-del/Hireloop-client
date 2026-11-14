import React from "react";
import logo from "../../public/images/logo.png";
import Image from "next/image";

const Logo = () => {
    return (
        <div>
            <Image
                src={logo}
                width={154}
                height={44}
                loading="eager"
                alt="HireLoop"
            />
        </div>
    );
};

export default Logo;
