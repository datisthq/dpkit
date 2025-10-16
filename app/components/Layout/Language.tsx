import { Box, Group, Menu, Tooltip, UnstyledButton } from "@mantine/core"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { usePayload } from "#components/System/index.ts"
import { useMakeLink } from "#components/System/index.ts"
import { Languages } from "#constants/language.ts"
import * as icons from "#icons.ts"
import type { LanguageId } from "#types/index.ts"
import classes from "./Language.module.css"

export function Language(props: { fullWidth?: boolean }) {
  const { t } = useTranslation()
  const payload = usePayload()
  const makeLink = useMakeLink()

  const [opened, setOpened] = useState(false)
  const [selected, setSelected] = useState(payload.language)

  const items = Object.values(Languages).map(item => (
    <Menu.Item
      fz="sm"
      key={item.languageId}
      onClick={() => {
        if (selected.languageId === item.languageId) return
        onLanguageChange(item.languageId)
        setSelected(item)
      }}
    >
      {item.title}
    </Menu.Item>
  ))

  const onLanguageChange = (languageId: LanguageId) => {
    const location = globalThis.location
    if (location) {
      // We intentionally do not use client-side routing here
      location.href = makeLink({ languageId })
    }
  }

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      withinPortal
      shadow="sm"
    >
      <Menu.Target>
        <Tooltip openDelay={300} label={t("Change Language")} position="left">
          <UnstyledButton
            w={props.fullWidth ? "100%" : undefined}
            className={classes.control}
            data-expanded={opened || undefined}
          >
            <Group gap={4} wrap="nowrap" w="100%" justify="center">
              <icons.Language strokeWidth={1.5} />
              <Box className={classes.label} visibleFrom="md">
                {selected.title}
              </Box>
            </Group>
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  )
}
