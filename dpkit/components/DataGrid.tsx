import type { DataRecord, Schema } from "@dpkit/all"
import { inferSchemaFromSample } from "@dpkit/all"
import { Box, Text } from "ink"
import { DataFrame } from "nodejs-polars"
import React from "react"

// TODO: Autocalculate geometry (e.g. row height etc)

const MIN_COLUMN_WIDTH = 15
export type Order = { col: number; dir: "asc" | "desc" }

export function DataGrid(props: {
  records: DataRecord[]
  schema?: Schema
  col?: number
  order?: Order
  rowHeight?: number
  borderColor?: "green" | "red"
  withTypes?: boolean
}) {
  const { records, col, order, rowHeight, borderColor = "green" } = props
  const schema = props.schema ?? inferSchemaFromSample(DataFrame(records))

  const colWidth = Math.min(
    process.stdout.columns / schema.fields.length,
    MIN_COLUMN_WIDTH,
  )

  const tableWidth = schema.fields.length * colWidth
  const selectIndex = col ? col - 1 : -1
  const orderIndex = order?.col ? order?.col - 1 : -1
  const orderSign = order?.dir === "desc" ? " ▲" : " ▼"

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={borderColor}
      width={tableWidth}
    >
      <Box>
        {schema.fields.map((field, index) => (
          <Box
            key={field.name}
            width={colWidth}
            paddingLeft={1}
            justifyContent="center"
            backgroundColor={index === selectIndex ? "#777" : "#555"}
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
          {schema.fields.map((field, index) => (
            <Box
              key={field.name}
              width={colWidth}
              paddingLeft={1}
              justifyContent="center"
              backgroundColor={index === selectIndex ? "#777" : "#555"}
            >
              <Text>({field.type})</Text>
            </Box>
          ))}
        </Box>
      )}

      {records.map((record, rowIndex) => (
        <Box key={rowIndex}>
          {schema.fields.map((field, colIndex) => (
            <Box
              key={field.name}
              width={colWidth}
              paddingLeft={1}
              justifyContent="center"
              backgroundColor={
                rowIndex % 2 === 0
                  ? colIndex === selectIndex
                    ? "#555"
                    : "#333"
                  : colIndex === selectIndex
                    ? "#444"
                    : undefined
              }
              height={rowHeight}
              overflow="hidden"
            >
              <Text>{(record[field.name] ?? "").toString()}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
