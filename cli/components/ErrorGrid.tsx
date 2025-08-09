import type { TableError } from "dpkit"
import { Box } from "ink"
import SelectInput from "ink-select-input"
import { DataFrame } from "nodejs-polars"
import { useState } from "react"
import React from "react"
import { objectKeys } from "ts-extras"
import { TableGrid } from "./TableGrid.tsx"

export function ErrorGrid(props: { errors: TableError[] }) {
  const { errors } = props
  const [errorType, setErrorType] = useState<string>(errors[0]?.type ?? "")

  const errorsByType = Object.groupBy(errors, error => error.type)
  // @ts-ignore
  const selectErrors = errorsByType[errorType]

  const table = DataFrame(selectErrors).lazy()

  const handleSelect = async (item: any) => {
    setErrorType(item.value)
  }

  return (
    <Box>
      <Box padding={1}>
        <SelectInput
          onSelect={handleSelect}
          items={objectKeys(errorsByType).map(type => ({
            label: type,
            value: type,
          }))}
        />
      </Box>
      <TableGrid table={table} />
    </Box>
  )
}
