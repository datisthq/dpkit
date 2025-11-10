import { useLingui } from "@lingui/react/macro"
import { Button, Container, Group, Text, Title } from "@mantine/core"
import { useLocation } from "react-router"
import { makeLink } from "#helpers/link.ts"
import { detectLanguageIdFromPath } from "#helpers/locale.ts"
import classes from "./Error.module.css"

export function Error(props: { code: number }) {
  const { code } = props
  const { t } = useLingui()

  const location = useLocation()
  const languageId = detectLanguageIdFromPath(location.pathname)

  const title = code === 404 ? t`Page not found` : t`Something went wrong`
  const text = code === 404 ? t`error404` : t`error500`

  return (
    <Container className={classes.container}>
      <div className={classes.label}>{code}</div>
      <Title className={classes.title}>{title}</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        {text}
      </Text>
      <Group justify="center">
        <Button
          size="md"
          component="a"
          variant="light"
          href={makeLink({ languageId, pageId: "home" })}
        >
          {t`Take me back to home page`}
        </Button>
      </Group>
    </Container>
  )
}
