export const dateToMySQLDatetime = (date: Date): string =>
    date.toISOString().slice(0, 19).replace('T', ' ')
