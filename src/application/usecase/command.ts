import { ChatClient } from '../../domain/interface/chatClient'
import {
    ICommandUsecase,
    RegisterReminderArgs,
} from '../../domain/usecase/command'

export class CommandUsecase implements ICommandUsecase {
    constructor(private chat: ChatClient) {}

    async registerCommand(appId: string): Promise<void> {
        await this.chat.sendRegisterCommand(appId)
    }

    async registerReminder(args: RegisterReminderArgs): Promise<void> {
        console.log('request coming: ', args)
    }
}
