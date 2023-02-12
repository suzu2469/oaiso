import { trpc } from '@/utils/trpc'

const ReminderList: React.FC = () => {
    const { data, isLoading, isError } = trpc.reminder.list.useQuery(
        undefined,
        {},
    )

    if (isError) return <div>error</div>
    if (isLoading) return <div>Loading...</div>
    return <div>{JSON.stringify(data)}</div>
}

export default ReminderList
