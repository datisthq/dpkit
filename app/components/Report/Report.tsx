import type { FileError, MetadataError, TableError } from "@dpkit/lib"
import { Card, Divider, ScrollArea, Stack, Tabs } from "@mantine/core"
import { groupBy } from "es-toolkit"
import { useState } from "react"
import { objectKeys } from "ts-extras"
import { Error } from "./Error/Error.tsx"

export function Report(props: {
  errors?: (MetadataError | FileError | TableError)[]
}) {
  const errorsByType = groupBy(props.errors ?? [], error => error.type)
  const errorTypes = objectKeys(errorsByType)

  const [selectedType, setSelectedType] = useState<string | null>(
    errorTypes?.[0] ?? null,
  )

  if (errorTypes.length === 0) {
    return null
  }

  return (
    <Tabs
      color="red"
      variant="pills"
      value={selectedType ?? errorTypes[0]}
      onChange={setSelectedType}
    >
      <Stack gap="lg">
        <Divider label="Errors" labelPosition="center" />
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
                {type} ({errorsByType[type].length})
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
