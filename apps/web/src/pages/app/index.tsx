import { NextPage } from 'next'
import { trpc } from '@/utils/trpc'

const AppIndex: NextPage = () => {
    const { data, isLoading, isError } = trpc.reminder.list.useQuery()

    if (isError) return <div>error</div>
    if (isLoading) return <div>Loading...</div>
    return <div>{JSON.stringify(data)}</div>
}

export default AppIndex
