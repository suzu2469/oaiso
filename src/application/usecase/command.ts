import { ChatClient } from '../../domain/interface/chatClient'
import { ReminderRepository } from '../../domain/repository/reminderRepository'
import {
    ICommandUsecase,
    RegisterReminderArgs,
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
        console.log('request coming: ', JSON.stringify(args))
    }
}
