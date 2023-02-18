import { trpc } from '@/utils/trpc'
import {
    Table,
    Container,
    ActionIcon,
    Group,
    Modal,
    Input,
    Stack,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconTrash, IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import 'dayjs/locale/ja'

const ReminderList: React.FC = () => {
    const [editOpened, setEditOpened] = useState(false)
    const { data, isLoading, isError } = trpc.reminder.list.useQuery(
        undefined,
        {},
    )

    if (isError) return <div>error</div>
    if (isLoading) return <div>Loading...</div>
    return (
        <Container>
            <div style={{ overflowY: 'auto' }}>
                <Table verticalSpacing="xs">
                    <thead>
                        <tr>
                            <th>サーバー</th>
                            <th>時刻</th>
                            <th>メッセージ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r) => (
                            <tr key={r.id}>
                                <td>{r.guildName}</td>
                                <td>{r.remind_date}</td>
                                <td>{r.message}</td>
                                <td>
                                    <Group>
                                        <ActionIcon
                                            onClick={() => setEditOpened(true)}
                                        >
                                            <IconEdit size="18" />
                                        </ActionIcon>
                                        <ActionIcon color="red">
                                            <IconTrash size="18" />
                                        </ActionIcon>
                                    </Group>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal
                opened={editOpened}
                onClose={() => setEditOpened(false)}
                title="編集"
            >
                <Stack>
                    <Input.Wrapper withAsterisk label="メッセージ">
                        <Input />
                    </Input.Wrapper>
                    <Input.Wrapper withAsterisk label="メッセージ">
                        <DatePicker locale="ja" />
                    </Input.Wrapper>
                </Stack>
            </Modal>
        </Container>
    )
}

export default ReminderList
