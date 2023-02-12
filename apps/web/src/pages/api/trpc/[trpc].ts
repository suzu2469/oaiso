import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/context'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'

export default withApiAuthRequired(
    createNextApiHandler({
        router: appRouter,
        createContext,
    }),
)
