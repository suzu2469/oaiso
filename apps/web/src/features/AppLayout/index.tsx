import { useState } from 'react'
import {
    Navbar,
    Group,
    MediaQuery,
    Container,
    Burger,
    Header,
} from '@mantine/core'
import { IconAlarm, IconSettings, IconLogout } from '@tabler/icons-react'
import useStyles from './styles'
import Link from 'next/link'

const data = [
    { link: '', label: 'Reminders', icon: IconAlarm },
    { link: '', label: 'Settings', icon: IconSettings },
]

type Props = {
    title: string
}
const AppLayout: React.FC<React.PropsWithChildren<Props>> = (props) => {
    const { classes, cx } = useStyles()
    const [opened, setOpened] = useState(false)

    return (
        <>
            <Header className={classes.headerInner} height="60">
                <span>Oaiso</span>
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                    <Burger
                        className={classes.burger}
                        opened={opened}
                        onClick={() => setOpened(!opened)}
                    />
                </MediaQuery>
            </Header>
            <div className={classes.content}>
                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                    <Group align="flex-start">
                        <AppNavbar />
                        <Container
                            p="sm"
                            py="sm"
                            className={classes.largeContent}
                        >
                            {props.children}
                        </Container>
                    </Group>
                </MediaQuery>

                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                    <Container size="sm" p="sm">
                        {props.children}
                    </Container>
                </MediaQuery>

                {opened && (
                    <div className={classes.navbarFloatWrap}>
                        <AppNavbar />
                    </div>
                )}
            </div>
        </>
    )
}

const AppNavbar = () => {
    const { classes, cx } = useStyles()

    return (
        <Navbar height="calc(100vh - 60px)" width={{ md: 300 }} p="md">
            <Navbar.Section grow>
                {data.map((item, index) => (
                    <Link
                        className={cx(classes.link, {
                            [classes.linkActive]: item.label === 'Reminders',
                        })}
                        href={item.link}
                        key={index}
                    >
                        <item.icon className={classes.linkIcon} stroke={1.5} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <a className={classes.link} href="/api/auth/logout">
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </Navbar.Section>
        </Navbar>
    )
}

export default AppLayout
