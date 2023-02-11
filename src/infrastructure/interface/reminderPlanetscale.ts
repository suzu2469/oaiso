import {
    ReminderCreateArgs,
    ReminderRepository,
} from '../../domain/repository/reminderRepository'
import { Connection } from '@planetscale/database'
import { dateToMySQLDatetime } from '../mysqlutils/dateToMySQLDatetime'
import { Reminder } from '../../domain/entity/reminder'

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

    async listBeforeNow(date: Date): Promise<Reminder[]> {
        const res = await this.planetscale.execute(
            `
            SELECT
                id, member_id, channel_id, guild_id, remind_date, message
            FROM
                Reminder
            WHERE 
                remind_date <= ?
            ;
        `,
            [dateToMySQLDatetime(date)],
        )

        return res.rows.map<Reminder>((r: any) => ({
            id: r.id,
            message: r.message,
            guildId: r.guild_id,
            channelId: r.channel_id,
            userId: r.member_id,
            dateTime: new Date(r.remind_date),
        }))
    }

    async remove(id: number): Promise<void> {
        await this.planetscale.execute(`DELETE FROM Reminder WHERE id = ?;`, [
            id,
        ])
    }
}
