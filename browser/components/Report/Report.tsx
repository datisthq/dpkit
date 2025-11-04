import type { UnboundError } from "@dpkit/lib"
import { Card, Divider, ScrollArea, Stack, Tabs } from "@mantine/core"
import { groupBy } from "es-toolkit"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { objectKeys } from "ts-extras"
import { Error } from "./Error/Error.tsx"

export function Report(props: {
  errors?: UnboundError[]
}) {
  const { t } = useTranslation()
  const { errors } = props

  const errorsByType = {
    all: errors ?? [],
    ...groupBy(errors ?? [], error => error.type),
  }

  const errorTypes = objectKeys(errorsByType)
  const [selectedType, setSelectedType] = useState<string>(
    errorTypes?.[0] ?? "all",
  )

  if (!errors?.length) {
    return null
  }

  return (
    <Tabs
      color="red"
      variant="pills"
      value={selectedType}
      onChange={value => setSelectedType(value ?? "all")}
    >
      <Stack gap="lg">
        <Divider label={t("Errors")} labelPosition="center" />
        <Tabs.List justify="left">
          {errorTypes.map(type => {
            return (
              <Tabs.Tab
                key={type}
                value={type}
                w={{ base: "100%", sm: "auto" }}
                fw={selectedType === type ? "bold" : "normal"}
                tt="uppercase"
              >
                {t(type as any)} ({errorsByType[type].length})
              </Tabs.Tab>
            )
          })}
        </Tabs.List>

        {errorTypes.map(type => {
          return (
            <Tabs.Panel key={type} value={type}>
              <ScrollArea>
                <Stack gap="md">
                  {errorsByType[type].map((error, index) => (
                    <Card
                      key={index}
                      style={{
                        backgroundColor:
                          "light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))",
                      }}
                    >
                      <Error error={error} />
                    </Card>
                  ))}
                </Stack>
              </ScrollArea>
            </Tabs.Panel>
          )
        })}
      </Stack>
    </Tabs>
  )
}
