import React from 'react'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { AppProps } from 'next/app'

const App = (props: AppProps) => {
    return (
        <UserProvider>
            <props.Component {...props.pageProps} />
        </UserProvider>
    )
}

export default App
