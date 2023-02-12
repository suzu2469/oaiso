import { createStyles } from '@mantine/core'

export default createStyles((theme, _, createRef) => {
    const icon = createRef('icon')
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`,
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[1]
                    : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color:
                        theme.colorScheme === 'dark'
                            ? theme.white
                            : theme.black,
                },
            },
        },

        linkIcon: {
            ref: icon,
            color:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[2]
                    : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({
                    variant: 'light',
                    color: theme.primaryColor,
                }).background,
                color: theme.fn.variant({
                    variant: 'light',
                    color: theme.primaryColor,
                }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({
                        variant: 'light',
                        color: theme.primaryColor,
                    }).color,
                },
            },
        },

        burger: {},

        content: {},

        headerInner: {
            padding: theme.spacing.md,
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        navbarFloatWrap: {
            width: '100%',
            position: 'fixed',
            top: 60,
            left: 0,
        },

        largeContent: {
            height: 'calc(100vh - 60px)',
            maxWidth: 'none',
            overflowY: 'scroll',
            flex: 1,
        },
    }
})
