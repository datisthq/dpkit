import { Button, Container, Group, Text, Title } from "@mantine/core"
import { useLocation } from "react-router"
import { arrayIncludes } from "ts-extras"
import { objectKeys } from "ts-extras"
import { LanguageIdDefault, Languages } from "#constants/language.ts"
import { makeLink } from "#helpers/link.ts"
import { i18n } from "#i18n.ts"
import classes from "./Error.module.css"

export function Error(props: { code: number }) {
  const { code } = props
  const location = useLocation()

  const languageId = extractLanguageId(location.pathname)
  const t = i18n.getFixedT(languageId)

  const title = code === 404 ? t("Page not found") : t("Something went wrong")
  const text = code === 404 ? t("error404") : t("error500")

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
          {t("Take me back to home page")}
        </Button>
      </Group>
    </Container>
  )
}

function extractLanguageId(path: string) {
  const possibleLanguageId = path.split("/")[1]

  const languageId = arrayIncludes(objectKeys(Languages), possibleLanguageId)
    ? possibleLanguageId
    : LanguageIdDefault

  return languageId
}
