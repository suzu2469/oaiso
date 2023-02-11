import type { ApplicationCommandDataResolvable } from 'discord.js'
import {
    ReminderCommandType,
    ReminderDatetimeOptionType,
    ReminderMessageOptionType,
} from '../../domain/entity/reminder'
import { ChatClient, SendRemindArgs } from '../../domain/interface/chatClient'

export class DiscordClient implements ChatClient {
    private DISCORD_API_URL = 'https://discord.com/api/v10'

    constructor(private token: string) {}

    async sendRegisterCommand(appId: string): Promise<void> {
        const body: ApplicationCommandDataResolvable = {
            name: ReminderCommandType,
            type: 1,
            description: 'Remind a message',
            description_localizations: {
                ja: 'メッセージをリマインドします',
            },
            options: [
                {
                    type: 3,
                    name: ReminderDatetimeOptionType,
                    name_localizations: {
                        ja: '時刻',
                    },
                    description:
                        'Enter a discord timestamp exp. `<t:1676097834:f>` https://discord-date.shyked.fr/',
                    description_localizations: {
                        ja: 'Discordタイムスタンプを入力してください 例: `<t:1676097834:f>` https://discord-date.shyked.fr/',
                    },
                    required: true,
                },
                {
                    type: 3,
                    name: ReminderMessageOptionType,
                    name_localizations: {
                        ja: 'メッセージ',
                    },
                    description: 'Put a message',
                    required: true,
                    max_length: 100,
                },
            ],
        }
        const res = await fetch(
            `${this.DISCORD_API_URL}/applications/${appId}/commands`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${this.token}`,
                },
                method: 'POST',
                body: JSON.stringify(body),
            },
        )
        if (!res.ok) {
            console.error(
                JSON.stringify(
                    {
                        message: `Request Failed: ${this.DISCORD_API_URL}/applications/${appId}/commands`,
                        status: res.status,
                        body: await res.json(),
                    },
                    null,
                    2,
                ),
            )
            throw new Error('Failed to post commands into discord')
        }
    }

    async sendRemind(args: SendRemindArgs): Promise<void> {
        const body = {
            content: args.message,
            tts: false,
        }

        const res = await fetch(
            `${this.DISCORD_API_URL}/channels/${args.channelId}/messages`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${this.token}`,
                },
                method: 'POST',
                body: JSON.stringify(body),
            },
        )
        if (!res.ok) {
            throw new Error('Failed to send message to discord')
        }
    }
}
