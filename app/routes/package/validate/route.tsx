import { Button, FileInput, Stack, Tabs, Textarea, TextInput } from "@mantine/core"
import { Globe, Upload, FileText } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Drawer } from "vaul"
import * as settings from "#settings.ts"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "packageValidate", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string | null>("url")
  const [urlValue, setUrlValue] = useState("")
  const [fileValue, setFileValue] = useState<File | null>(null)
  const [textValue, setTextValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const isDisabled =
    (activeTab === "url" && !urlValue) ||
    (activeTab === "file" && !fileValue) ||
    (activeTab === "text" && !textValue)

  const handleValidate = () => {
    setIsOpen(true)
  }

  return (
    <>
      <Stack gap="xl" w="100%">
        <Tabs defaultValue="url" w="100%" value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab
            value="url"
            leftSection={
              <Globe size={settings.ICON_SIZE} strokeWidth={settings.ICON_STROKE_WIDTH} />
            }
          >
            URL
          </Tabs.Tab>
          <Tabs.Tab
            value="file"
            leftSection={
              <Upload size={settings.ICON_SIZE} strokeWidth={settings.ICON_STROKE_WIDTH} />
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
              value={urlValue}
              onChange={(event) => setUrlValue(event.currentTarget.value)}
            />
            <Button size="lg" disabled={isDisabled} onClick={handleValidate}>
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
              value={fileValue}
              onChange={setFileValue}
            />
            <Button size="lg" disabled={isDisabled} onClick={handleValidate}>
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
              minRows={10}
              value={textValue}
              onChange={(event) => setTextValue(event.currentTarget.value)}
            />
            <Button size="lg" disabled={isDisabled} onClick={handleValidate}>
              {t("Validate Data Package")}
            </Button>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>

    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
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
          <div style={{
            width: "40px",
            height: "5px",
            backgroundColor: "#d1d5db",
            borderRadius: "9999px",
            margin: "8px auto 16px"
          }} />
          <Drawer.Title style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
            Validation Results
          </Drawer.Title>
          <Drawer.Description style={{ marginBottom: "16px" }}>
            Data package validation in progress...
          </Drawer.Description>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  </>
  )
}
