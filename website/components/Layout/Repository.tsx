import { Trans } from "@lingui/react/macro"
import { Box, Button, Group, Tooltip } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import * as icons from "#icons.ts"
import * as settings from "#settings.ts"
import classes from "./Repository.module.css"

export function Repository(props: {
  fullWidth?: boolean
}) {
  return (
    <Tooltip
      openDelay={300}
      label={<Trans>View Repository</Trans>}
      position="left"
    >
      <Button
        component={Link}
        to="https://github.com/datisthq/dpkit"
        target="_blank"
        rel="noopener noreferrer"
        h={40}
        px={8}
        fullWidth={props.fullWidth}
        c="light-dark(black, var(--mantine-color-gray-3))"
        bg="light-dark(white, var(--mantine-color-dark-6))"
        variant="default"
        aria-label="View repository on GitHub"
      >
        <Group gap={4} wrap="nowrap">
          <icons.GitHub
            className={classes.icon}
            strokeWidth={settings.ICON_STROKE_WIDTH}
          />
          <Box mr={4} visibleFrom="xl">
            GitHub
          </Box>
          <Box
            visibleFrom="xl"
            style={{ display: "flex", alignItems: "center" }}
          >
            <icons.ExternalLink
              size={settings.ICON_SIZE_SMALL}
              strokeWidth={settings.ICON_STROKE_WIDTH}
            />
          </Box>
        </Group>
      </Button>
    </Tooltip>
  )
}
