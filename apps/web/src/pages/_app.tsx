import React from 'react'
import Head from 'next/head'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'

import { trpc } from '@/utils/trpc'

const App = (props: AppProps) => {
    return (
        <>
            <Head>
                <title>Oaiso Management</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <UserProvider>
                    <props.Component {...props.pageProps} />
                </UserProvider>
            </MantineProvider>
        </>
    )
}

export default trpc.withTRPC(App)
