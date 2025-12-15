import { Trans } from "@lingui/react/macro"
import { Box, Group, Menu, Tooltip, UnstyledButton } from "@mantine/core"
import { Center } from "@mantine/core"
import { useState } from "react"
import * as share from "react-share"
import * as icons from "#icons.ts"
import * as settings from "#settings.ts"
import classes from "./Share.module.css"

export function Share(props: { fullWidth?: boolean }) {
  const [opened, setOpened] = useState(false)

  const currentUrl = globalThis.location?.href || ""
  const items = SHARE_PROVIDERS.map(provider => {
    const Component = provider.component
    return (
      <Menu.Item fz="sm" key={provider.name}>
        <Component url={currentUrl} />
      </Menu.Item>
    )
  })

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      withinPortal
      shadow="sm"
    >
      <Menu.Target>
        <Tooltip
          openDelay={300}
          label={<Trans>Share Page</Trans>}
          position="left"
        >
          <UnstyledButton
            w={props.fullWidth ? "100%" : undefined}
            className={classes.control}
            data-expanded={opened || undefined}
          >
            <Group gap={4} wrap="nowrap" w="100%" justify="center">
              <icons.Share strokeWidth={settings.ICON_STROKE_WIDTH} />
              <Box className={classes.label} visibleFrom="xl">
                <Trans>Share</Trans>
              </Box>
            </Group>
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  )
}

function Facebook(props: { url: string }) {
  return (
    <share.FacebookShareButton
      url={props.url}
      style={{ all: "unset", cursor: "pointer" }}
    >
      <Center>
        <share.FacebookIcon
          size={settings.ICON_SIZE}
          round
          style={{ marginRight: 8 }}
        />
        Facebook
      </Center>
    </share.FacebookShareButton>
  )
}

function Twitter(props: { url: string }) {
  return (
    <share.TwitterShareButton
      url={props.url}
      style={{ all: "unset", cursor: "pointer" }}
    >
      <Center>
        <share.TwitterIcon
          size={settings.ICON_SIZE}
          round
          style={{ marginRight: 8 }}
        />
        Twitter
      </Center>
    </share.TwitterShareButton>
  )
}

function LinkedIn(props: { url: string }) {
  return (
    <share.LinkedinShareButton
      url={props.url}
      style={{ all: "unset", cursor: "pointer" }}
    >
      <Center>
        <share.LinkedinIcon
          size={settings.ICON_SIZE}
          round
          style={{ marginRight: 8 }}
        />
        LinkedIn
      </Center>
    </share.LinkedinShareButton>
  )
}

function WhatsApp(props: { url: string }) {
  return (
    <share.WhatsappShareButton
      url={props.url}
      style={{ all: "unset", cursor: "pointer" }}
    >
      <Center>
        <share.WhatsappIcon
          size={settings.ICON_SIZE}
          round
          style={{ marginRight: 8 }}
        />
        WhatsApp
      </Center>
    </share.WhatsappShareButton>
  )
}

function Telegram(props: { url: string }) {
  return (
    <share.TelegramShareButton
      url={props.url}
      style={{ all: "unset", cursor: "pointer" }}
    >
      <Center>
        <share.TelegramIcon
          size={settings.ICON_SIZE}
          round
          style={{ marginRight: 8 }}
        />
        Telegram
      </Center>
    </share.TelegramShareButton>
  )
}

function Reddit(props: { url: string }) {
  return (
    <share.RedditShareButton
      url={props.url}
      style={{ all: "unset", cursor: "pointer" }}
    >
      <Center>
        <share.RedditIcon
          size={settings.ICON_SIZE}
          round
          style={{ marginRight: 8 }}
        />
        Reddit
      </Center>
    </share.RedditShareButton>
  )
}

function Email(props: { url: string }) {
  return (
    <share.EmailShareButton
      url={props.url}
      style={{ all: "unset", cursor: "pointer" }}
    >
      <Center>
        <share.EmailIcon
          size={settings.ICON_SIZE}
          round
          style={{ marginRight: 8 }}
        />
        Email
      </Center>
    </share.EmailShareButton>
  )
}

const SHARE_PROVIDERS = [
  { name: "Facebook", component: Facebook },
  { name: "Twitter", component: Twitter },
  { name: "LinkedIn", component: LinkedIn },
  { name: "WhatsApp", component: WhatsApp },
  { name: "Telegram", component: Telegram },
  { name: "Reddit", component: Reddit },
  { name: "Email", component: Email },
]
