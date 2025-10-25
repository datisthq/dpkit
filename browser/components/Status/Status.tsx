import { Center, Flex } from "@mantine/core"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import * as icons from "#icons.ts"
import classes from "./Status.module.css"

export interface StatusProps {
  status?: "pending" | "success" | "error" | "fault"
  pendingTitle: string
  successTitle: string
  errorTitle: string
}

export function Status(props: StatusProps) {
  const { status } = props
  const { t } = useTranslation()

  const getIcon = (): ReactNode => {
    if (status === "pending")
      return <icons.Pending size={100} className={classes.loaderPending} />
    if (status === "success")
      return <icons.Success size={100} className={classes.iconSuccess} />
    if (status === "error")
      return <icons.Error size={100} className={classes.iconError} />
    if (status === "fault")
      return <icons.Fault size={100} className={classes.iconFault} />
    return null
  }

  const getTitle = (): string => {
    if (status === "pending") return props.pendingTitle
    if (status === "success") return props.successTitle
    if (status === "error") return props.errorTitle
    if (status === "fault") return t("Please try again later")
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
