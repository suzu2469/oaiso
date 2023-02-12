type Props = {
    title: string
}
const AppLayout: React.FC<React.PropsWithChildren<Props>> = (props) => {
    return <div>{props.children}</div>
}

export default AppLayout
