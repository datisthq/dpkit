import { Box, Button, CloseButton, Stack, Tabs } from "@mantine/core"
import { FileInput, TextInput, Textarea } from "@mantine/core"
import { isJSONString, isNotEmpty, useForm } from "@mantine/form"
import { FileText, Globe, Upload } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import * as settings from "#settings.ts"
import { useValidatePackage } from "./queries.ts"

export function ValidatePackageForm() {
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
        <UrlForm />
      </Tabs.Panel>

      <Tabs.Panel value="file" pt="md">
        <FileForm />
      </Tabs.Panel>

      <Tabs.Panel value="text" pt="md">
        <TextForm />
      </Tabs.Panel>
    </Tabs>
  )
}

function UrlForm() {
  const validatePackage = useValidatePackage()

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
    validatePackage.mutate(form.values.url)
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

function FileForm() {
  const form = useForm({
    initialValues: {
      file: null as File | null,
    },
    validate: {
      file: isNotEmpty("File is required"),
    },
  })

  const handleSubmit = form.onSubmit(() => {
    console.log(form.values.file)
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

function TextForm() {
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
    console.log(form.values.text)
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
    >
      {t("Validate Data Package")}
    </Button>
  )
}
