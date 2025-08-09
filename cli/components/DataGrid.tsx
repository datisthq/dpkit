import { Box, Text } from "ink"
import React from "react"

const MIN_COLUMN_WIDTH = 15

export function DataGrid(props: {
  data: Record<string, any>[]
}) {
  const { data } = props

  const colNames = Object.keys(data[0] ?? {})
  const colWidth = Math.min(
    process.stdout.columns / colNames.length,
    MIN_COLUMN_WIDTH,
  )

  const tableWidth = colNames.length * colWidth

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="green"
      width={tableWidth}
    >
      <Box paddingRight={1}>
        {colNames.map(name => (
          <Box
            key={name}
            width={colWidth}
            paddingLeft={1}
            justifyContent="center"
            backgroundColor="#555"
          >
            <Text bold>{name}</Text>
          </Box>
        ))}
      </Box>

      {data.map((row, index) => (
        <Box key={index} paddingRight={1}>
          {colNames.map(name => (
            <Box
              key={name}
              width={colWidth}
              paddingLeft={1}
              justifyContent="center"
              backgroundColor={index % 2 === 0 ? "#333" : undefined}
              height={2}
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
