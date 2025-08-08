import { Box, Text } from "ink"
import React from "react"

export function Table(props: {
  data: Record<string, any>[]
}) {
  const { data } = props

  const names = Object.keys(data[0] ?? {})
  const width = 100 / names.length

  return (
    <Box flexDirection="column" width={120}>
      <Box>
        {names.map(col => (
          <Box key={col} width={width} borderStyle="round" borderColor="green">
            <Text bold>{col}</Text>
          </Box>
        ))}
      </Box>

      {data.map((row, index) => (
        <Box key={index}>
          {names.map(col => (
            <Box key={col} width={width} borderStyle="round" borderColor="blue">
              <Text>{row[col]}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
