import { Box, Text } from "ink"
import React from "react"

const MIN_COLUMN_WIDTH = 15
export type Order = { col: number; dir: "asc" | "desc" }

export function DataGrid(props: {
  data: Record<string, any>[]
  col?: number
  order?: Order
  rowHeight?: number
}) {
  const { data, col, order, rowHeight } = props

  const colNames = Object.keys(data[0] ?? {})
  const colWidth = Math.min(
    process.stdout.columns / colNames.length,
    MIN_COLUMN_WIDTH,
  )

  const tableWidth = colNames.length * colWidth

  const selectIndex = col ? col - 1 : -1
  const orderIndex = order?.col ? order?.col - 1 : -1
  const orderSign = order?.dir === "desc" ? " ▲" : " ▼"

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="green"
      width={tableWidth}
    >
      <Box>
        {colNames.map((name, index) => (
          <Box
            key={name}
            width={colWidth}
            paddingLeft={1}
            justifyContent="center"
            backgroundColor={index === selectIndex ? "#777" : "#555"}
          >
            <Text bold>
              {name}
              {index === orderIndex ? orderSign : "  "}
            </Text>
          </Box>
        ))}
      </Box>

      {data.map((row, rowIndex) => (
        <Box key={rowIndex}>
          {colNames.map((name, index) => (
            <Box
              key={name}
              width={colWidth}
              paddingLeft={1}
              justifyContent="center"
              backgroundColor={
                rowIndex % 2 === 0
                  ? index === selectIndex
                    ? "#555"
                    : "#333"
                  : index === selectIndex
                    ? "#444"
                    : undefined
              }
              height={rowHeight}
              overflow="hidden"
            >
              <Text>{(row[name] ?? "").toString()}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
