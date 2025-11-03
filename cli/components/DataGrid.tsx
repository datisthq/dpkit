import type { DataRecord, Schema } from "@dpkit/lib"
import { inferSchemaFromSample } from "@dpkit/lib"
import { Box, Text } from "ink"
import * as pl from "nodejs-polars"
import React from "react"

// TODO: Autocalculate geometry (e.g. row height etc)

const MAX_COLUMNS = 10
const MIN_COLUMN_WIDTH = 15
export type Order = { col: number; dir: "asc" | "desc" }

export function DataGrid(props: {
  records: DataRecord[]
  schema?: Schema
  col?: number
  row?: number
  order?: Order
  rowHeight?: number
  borderColor?: "green" | "red"
  withTypes?: boolean
}) {
  const { records, col, row, order, rowHeight, borderColor = "green" } = props

  const schema = props.schema ?? inferSchemaFromSample(pl.DataFrame(records))
  const startCol = col ? Math.floor((col - 1) / MAX_COLUMNS) * MAX_COLUMNS : 0
  const fields = schema.fields.slice(startCol, startCol + MAX_COLUMNS)

  const colWidth = Math.min(
    process.stdout.columns / fields.length,
    MIN_COLUMN_WIDTH,
  )

  const tableWidth = fields.length * colWidth
  const selectColIndex = col ? col - 1 - startCol : -1
  const selectRowIndex = row ? row - 1 : -1
  const orderIndex = order?.col ? order.col - 1 - startCol : -1
  const orderSign = order?.dir === "desc" ? " ▼" : " ▲"

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={borderColor}
      borderLeftColor={startCol < 1 ? borderColor : "gray"}
      borderRightColor={
        startCol + MAX_COLUMNS >= schema.fields.length ? borderColor : "gray"
      }
      width={tableWidth}
    >
      <Box>
        {fields.map((field, index) => (
          <Box
            key={field.name}
            width={colWidth}
            paddingLeft={1}
            justifyContent="center"
            backgroundColor={index === selectColIndex ? "#777" : "#555"}
          >
            <Text bold>
              {field.name}
              {index === orderIndex ? orderSign : "  "}
            </Text>
          </Box>
        ))}
      </Box>

      {props.withTypes && (
        <Box>
          {fields.map((field, index) => (
            <Box
              key={field.name}
              width={colWidth}
              paddingLeft={1}
              justifyContent="center"
              backgroundColor={index === selectColIndex ? "#777" : "#555"}
            >
              <Text>({field.type})</Text>
            </Box>
          ))}
        </Box>
      )}

      {records.map((record, rowIndex) => (
        <Box key={rowIndex}>
          {fields.map((field, colIndex) => (
            <Box
              key={field.name}
              width={colWidth}
              paddingLeft={1}
              justifyContent="center"
              backgroundColor={
                rowIndex === selectRowIndex && colIndex === selectColIndex
                  ? "#888"
                  : rowIndex === selectRowIndex
                    ? rowIndex % 2 === 0
                      ? "#666"
                      : "#555"
                    : colIndex === selectColIndex
                      ? rowIndex % 2 === 0
                        ? "#555"
                        : "#444"
                      : rowIndex % 2 === 0
                        ? "#333"
                        : undefined
              }
              height={rowHeight}
              overflow="hidden"
            >
              <Text>{String(record[field.name])}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
