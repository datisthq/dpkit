import { Trans } from "@lingui/react/macro"
import { Box, Button, Group, Tooltip } from "@mantine/core"
import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core"
import * as icons from "#icons.ts"
import * as settings from "#settings.ts"
import classes from "./Theme.module.css"

export function Theme(props: {
  fullWidth?: boolean
}) {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  })

  const handleToggle = () => {
    setColorScheme(computedColorScheme === "light" ? "dark" : "light")
  }

  return (
    <Tooltip
      openDelay={300}
      label={<Trans>Change Theme</Trans>}
      position="left"
    >
      <Button
        h={40}
        px={8}
        fullWidth={props.fullWidth}
        c="light-dark(black, var(--mantine-color-gray-3))"
        bg="light-dark(white, var(--mantine-color-dark-6))"
        variant="default"
        onClick={handleToggle}
        aria-label="Toggle color scheme"
      >
        <Group darkHidden gap={4} wrap="nowrap">
          <icons.LightTheme
            className={classes.icon}
            strokeWidth={settings.ICON_STROKE_WIDTH}
          />
          <Box mr={4} visibleFrom="xl">
            <Trans>Light</Trans>
          </Box>
        </Group>
        <Group lightHidden gap={4} wrap="nowrap">
          <icons.DarkTheme
            className={classes.icon}
            strokeWidth={settings.ICON_STROKE_WIDTH}
          />
          <Box mr={4} visibleFrom="xl">
            <Trans>Dark</Trans>
          </Box>
        </Group>
      </Button>
    </Tooltip>
  )
}
