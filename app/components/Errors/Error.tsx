import { Button, Container, Group, Text, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import classes from "./Error.module.css"

export function Error(props: { code: number }) {
  const { code } = props
  const { t } = useTranslation()

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
        <Button size="md" component="a" variant="light" href="/">
          {t("Take me back to home page")}
        </Button>
      </Group>
    </Container>
  )
}
