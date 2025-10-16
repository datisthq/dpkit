import { Group, ThemeIcon } from "@mantine/core"
import { Title } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function DialogTitle(props: { title: string; Icon: any }) {
  const { t } = useTranslation()

  return (
    <Group gap={5} align="center">
      <ThemeIcon size="sm" variant="transparent" c="light-dark(black, white)">
        <props.Icon />
      </ThemeIcon>{" "}
      <Title order={4} c="light-dark(black, white)">
        {t(props.title as any)}
      </Title>
    </Group>
  )
}
