import React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import {ThemeProvider} from "@/contexts/theme-context"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "I4You",
    description: "A -like dating app",
    generator: 'v0.dev'
}

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
        </body>
        </html>
    )
}

import './globals.css'
