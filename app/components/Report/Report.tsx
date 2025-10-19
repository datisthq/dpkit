import { Stack, Tabs, Text } from "@mantine/core"
import type { FileError, MetadataError, TableError } from "@dpkit/lib"
import { useMemo } from "react"

export function Report(props: {
  errors: (MetadataError | FileError | TableError)[]
}) {
  const errorsByType = useMemo(() => {
    const grouped: Record<string, (MetadataError | FileError | TableError)[]> =
      {}

    for (const error of props.errors) {
      const type = error.type
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(error)
    }

    return grouped
  }, [props.errors])

  const errorTypes = Object.keys(errorsByType)

  if (errorTypes.length === 0) {
    return null
  }

  return (
    <Tabs defaultValue={errorTypes[0]}>
      <Tabs.List>
        {errorTypes.map(type => (
          <Tabs.Tab key={type} value={type}>
            {type} ({errorsByType[type].length})
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {errorTypes.map(type => (
        <Tabs.Panel key={type} value={type} pt="md">
          <Stack gap="md">
            {errorsByType[type].map((error, index) => (
              <Text key={index}>{JSON.stringify(error, null, 2)}</Text>
            ))}
          </Stack>
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}
