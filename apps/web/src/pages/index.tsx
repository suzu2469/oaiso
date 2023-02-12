import { NextPage } from 'next'

const Index: NextPage = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>
                <a href="/api/auth/login">Login</a>
            </p>
            <p>
                <a href="/api/auth/logout">Logout</a>
            </p>
        </div>
    )
}

export default Index
