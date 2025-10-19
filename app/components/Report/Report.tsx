import type { FileError, MetadataError, TableError } from "@dpkit/lib"
import { Badge, Stack, Tabs } from "@mantine/core"
import { capitalize, groupBy } from "es-toolkit"
import { objectKeys } from "ts-extras"
import { Error } from "./Error.tsx"

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
              <Badge color="red" variant="filled">
                {capitalize(type)} ({errorsByType[type].length})
              </Badge>
            </Tabs.Tab>
          )
        })}
      </Tabs.List>

      {errorTypes.map(type => {
        return (
          <Tabs.Panel key={type} value={type} pt="md">
            <Stack gap="md">
              {errorsByType[type].map((error, index) => (
                <Error key={index} error={error} />
              ))}
            </Stack>
          </Tabs.Panel>
        )
      })}
    </Tabs>
  )
}
