import React from 'react';
import googleLogo from "@/assets/google-logo.jpeg";
import Image from "next/image";

const GoogleLogo = ({className}: { className: string }) => {
    return (
        <Image src={googleLogo} alt={"googleLogo"}
               className={className}/>
    );
};

export default GoogleLogo;
