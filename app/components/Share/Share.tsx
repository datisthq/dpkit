import { Box, Button, Group, LoadingOverlay } from "@mantine/core"
import { Divider, SimpleGrid, Stack, Text, TextInput } from "@mantine/core"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import * as share from "react-share"
import { useSharePage } from "./queries.ts"

export function ShareDialog() {
  const { t } = useTranslation()
  const sharePage = useSharePage()
  const url = sharePage.data ?? ""

  useEffect(() => {
    sharePage.mutate()
  }, [])

  return (
    <Stack p={{ xs: "sm", md: "lg" }} gap="lg" pos="relative">
      <LoadingOverlay visible={!url} />
      <Box>
        <Text c="dimmed" maw={400}>
          {t("The page will persist all the selected filters if any")}.{" "}
          {t("Just share the link or use the buttons below")}.
        </Text>
      </Box>
      <Divider />
      <TextInput value={url} readOnly />
      <Button variant="filled" color="green">
        {t("Copied to clipboard")}!
      </Button>
      <Divider />
      <SimpleGrid cols={2}>
        <Facebook url={url} />
        <Twitter url={url} />
        <Whatsapp url={url} />
        <Telegram url={url} />
        <Linkedin url={url} />
        <Reddit url={url} />
        <Pinterest url={url} />
        <Email url={url} />
      </SimpleGrid>
    </Stack>
  )
}

function Facebook(props: { url: string }) {
  return (
    <share.FacebookShareButton url={props.url}>
      <Group>
        <share.FacebookIcon size={24} round />
        Facebook
      </Group>
    </share.FacebookShareButton>
  )
}

function Twitter(props: { url: string }) {
  return (
    <share.TwitterShareButton url={props.url}>
      <Group>
        <share.TwitterIcon size={24} round />
        Twitter
      </Group>
    </share.TwitterShareButton>
  )
}

function Whatsapp(props: { url: string }) {
  return (
    <share.WhatsappShareButton url={props.url}>
      <Group>
        <share.WhatsappIcon size={24} round />
        WhatsApp
      </Group>
    </share.WhatsappShareButton>
  )
}

function Telegram(props: { url: string }) {
  return (
    <share.TelegramShareButton url={props.url}>
      <Group>
        <share.TelegramIcon size={24} round />
        Telegram
      </Group>
    </share.TelegramShareButton>
  )
}

function Linkedin(props: { url: string }) {
  return (
    <share.LinkedinShareButton url={props.url}>
      <Group>
        <share.LinkedinIcon size={24} round />
        LinkedIn
      </Group>
    </share.LinkedinShareButton>
  )
}

function Reddit(props: { url: string }) {
  return (
    <share.RedditShareButton url={props.url}>
      <Group>
        <share.RedditIcon size={24} round />
        Reddit
      </Group>
    </share.RedditShareButton>
  )
}

function Pinterest(props: { url: string }) {
  return (
    <share.PinterestShareButton
      url={props.url}
      media="https://mycarro.app/favicon.png"
    >
      <Group>
        <share.PinterestIcon size={24} round />
        Pinterest
      </Group>
    </share.PinterestShareButton>
  )
}

function Email(props: { url: string }) {
  return (
    <share.EmailShareButton url={props.url}>
      <Group>
        <share.EmailIcon size={24} round />
        Email
      </Group>
    </share.EmailShareButton>
  )
}
