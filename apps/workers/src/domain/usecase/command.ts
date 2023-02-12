import { z } from 'zod'

export const registerReminderArgsSchema = z.object({
    channelId: z.string(),
    guildId: z.string(),
    datetime: z.string(),
    memberId: z.string(),
    message: z.string().max(1000, 'メッセージは1000文字以内で入力してください'),
    locale: z.string(),
})
export type RegisterReminderArgs = z.infer<typeof registerReminderArgsSchema>

export interface ICommandUsecase {
    registerReminder(args: RegisterReminderArgs): Promise<void>
    registerCommand(appId: string): Promise<void>
}
