import { router, procedure } from '@/server/trpc'
import { reminderRouter } from '@/server/routers/reminder'

export const appRouter = router({
    reminder: reminderRouter,
})

export type AppRouter = typeof appRouter
