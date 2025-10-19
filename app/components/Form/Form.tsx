import { Box, Button, CloseButton, Stack, Tabs } from "@mantine/core"
import { FileInput, TextInput, Textarea } from "@mantine/core"
import { isJSONString, isNotEmpty, useForm } from "@mantine/form"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import * as icons from "#icons.ts"
import * as settings from "#settings.ts"

export interface FormProps {
  onSubmit: (value: string | File | Record<string, any>) => void
}

export function Form(props: FormProps) {
  const [activeTab, setActiveTab] = useState<string | null>("url")

  return (
    <Tabs defaultValue="url" value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab
          value="url"
          leftSection={
            <icons.Url
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
            <icons.File
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
            <icons.Text
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
        <TextForm onSubmit={props.onSubmit} />
      </Tabs.Panel>

      <Tabs.Panel value="text" pt="md">
        <JsonForm onSubmit={props.onSubmit} />
      </Tabs.Panel>
    </Tabs>
  )
}

function UrlForm(props: { onSubmit: (value: string) => void }) {
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
    props.onSubmit(form.values.url)
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          placeholder="Enter data package URL"
          size="lg"
          label="Data Package URL"
          rightSection={
            <CloseButton
              onClick={() => form.setFieldValue("url", "")}
              disabled={!form.values.url}
            />
          }
          {...form.getInputProps("url")}
        />
        <SubmitButton disabled={!form.values.url} />
      </Stack>
    </form>
  )
}

function TextForm(props: { onSubmit: (value: File) => void }) {
  const form = useForm({
    initialValues: {
      file: null as File | null,
    },
    validate: {
      file: isNotEmpty("File is required"),
    },
  })

  const handleSubmit = form.onSubmit(async () => {
    const file = form.values.file
    if (!file) return

    try {
      const text = await file.text()
      const json = JSON.parse(text)
      props.onSubmit(json)
    } catch (err) {
      form.setErrors({ file: "Invalid JSON file" })
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <FileInput
          placeholder="Select data package file"
          size="lg"
          label="Data Package File"
          rightSection={
            <CloseButton
              onClick={() => form.setFieldValue("file", null)}
              disabled={!form.values.file}
            />
          }
          {...form.getInputProps("file")}
        />
        <SubmitButton disabled={!form.values.file} />
      </Stack>
    </form>
  )
}

function JsonForm(props: { onSubmit: (value: Record<string, any>) => void }) {
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
    const parsed = JSON.parse(form.values.text)
    props.onSubmit(parsed)
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
          rightSection={
            <Box mt="xs" style={{ alignSelf: "flex-start" }}>
              <CloseButton
                onClick={() => form.setFieldValue("text", "")}
                disabled={!form.values.text}
              />
            </Box>
          }
          {...form.getInputProps("text")}
        />
        <SubmitButton disabled={!form.values.text} />
      </Stack>
    </form>
  )
}

function SubmitButton(props: { disabled: boolean }) {
  const { t } = useTranslation()

  return (
    <Button
      type="submit"
      size="lg"
      variant={props.disabled ? "light" : "filled"}
      disabled={props.disabled}
    >
      {t("Validate Data Package")}
    </Button>
  )
}
