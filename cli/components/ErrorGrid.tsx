import type { TableError } from "dpkit"
import { Box, Text } from "ink"
import { DataFrame } from "nodejs-polars"
import React from "react"
import { objectEntries } from "ts-extras"
import { TableGrid } from "./TableGrid.tsx"

export function ErrorGrid(props: { errors: TableError[] }) {
  const { errors } = props

  const errorsByType = Object.groupBy(errors, error => error.type)
  const selectErrors = errorsByType["cell/type"]

  if (!selectErrors) {
    return null
  }

  const table = DataFrame(selectErrors).lazy()

  return (
    <Box>
      <Box width={20}>
        {objectEntries(errorsByType).map(([type, errors]) => (
          <Box key={type}>
            <Text bold>{type}</Text>
            <Text dimColor>{errors.length}</Text>
          </Box>
        ))}
      </Box>
      <TableGrid table={table} />
    </Box>
  )
}
