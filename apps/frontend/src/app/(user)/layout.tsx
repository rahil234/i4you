"use client"

import React, {useEffect, useState} from "react"
import {useAuthStore} from "@/store";
import {redirect} from "next/navigation";

export default function UserLayout(
    {children}: Readonly<{ children: React.ReactNode }>
) {
    const {fetchUser, refreshToken, isLoading, isAuthenticated, error} = useAuthStore()

    useEffect(() => {
        refreshToken().then(async () => {
            await fetchUser()
        })
    }, []);


    if (!isAuthenticated) {
        console.log("User is not authenticated")
        redirect("/login")
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
            {children}
        </div>
    )
}
