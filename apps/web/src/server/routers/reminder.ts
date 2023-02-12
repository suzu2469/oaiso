import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Guild, REST, Routes } from 'discord.js'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'

import { router, procedure } from '@/server/trpc'
import { prisma } from '@/server/prisma'
import { getDiscordIdFromSession } from '@/server/utils/getDiscordIdFromSession'
import {
    getAuth0User,
    getDiscordAccessToken,
    getDiscordIdentify,
} from '../utils/auth0'
import { discordClient } from '../utils/discord'

export const reminderRouter = router({
    list: procedure.query(async ({ ctx }) =>
        pipe(
            TE.Do,
            TE.bind('session', () =>
                pipe(
                    ctx.session,
                    TE.fromNullable(new TRPCError({ code: 'UNAUTHORIZED' })),
                ),
            ),
            TE.bind('discordUserID', ({ session }) =>
                pipe(
                    session,
                    getDiscordIdFromSession,
                    TE.fromNullable(new TRPCError({ code: 'UNAUTHORIZED' })),
                ),
            ),
            TE.bind('items', ({ discordUserID }) =>
                pipe(
                    TE.tryCatch(
                        () =>
                            prisma.reminder.findMany({
                                select: {
                                    id: true,
                                    message: true,
                                    remind_date: true,
                                    guild_id: true,
                                },
                                where: {
                                    member_id: discordUserID,
                                    AND: {},
                                },
                            }),
                        (e) =>
                            new TRPCError({
                                code: 'INTERNAL_SERVER_ERROR',
                                message: 'Failed to get reminders',
                                cause: e,
                            }),
                    ),
                ),
            ),
            TE.bind('discordAccessToken', ({ session }) =>
                pipe(
                    session.user.sub as string,
                    TE.of,
                    TE.chain((id) =>
                        TE.tryCatch(
                            () => getAuth0User(id),
                            (e) =>
                                new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message: 'Failed to get Auth0 user',
                                    cause: e,
                                }),
                        ),
                    ),
                    TE.chain((profile) =>
                        pipe(
                            profile,
                            getDiscordIdentify,
                            TE.fromNullable(
                                new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message: 'Failed to get Discord identity',
                                }),
                            ),
                        ),
                    ),
                    TE.chain((identity) =>
                        pipe(
                            identity,
                            getDiscordAccessToken,
                            TE.fromNullable(
                                new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message:
                                        'Failed to get Discord access token',
                                }),
                            ),
                        ),
                    ),
                ),
            ),
            TE.bind('guilds', ({ discordAccessToken }) =>
                pipe(
                    TE.tryCatch(
                        () =>
                            discordClient
                                .get(`/users/@me/guilds`, {
                                    headers: {
                                        Authorization: `Bearer ${discordAccessToken}`,
                                    },
                                })
                                .then((res) => res.data as Guild[]),
                        (e) =>
                            new TRPCError({
                                code: 'INTERNAL_SERVER_ERROR',
                                message: 'Failed to get guild',
                                cause: e,
                            }),
                    ),
                ),
            ),
            TE.fold(
                (e) => {
                    console.error(e)
                    throw e
                },
                ({ items, guilds }) =>
                    pipe(
                        items,
                        A.map((item) => ({
                            ...item,
                            guildName: pipe(
                                guilds,
                                A.findFirst((g) => g.id === item.guild_id),
                                O.map((g) => g.name),
                                O.getOrElse(() => ''),
                            ),
                        })),
                        T.of,
                    ),
            ),
        )(),
    ),
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
