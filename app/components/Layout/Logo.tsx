import { Anchor, Group, ThemeIcon, Title } from "@mantine/core"
import { useNavigation } from "react-router"
// @ts-ignore
import LogoIcon from "#assets/logo.svg?react"
import { Link } from "#components/Link/index.ts"
import * as icons from "#icons.ts"
import classes from "./Logo.module.css"

export function Logo(props: {
  title?: string
  Icon?: any
  to?: string
}) {
  const navigation = useNavigation()
  const isProgress = navigation?.state === "loading"

  const to = props.to ?? "https://dpkit.dev"
  const title = props.title ?? "dpkit"
  const Icon = isProgress ? icons.Loader : props.Icon || LogoIcon
  const iconClassName = isProgress ? classes.loader : undefined

  const PlainLogo = () => {
    return (
      <Group h="100%" wrap="nowrap" gap={5}>
        <ThemeIcon variant="transparent" size="lg">
          <Icon className={iconClassName} />
        </ThemeIcon>
        <Title
          lh={1}
          lineClamp={2}
          order={3}
          className={classes.title}
          td="underline"
        >
          {title}
        </Title>
      </Group>
    )
  }

  return (
    <Anchor
      to={to}
      component={Link}
      className={classes.color}
      underline="never"
    >
      <PlainLogo />
    </Anchor>
  )
}
