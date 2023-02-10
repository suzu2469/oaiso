import { InvalidArgsError } from '../../domain/entity/error'
import { datetimeFromLocale } from '../../domain/entity/reminder'
import { ChatClient } from '../../domain/interface/chatClient'
import { ReminderRepository } from '../../domain/repository/reminderRepository'
import {
    ICommandUsecase,
    RegisterReminderArgs,
    registerReminderArgsSchema,
} from '../../domain/usecase/command'

export class CommandUsecase implements ICommandUsecase {
    constructor(
        private chat: ChatClient,
        private reminder: ReminderRepository,
    ) {}

    async registerCommand(appId: string): Promise<void> {
        await this.chat.sendRegisterCommand(appId)
    }

    async registerReminder(args: RegisterReminderArgs): Promise<void> {
        console.log(JSON.stringify(args))
        const argsResult = registerReminderArgsSchema.safeParse(args)
        console.log(JSON.stringify(argsResult, null, 2))
        if (!argsResult.success) {
            throw new InvalidArgsError(argsResult.error.message)
        }

        const datetime = datetimeFromLocale(args.locale)(args.datetime)

        this.reminder.create({
            channelId: args.channelId,
            guildId: args.guildId,
            memberId: args.memberId,
            message: args.message,
            remindDate: datetime,
        })
    }
}
