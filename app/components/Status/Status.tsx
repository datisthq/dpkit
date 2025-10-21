import { Center, Flex } from "@mantine/core"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Error, Pending, Starting, Success } from "#icons.ts"
import classes from "./Status.module.css"

export interface StatusProps {
  status?: "pending" | "success" | "error"
  pendingTitle: string
  successTitle: string
  errorTitle: string
}

export function Status(props: StatusProps) {
  const { t } = useTranslation()
  const [isStarting, setIsStarting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarting(false)
    }, 3_000)
    return () => clearTimeout(timer)
  }, [])

  const status =
    props.status === "pending" && isStarting ? "starting" : props.status

  const getIcon = (): ReactNode => {
    if (status === "starting")
      return <Starting size={100} className={classes.loaderStarting} />
    if (status === "pending")
      return <Pending size={100} className={classes.loaderPending} />
    if (status === "success")
      return <Success size={100} className={classes.iconSuccess} />
    if (status === "error")
      return <Error size={100} className={classes.iconError} />
    return null
  }

  const getTitle = (): string => {
    if (status === "starting") return t("Starting private container...")
    if (status === "pending") return props.pendingTitle
    if (status === "success") return props.successTitle
    if (status === "error") return props.errorTitle
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
