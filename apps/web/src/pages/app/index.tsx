import { NextPage } from 'next'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import ReminderList from '@/features/ReminderList'
import AppLayout from '@/features/AppLayout'

const AppIndex: NextPage = () => {
    return (
        <AppLayout title="Your Reminders">
            <ReminderList />
        </AppLayout>
    )
}

export const getServerSideProps = withPageAuthRequired()

export default AppIndex
