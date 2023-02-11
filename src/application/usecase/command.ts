import { InvalidArgsError } from '../../domain/entity/error'
import { ChatClient } from '../../domain/interface/chatClient'
import { ReminderRepository } from '../../domain/repository/reminderRepository'
import {
    ICommandUsecase,
    RegisterReminderArgs,
    registerReminderArgsSchema,
} from '../../domain/usecase/command'
import { discordTimestampSchema } from '../../domain/entity/reminder'

export class CommandUsecase implements ICommandUsecase {
    constructor(
        private chat: ChatClient,
        private reminder: ReminderRepository,
    ) {}

    async registerCommand(appId: string): Promise<void> {
        await this.chat.sendRegisterCommand(appId)
    }

    async registerReminder(args: RegisterReminderArgs): Promise<void> {
        const argsResult = registerReminderArgsSchema.safeParse(args)
        const datetimeResult = discordTimestampSchema.safeParse(args.datetime)
        if (!argsResult.success) {
            if (argsResult.error.isEmpty) {
                throw new InvalidArgsError(argsResult.error.message)
            }
            const reason = argsResult.error.errors
                .map((e) => e.message)
                .join(', ')
            throw new InvalidArgsError(reason)
        }
        if (!datetimeResult.success) {
            if (datetimeResult.error.isEmpty) {
                throw new InvalidArgsError(datetimeResult.error.message)
            }
            const reason = datetimeResult.error.errors
                .map((e) => e.message)
                .join(', ')
            throw new InvalidArgsError(reason)
        }

        await this.reminder.create({
            channelId: args.channelId,
            guildId: args.guildId,
            memberId: args.memberId,
            message: args.message,
            remindDate: datetimeResult.data,
        })
    }
}
