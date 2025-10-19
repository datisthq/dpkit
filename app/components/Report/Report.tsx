import type { FileError, MetadataError, TableError } from "@dpkit/lib"
import { Stack, Tabs, Text } from "@mantine/core"
import { capitalize } from "es-toolkit"
import { groupBy } from "es-toolkit"
import { objectKeys } from "ts-extras"

export function Report(props: {
  errors: (MetadataError | FileError | TableError)[]
}) {
  const errorsByType = groupBy(props.errors, error => error.type)
  const errorTypes = objectKeys(errorsByType)

  if (errorTypes.length === 0) {
    return null
  }

  return (
    <Tabs color="red" defaultValue={errorTypes[0]}>
      <Tabs.List>
        {errorTypes.map(type => {
          return (
            <Tabs.Tab key={type} value={type}>
              {capitalize(type)} ({errorsByType[type].length})
            </Tabs.Tab>
          )
        })}
      </Tabs.List>

      {errorTypes.map(type => {
        return (
          <Tabs.Panel key={type} value={type} pt="md">
            <Stack gap="md">
              {errorsByType[type].map((error, index) => (
                <Text key={index}>{JSON.stringify(error, null, 2)}</Text>
              ))}
            </Stack>
          </Tabs.Panel>
        )
      })}
    </Tabs>
  )
}
