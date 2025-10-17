import { Button, Stack, Tabs } from "@mantine/core"
import { FileInput, TextInput, Textarea } from "@mantine/core"
import { isJSONString, isNotEmpty, useForm } from "@mantine/form"
import { FileText, Globe, Upload } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import * as settings from "#settings.ts"

export function Form(props: { onSubmit: () => void }) {
  const [activeTab, setActiveTab] = useState<string | null>("url")

  return (
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
        <UrlForm onSubmit={props.onSubmit} />
      </Tabs.Panel>

      <Tabs.Panel value="file" pt="md">
        <FileForm onSubmit={props.onSubmit} />
      </Tabs.Panel>

      <Tabs.Panel value="text" pt="md">
        <TextForm onSubmit={props.onSubmit} />
      </Tabs.Panel>
    </Tabs>
  )
}

function UrlForm(props: { onSubmit: () => void }) {
  const { t } = useTranslation()

  const form = useForm({
    initialValues: {
      url: "",
    },
    validate: {
      url: value => {
        const notEmpty = isNotEmpty("URL is required")(value)
        if (notEmpty) return notEmpty
        try {
          new URL(value)
          return null
        } catch {
          return "Invalid URL format"
        }
      },
    },
  })

  const handleSubmit = form.onSubmit(() => {
    props.onSubmit()
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          placeholder="Enter data package URL"
          size="lg"
          label="Data Package URL"
          {...form.getInputProps("url")}
        />
        <Button type="submit" size="lg">
          {t("Validate Data Package")}
        </Button>
      </Stack>
    </form>
  )
}

function FileForm(props: { onSubmit: () => void }) {
  const { t } = useTranslation()

  const form = useForm({
    initialValues: {
      file: null as File | null,
    },
    validate: {
      file: isNotEmpty("File is required"),
    },
  })

  const handleSubmit = form.onSubmit(() => {
    props.onSubmit()
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <FileInput
          placeholder="Select data package file"
          size="lg"
          label="Data Package File"
          {...form.getInputProps("file")}
        />
        <Button type="submit" size="lg">
          {t("Validate Data Package")}
        </Button>
      </Stack>
    </form>
  )
}

function TextForm(props: { onSubmit: () => void }) {
  const { t } = useTranslation()

  const form = useForm({
    initialValues: {
      text: "",
    },
    validate: {
      text: value => {
        const notEmpty = isNotEmpty("Text is required")(value)
        if (notEmpty) return notEmpty
        return isJSONString("Invalid JSON format")(value)
      },
    },
  })

  const handleSubmit = form.onSubmit(() => {
    props.onSubmit()
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Textarea
          placeholder="Paste data package JSON"
          size="lg"
          label="Data Package JSON"
          autosize
          minRows={5}
          {...form.getInputProps("text")}
        />
        <Button type="submit" size="lg">
          {t("Validate Data Package")}
        </Button>
      </Stack>
    </form>
  )
}
