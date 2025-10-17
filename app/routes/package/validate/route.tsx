import { Box, Button, Container, Stack, Tabs, Text, Title } from "@mantine/core"
import { FileInput, TextInput, Textarea } from "@mantine/core"
import { isJSONString, isNotEmpty, useForm } from "@mantine/form"
import { FileText, Globe, Upload } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Drawer } from "vaul"
import { usePayload } from "#components/System/index.ts"
import { Pages } from "#constants/page.ts"
import { createPayload } from "#payload.ts"
import * as settings from "#settings.ts"
import type { Route } from "./+types/route.tsx"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "packageValidate", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  const { t } = useTranslation()
  const { languageId } = usePayload()
  const [activeTab, setActiveTab] = useState<string | null>("url")
  const [isOpen, setIsOpen] = useState(false)

  const page = Pages.packageValidate

  const form = useForm({
    initialValues: {
      url: "",
      file: null as File | null,
      text: "",
    },
    validate: {
      url: value => {
        if (activeTab !== "url") return null
        const notEmpty = isNotEmpty("URL is required")(value)
        if (notEmpty) return notEmpty
        try {
          new URL(value)
          return null
        } catch {
          return "Invalid URL format"
        }
      },
      file: value => {
        if (activeTab === "file") {
          return isNotEmpty("File is required")(value)
        }
        return null
      },
      text: value => {
        if (activeTab !== "text") return null
        const notEmpty = isNotEmpty("Text is required")(value)
        if (notEmpty) return notEmpty
        return isJSONString("Invalid JSON format")(value)
      },
    },
  })

  const isDisabled =
    (activeTab === "url" && !form.values.url) ||
    (activeTab === "file" && !form.values.file) ||
    (activeTab === "text" && !form.values.text)

  const handleSubmit = form.onSubmit(values => {
    console.log(values)
    setIsOpen(true)
  })

  return (
    <Box>
      <Stack gap="md">
        <Title order={1}>{page.title[languageId]}</Title>
        <Text size="lg">{page.description[languageId]}</Text>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="url" value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab
                value="url"
                leftSection={
                  <Globe
                    size={settings.ICON_SIZE}
                    strokeWidth={settings.ICON_STROKE_WIDTH}
                  />
                }
              >
                URL
              </Tabs.Tab>
              <Tabs.Tab
                value="file"
                leftSection={
                  <Upload
                    size={settings.ICON_SIZE}
                    strokeWidth={settings.ICON_STROKE_WIDTH}
                  />
                }
              >
                File
              </Tabs.Tab>
              <Tabs.Tab
                value="text"
                leftSection={
                  <FileText
                    size={settings.ICON_SIZE}
                    strokeWidth={settings.ICON_STROKE_WIDTH}
                  />
                }
              >
                Text
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="url" pt="md">
              <Stack gap="md">
                <TextInput
                  placeholder="Enter data package URL"
                  size="lg"
                  label="Data Package URL"
                  {...form.getInputProps("url")}
                />
                <Button type="submit" size="lg" disabled={isDisabled}>
                  {t("Validate Data Package")}
                </Button>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="file" pt="md">
              <Stack gap="md">
                <FileInput
                  placeholder="Select data package file"
                  size="lg"
                  label="Data Package File"
                  {...form.getInputProps("file")}
                />
                <Button type="submit" size="lg" disabled={isDisabled}>
                  {t("Validate Data Package")}
                </Button>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="text" pt="md">
              <Stack gap="md">
                <Textarea
                  placeholder="Paste data package JSON"
                  size="lg"
                  label="Data Package JSON"
                  autosize
                  minRows={5}
                  {...form.getInputProps("text")}
                />
                <Button type="submit" size="lg" disabled={isDisabled}>
                  {t("Validate Data Package")}
                </Button>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </form>
      </Stack>

      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
          <Drawer.Overlay
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />
          <Drawer.Content
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              backgroundColor: "white",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              padding: "16px",
            }}
          >
            <Container size="lg">
              <div
                style={{
                  width: "40px",
                  height: "5px",
                  backgroundColor: "#d1d5db",
                  borderRadius: "9999px",
                  margin: "8px auto 16px",
                }}
              />
              <Drawer.Title
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                Validation Results
              </Drawer.Title>
              <Drawer.Description style={{ marginBottom: "16px" }}>
                Data package validation in progress...
              </Drawer.Description>
            </Container>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Box>
  )
}
