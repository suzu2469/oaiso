export type RegisterReminderArgs = {
    datetime: string
    message: string
    memberId: string
    guildId: string
    channelId: string
}

export interface ICommandUsecase {
    registerReminder(args: RegisterReminderArgs): Promise<void>
    registerCommand(appId: string): Promise<void>
}
