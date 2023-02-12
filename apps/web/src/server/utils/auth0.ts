import axios from 'axios'

export const auth0Client = axios.create({
    baseURL: `${process.env.AUTH0_ISSUER_BASE_URL ?? ''}/api/v2`,
    headers: {
        'Content-Type': 'applicaton/json',
    },
})

auth0Client.interceptors.request.use(async (req) => {
    const res = await axios.post(
        `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.AUTH0_CLIENT_ID ?? '',
            client_secret: process.env.AUTH0_CLIENT_SECRET ?? '',
            audience: `${process.env.AUTH0_ISSUER_BASE_URL ?? ''}/api/v2/`,
        }),
    )
    req.headers.Authorization = `Bearer ${res.data.access_token}`
    return req
})

export const getAuth0User = (userId: string) =>
    auth0Client
        .get<auth0.Auth0UserProfile>(`/users/${userId}`)
        .then((res) => res.data)

export const getDiscordIdentify = (result: auth0.Auth0UserProfile) =>
    result.identities.find((a) => a.connection === 'discord') ?? null

export const getDiscordAccessToken = (
    identity: auth0.Auth0Identity,
): string | null => (identity as any).access_token ?? null
