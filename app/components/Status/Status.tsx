import { Center, Flex } from "@mantine/core"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Error, Pending, Starting, Success } from "#icons.ts"
import classes from "./Status.module.css"

export interface StatusProps {
  status?: "starting" | "pending" | "success" | "error"
  pendingTitle: string
  successTitle: string
  errorTitle: string
}

export function Status(props: StatusProps) {
  const { t } = useTranslation()

  const getIcon = (): ReactNode => {
    if (props.status === "starting")
      return <Starting size={100} className={classes.loaderStarting} />
    if (props.status === "pending")
      return <Pending size={100} className={classes.loaderPending} />
    if (props.status === "success")
      return <Success size={100} className={classes.iconSuccess} />
    if (props.status === "error")
      return <Error size={100} className={classes.iconError} />
    return null
  }

  const getTitle = (): string => {
    if (props.status === "starting") return t("Starting private container...")
    if (props.status === "pending") return props.pendingTitle
    if (props.status === "success") return props.successTitle
    if (props.status === "error") return props.errorTitle
    return ""
  }

  return (
    <Center className={classes.container}>
      <Flex direction={{ base: "column", sm: "row" }} align="center" gap="md">
        {getIcon()}
        <span className={classes.title}>{getTitle()}</span>
      </Flex>
    </Center>
  )
}
