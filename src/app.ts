import { CommandUsecase } from './application/usecase/command'
import { ICommandUsecase } from './domain/usecase/command'
import { DiscordClient } from './infrastructure/interface/discordClient'
import type {
    APIInteraction,
    APIInteractionResponsePong,
    APIApplicationCommandInteractionDataOption,
    APIInteractionResponseChannelMessageWithSource,
    Client,
} from 'discord.js'
import type { Env } from '.'
import { JsonResponse } from './infrastructure/httputils/response'
import {
    ReminderCommandType,
    ReminderDatetimeOptionType,
    ReminderMessageOptionType,
} from './domain/entity/reminder'
import { ReminderPlanetscale } from './infrastructure/interface/reminderPlanetscale'
import { connect, Connection } from '@planetscale/database'
import { InvalidArgsError } from './domain/entity/error'

export class App {
    private commandUsecase: ICommandUsecase
    private planetscale: Connection

    constructor(private env: Env) {
        this.planetscale = connect({
            // url: env.
        })
        this.commandUsecase = new CommandUsecase(
            new DiscordClient(this.env.DISCORD_TOKEN),
            new ReminderPlanetscale(this.planetscale),
        )
    }

    async registerCommands(): Promise<Response> {
        try {
            await this.commandUsecase.registerCommand(this.env.DISCORD_APP_ID)
            return new Response('ok', { status: 200 })
        } catch (e) {
            return new Response('ng', { status: 500 })
        }
    }

    async receiveInteractions(message: APIInteraction): Promise<Response> {
        switch (message.type) {
            case 1: {
                const res: APIInteractionResponsePong = {
                    type: 1,
                }
                return new JsonResponse(res)
            }

            case 2: {
                switch (message.data.name.toLowerCase()) {
                    case ReminderCommandType.toLowerCase():
                        if (message.data.type !== 1) {
                            return new JsonResponse(
                                {
                                    message:
                                        'this interaction type is not supported',
                                },
                                { status: 400 },
                            )
                        }
                        if (!message.data.options)
                            return new JsonResponse(
                                {
                                    message: 'Bad request',
                                },
                                { status: 400 },
                            )

                        const option = this.extractCommandOptions(
                            message.data.options,
                        )
                        if (!option)
                            return new JsonResponse(
                                {
                                    message: 'Bad request',
                                },
                                { status: 400 },
                            )

                        try {
                            await this.commandUsecase.registerReminder({
                                channelId: message.channel_id,
                                guildId: message.guild_id ?? '',
                                memberId: message.member?.user.id ?? '',
                                datetime: option.datetime,
                                message: option.message,
                                locale: message.locale,
                            })
                        } catch (e) {
                            if (e instanceof InvalidArgsError) {
                                return new JsonResponse(
                                    { message: 'invalid args' },
                                    { status: 400 },
                                )
                            }
                            return new JsonResponse(
                                { message: 'Internal server error' },
                                { status: 500 },
                            )
                        }
                        return new JsonResponse({
                            type: 4,
                            data: {
                                content: `I'll remind you at \`${option.datetime}\``,
                            },
                        } as APIInteractionResponseChannelMessageWithSource)
                    default:
                        return new JsonResponse(
                            {
                                message:
                                    'this interaction type is not supported',
                            },
                            { status: 400 },
                        )
                }
            }

            default:
                return new JsonResponse(
                    { message: 'this interaction type is not supported' },
                    { status: 400 },
                )
        }
    }

    private extractCommandOptions(
        options: APIApplicationCommandInteractionDataOption[],
    ): { datetime: string; message: string } | null {
        const messageOption = options.find(
            (o) => o.name === ReminderMessageOptionType,
        )
        if (!messageOption) {
            return null
        }
        if (messageOption.type !== 3) {
            return null
        }

        const datetimeOption = options.find(
            (o) => o.name === ReminderDatetimeOptionType,
        )
        if (!datetimeOption) {
            return null
        }
        if (datetimeOption.type !== 3) {
            return null
        }

        return {
            datetime: datetimeOption.value,
            message: messageOption.value,
        }
    }
}
