import {
    ReminderCreateArgs,
    ReminderRepository,
} from '../../domain/repository/reminderRepository'
import { Connection } from '@planetscale/database'

export class ReminderPlanetscale implements ReminderRepository {
    constructor(private planetscale: Connection) {}

    async create(args: ReminderCreateArgs): Promise<void> {
        await this.planetscale.execute(
            'INSERT INTO reminder(memberId, channelId, guildId, remindDate, message)',
            [
                args.memberId,
                args.channelId,
                args.guildId,
                args.remindDate,
                args.message,
            ],
        )
    }
}
