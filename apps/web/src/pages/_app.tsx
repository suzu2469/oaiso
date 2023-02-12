import React from 'react'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc'

const App = (props: AppProps) => {
    return (
        <UserProvider>
            <props.Component {...props.pageProps} />
        </UserProvider>
    )
}

export default trpc.withTRPC(App)
