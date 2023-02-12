import * as trpc from '@trpc/server'
import type { inferAsyncReturnType } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { getSession } from '@auth0/nextjs-auth0'

export async function createContext({
    req,
    res,
}: trpcNext.CreateNextContextOptions) {
    const session = await getSession(req, res)
    return {
        session,
    }
}
export type Context = inferAsyncReturnType<typeof createContext>
