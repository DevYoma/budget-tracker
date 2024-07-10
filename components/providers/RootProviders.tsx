"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";

type Prop = {
    children: ReactNode;
}

function RootProviders({ children }: Prop){
    return (
        <ThemeProvider 
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}

export default RootProviders;