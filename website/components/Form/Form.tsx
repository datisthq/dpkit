import { Trans, useLingui } from "@lingui/react/macro"
import { Box, Button, CloseButton, Stack, Tabs } from "@mantine/core"
import { FileInput, TextInput, Textarea } from "@mantine/core"
import { isJSONString, isNotEmpty, useForm } from "@mantine/form"
import { useState } from "react"
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
          <Trans>URL</Trans>
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
          <Trans>File</Trans>
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
          <Trans>Text</Trans>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="url" pt="md">
        <UrlForm onSubmit={props.onSubmit} />
      </Tabs.Panel>

      <Tabs.Panel value="file" pt="md">
        <FileForm onSubmit={props.onSubmit} />
      </Tabs.Panel>

      <Tabs.Panel value="text" pt="md">
        <JsonForm onSubmit={props.onSubmit} />
      </Tabs.Panel>
    </Tabs>
  )
}

function UrlForm(props: { onSubmit: (value: string) => void }) {
  const { t } = useLingui()
  const form = useForm({
    initialValues: {
      url: "",
    },
    validate: {
      url: value => {
        const notEmpty = isNotEmpty(t`URL is required`)(value)
        if (notEmpty) return notEmpty
        try {
          new URL(value)
          return null
        } catch {
          return t`Invalid URL format`
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
          placeholder={t`Enter data package URL`}
          size="lg"
          label={t`Data Package URL`}
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

function FileForm(props: { onSubmit: (value: File) => void }) {
  const { t } = useLingui()
  const form = useForm({
    initialValues: {
      file: null as File | null,
    },
    validate: {
      file: isNotEmpty(t`File is required`),
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
      form.setErrors({ file: t`Invalid JSON file` })
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <FileInput
          placeholder={t`Select data package file`}
          size="lg"
          label={t`Data Package File`}
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
  const { t } = useLingui()
  const form = useForm({
    initialValues: {
      text: "",
    },
    validate: {
      text: value => {
        const notEmpty = isNotEmpty(t`Text is required`)(value)
        if (notEmpty) return notEmpty
        return isJSONString(t`Invalid JSON format`)(value)
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
          placeholder={t`Paste data package JSON`}
          size="lg"
          label={t`Data Package JSON`}
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
  return (
    <Button
      type="submit"
      size="lg"
      variant={props.disabled ? "light" : "filled"}
      disabled={props.disabled}
    >
      <Trans>Validate Data Package</Trans>
    </Button>
  )
}
