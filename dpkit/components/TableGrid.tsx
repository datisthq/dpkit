import type { Table } from "dpkit"
import { useApp, useInput } from "ink"
import { Box, Text } from "ink"
import { useEffect, useState } from "react"
import React from "react"
import type { Order } from "./DataGrid.tsx"
import { DataGrid } from "./DataGrid.tsx"

const PAGE_SIZE = 10
type Data = Record<string, any>[]

export function TableGrid(props: {
  table: Table
  borderColor?: "green" | "red"
}) {
  const { table, borderColor } = props

  const { exit } = useApp()
  const [col, setCol] = useState(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<Order>()
  const [data, setData] = useState<Data>([])

  const handleColChange = async (col: number) => {
    if (col === 0) return
    if (col > table.columns.length) return

    setCol(col)
  }

  const handleOrderChange = async (order?: Order) => {
    setOrder(order)

    if (order) {
      handlePageChange(1, order)
    }
  }

  const handlePageChange = async (page: number, order?: Order) => {
    if (page === 0) return

    let ldf = table
    if (order) {
      const name = table.columns[order.col - 1]
      if (name) {
        ldf = ldf.sort(name, order.dir === "desc")
      }
    }

    const offset = (page - 1) * PAGE_SIZE
    const df = await ldf.slice(offset, PAGE_SIZE).collect()
    const data = df.toRecords()

    if (data.length) {
      setPage(page)
      setData(data)
    }
  }

  useEffect(() => {
    handlePageChange(1)
  }, [table])

  useInput((input, key) => {
    if (key.escape || input === "q") {
      exit()
    }

    if (key.upArrow || input === "k") {
      handlePageChange(page - 1)
    }

    if (key.downArrow || input === "j") {
      handlePageChange(page + 1)
    }

    if (key.leftArrow || input === "h") {
      handleColChange(col - 1)
    }

    if (key.rightArrow || input === "l") {
      handleColChange(col + 1)
    }

    if (key.return || input === "o") {
      let nextOrder: Order | undefined = { col, dir: "desc" }

      if (order?.col === col) {
        if (order?.dir === "desc") nextOrder = { col, dir: "asc" }
        if (order?.dir === "asc") nextOrder = undefined
      }

      handleOrderChange(nextOrder)
    }
  })

  return (
    <Box flexDirection="column">
      <DataGrid
        data={data}
        col={col}
        order={order}
        rowHeight={2}
        borderColor={borderColor}
      />
      <Help />
    </Box>
  )
}

function Help() {
  const { exit } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  useInput((input, key) => {
    if (key.escape || input === "q") {
      exit()
    }

    if (input === "d") {
      setIsOpen(!isOpen)
    }
  })

  if (!isOpen) {
    return (
      <Box paddingLeft={1}>
        <HelpItem button="d" description="to toggle docs" />
        <Text>{", "}</Text>
        <HelpItem button="q" description="to quit" />
      </Box>
    )
  }

  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Text bold>Table Usage</Text>
      <HelpItem button="k, top" description="for prev page" />
      <HelpItem button="j, down" description="for next page" />
      <HelpItem button="h, left" description="for prev column" />
      <HelpItem button="l, right" description="for next column" />
      <HelpItem button="o, enter" description="for order" />
      <HelpItem button="q, esc" description="for quit" />
    </Box>
  )
}

function HelpItem(props: { button: string; description: string }) {
  return (
    <Text>
      <Text dimColor>press</Text> <Text bold>{props.button}</Text>{" "}
      <Text dimColor>{props.description}</Text>
    </Text>
  )
}
