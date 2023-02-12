import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { router, procedure } from '@/server/trpc'
import { prisma } from '@/server/prisma'
import { getDiscordIdFromSession } from '@/server/utils/getDiscordIdFromSession'

export const reminderRouter = router({
    list: procedure.query(async ({ ctx }) => {
        if (!ctx.session) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
            })
        }
        const userId = getDiscordIdFromSession(ctx.session)
        if (!userId) {
            throw new TRPCError({
                code: 'FORBIDDEN',
            })
        }

        const items = await prisma.reminder
            .findMany({
                select: {
                    id: true,
                    message: true,
                    remind_date: true,
                },
                where: {
                    member_id: userId,
                    AND: {},
                },
            })
            .catch((e) => {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: JSON.stringify(e),
                })
            })

        return items
    }),
    remove: procedure
        .input(z.object({ id: z.number().min(1) }))
        .mutation(async ({ input }) => {
            await prisma.reminder.delete({
                where: {
                    id: input.id,
                },
            })
        }),
    update: procedure
        .input(
            z.object({
                id: z.number().min(1),
                remindDate: z
                    .date()
                    .refine(
                        (d) => d.getTime() >= new Date(Date.now()).getTime(),
                    ),
                message: z.string().max(1000),
            }),
        )
        .mutation(async ({ input }) => {
            await prisma.reminder.update({
                data: {
                    remind_date: input.remindDate,
                    message: input.message,
                },
                where: {
                    id: input.id,
                },
            })
        }),
})
