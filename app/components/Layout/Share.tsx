import { Box, Group, Menu, Tooltip, UnstyledButton } from "@mantine/core"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share"
import * as icons from "#icons.ts"
import * as settings from "#settings.ts"
import classes from "./Share.module.css"

const SHARE_PROVIDERS = [
  {
    name: "Facebook",
    icon: FacebookIcon,
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Twitter",
    icon: TwitterIcon,
    getUrl: (url: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    icon: WhatsappIcon,
    getUrl: (url: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: TelegramIcon,
    getUrl: (url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    icon: RedditIcon,
    getUrl: (url: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Email",
    icon: EmailIcon,
    getUrl: (url: string) => `mailto:?body=${encodeURIComponent(url)}`,
  },
]

export function Share(props: { fullWidth?: boolean }) {
  const { t } = useTranslation()
  const [opened, setOpened] = useState(false)

  const items = SHARE_PROVIDERS.map(provider => {
    const Icon = provider.icon
    return (
      <Menu.Item
        fz="sm"
        key={provider.name}
        onClick={() => {
          const currentUrl = globalThis.location?.href || ""
          const shareUrl = provider.getUrl(currentUrl)
          globalThis.open(shareUrl, "_blank", "noopener,noreferrer")
        }}
        leftSection={<Icon size={settings.ICON_SIZE} round />}
      >
        {provider.name}
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
        <Tooltip openDelay={300} label={t("Share")} position="bottom">
          <UnstyledButton
            w={props.fullWidth ? "100%" : undefined}
            className={classes.control}
            data-expanded={opened || undefined}
          >
            <Group gap={4} wrap="nowrap" w="100%" justify="center">
              <icons.Share strokeWidth={settings.ICON_STROKE_WIDTH} />
              <Box className={classes.label} visibleFrom="xl">
                {t("Share")}
              </Box>
            </Group>
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  )
}
