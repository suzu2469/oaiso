import {
    ReminderCreateArgs,
    ReminderRepository,
} from '../../domain/repository/reminderRepository'
import { Connection } from '@planetscale/database'
import { dateToMySQLDatetime } from '../mysqlutils/dateToMySQLDatetime'

export class ReminderPlanetscale implements ReminderRepository {
    constructor(private planetscale: Connection) {}

    async create(args: ReminderCreateArgs): Promise<void> {
        await this.planetscale.execute(
            `INSERT INTO 
                Reminder(member_id, channel_id, guild_id, remind_date, message) 
                VALUES (?, ?, ?, ?, ?);`,
            [
                args.memberId,
                args.channelId,
                args.guildId,
                dateToMySQLDatetime(args.remindDate),
                args.message,
            ],
        )
    }
}
