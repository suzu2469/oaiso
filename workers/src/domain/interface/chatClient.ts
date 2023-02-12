export type SendRemindArgs = {
    channelId: string
    message: string
}

export interface ChatClient {
    sendRegisterCommand(appId: string): Promise<void>
    sendRemind(args: SendRemindArgs): Promise<void>
}
