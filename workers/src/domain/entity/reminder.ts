import { z } from 'zod'

export const ReminderCommandType = 'reminder' as const

export const ReminderDatetimeOptionType = 'datetime' as const
export const ReminderMessageOptionType = 'message' as const

export const discordTimestampSchema = z
    .string()
    .regex(
        /^<t:[0-9]{10}:[fFdDtTR]>$/,
        '時刻は <t:??????????:?> の形で入力してください',
    )
    .transform<Date>((timestamp) => {
        const unixtime = timestamp.match(/:([0-9]{10}):/)?.[1]
        if (!unixtime)
            throw new Error(`Invalid discord datetime value: ${timestamp}`)
        return new Date(Number(unixtime) * 1000)
    })
    .refine((d) => {
        return new Date().getTime() < d.getTime()
    }, '現在より未来の時刻を指定してください')

export type Reminder = {
    id: number
    guildId: string
    channelId: string
    userId: string
    message: string
    dateTime: Date
}
