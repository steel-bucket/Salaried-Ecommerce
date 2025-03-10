'use client'

import React, { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '../../server/trpc/client'
import { httpBatchLink } from '@trpc/client'
import { ThemeProvider } from '@/components/ThemeProvider'

const Providers = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/trpc`,
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include',
                        })
                    },
                }),
            ],
        })
    )
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}
export default Providers
