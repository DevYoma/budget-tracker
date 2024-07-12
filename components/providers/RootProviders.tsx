"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type Prop = {
    children: ReactNode;
}

function RootProviders({ children }: Prop){
    const [queryClient] = useState(() => new QueryClient({}));
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider 
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

export default RootProviders;