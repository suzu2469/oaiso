export type ReminderCreateArgs = {
    message: String
    memberId: String
    channelId: String
    guildId: String
    remindDate: Date
}

export interface ReminderRepository {
    create(args: ReminderCreateArgs): Promise<void>
}
