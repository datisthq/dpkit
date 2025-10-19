import { Center, Group } from "@mantine/core"
import { Error, Pending, Starting, Success } from "#icons.ts"
import classes from "./Status.module.css"

export interface StatusProps {
  status?: "starting" | "pending" | "success" | "error"
  pendingTitle: string
  successTitle: string
  errorTitle: string
}

export function Status(props: StatusProps) {
  if (props.status === "starting") return <StartingStatus />
  if (props.status === "pending")
    return <PendingStatus title={props.pendingTitle} />
  if (props.status === "success")
    return <SuccessStatus title={props.successTitle} />
  if (props.status === "error") return <ErrorStatus title={props.errorTitle} />
  return null
}

function StartingStatus() {
  return (
    <Center className={classes.container}>
      <Group>
        <Starting size={100} className={classes.loaderStarting} />
        <span className={classes.title}>Starting private container...</span>
      </Group>
    </Center>
  )
}

function PendingStatus(props: { title: string }) {
  return (
    <Center className={classes.container}>
      <Group>
        <Pending size={100} className={classes.loaderPending} />
        <span className={classes.title}>{props.title}</span>
      </Group>
    </Center>
  )
}

function SuccessStatus(props: { title: string }) {
  return (
    <Center className={classes.container}>
      <Group>
        <Success size={100} className={classes.iconSuccess} />
        <span className={classes.title}>{props.title}</span>
      </Group>
    </Center>
  )
}

function ErrorStatus(props: { title: string }) {
  return (
    <Center className={classes.container}>
      <Group>
        <Error size={100} className={classes.iconError} />
        <span className={classes.title}>{props.title}</span>
      </Group>
    </Center>
  )
}
