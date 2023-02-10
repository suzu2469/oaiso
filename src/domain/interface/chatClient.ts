export interface ChatClient {
    sendRegisterCommand(appId: string): Promise<void>
}
