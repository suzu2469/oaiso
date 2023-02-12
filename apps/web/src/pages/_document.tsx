import { createGetInitialProps } from '@mantine/next'
import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
    return (
        <Html lang="ja">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document

export const getInitialProps = createGetInitialProps()
