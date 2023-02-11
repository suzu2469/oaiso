import { IReminderUsecase } from '../../domain/usecase/reminder'
import { ReminderRepository } from '../../domain/repository/reminderRepository'
import { ChatClient } from '../../domain/interface/chatClient'

export class ReminderUsecase implements IReminderUsecase {
    constructor(
        private reminderRepo: ReminderRepository,
        private chatClient: ChatClient,
    ) {}

    async sendRemind(): Promise<void> {
        const now = new Date(Date.now())
        const list = await this.reminderRepo.listBeforeNow(now)

        const results = await Promise.all(
            list.map(async (r) => {
                try {
                    await this.chatClient.sendRemind({
                        message: r.message,
                        channelId: r.channelId,
                    })
                    return { result: true, id: r.id }
                } catch (e) {
                    return { result: false, id: r.id }
                }
            }),
        )

        try {
            await Promise.all(
                results.map(async (r) => {
                    if (!r.result) return
                    await this.reminderRepo.remove(r.id)
                }),
            )
        } catch (e) {
            throw new Error(`Cannot removed reminders ${JSON.stringify(e)}`)
        }
    }
}
