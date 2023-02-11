import type { ApplicationCommandDataResolvable } from 'discord.js'
import {
    ReminderCommandType,
    ReminderDatetimeOptionType,
    ReminderMessageOptionType,
} from '../../domain/entity/reminder'
import { ChatClient } from '../../domain/interface/chatClient'

export class DiscordClient implements ChatClient {
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
            `https://discord.com/api/v10/applications/${appId}/commands`,
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
                        message: `Request Failed: https://discord.com/api/v10/applications/${appId}/commands`,
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
}
