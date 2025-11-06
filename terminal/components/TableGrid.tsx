import type { DataRecord, Schema, Table } from "@dpkit/library"
import { useApp, useInput } from "ink"
import { Box, Text } from "ink"
import pc from "picocolors"
import { useEffect, useState } from "react"
import React from "react"
import type { Order } from "./DataGrid.tsx"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Move components to their own folders

const PAGE_SIZE = 10

export function TableGrid(props: {
  table: Table
  schema?: Schema
  borderColor?: "green" | "red"
  withTypes?: boolean
  quit?: boolean
}) {
  const { table, schema, borderColor } = props

  const { exit } = useApp()
  const [col, setCol] = useState(0)
  const [row, setRow] = useState(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<Order>()
  const [records, setRecords] = useState<DataRecord[]>()

  const handleColChange = async (newCol: number) => {
    if (newCol <= 0) return
    if (newCol > table.columns.length) return

    setCol(newCol)
  }

  const handleRowChange = async (row: number) => {
    if (row > PAGE_SIZE) {
      handlePageChange(page + 1)
      row = 1
    } else if (row < 1) {
      if (page === 1) return
      handlePageChange(page - 1)
      row = 10
    } else if (records && row > records.length) {
      return
    }

    setRow(row)
  }

  const handleOrderChange = async (order?: Order) => {
    setOrder(order)

    if (order) {
      handlePageChange(1, order)
    }
  }

  const handlePageChange = async (page: number, newOrder?: Order) => {
    const thisOrder = newOrder ?? order
    if (page === 0) return

    let result = table
    if (thisOrder) {
      const name = table.columns[thisOrder.col - 1]
      if (name) {
        result = result.sort(name, thisOrder.dir === "desc")
      }
    }

    const offset = (page - 1) * PAGE_SIZE
    const frame = await result.slice(offset, PAGE_SIZE).collect()
    const records = frame.toRecords()

    if (records.length) {
      setPage(page)
      setRecords(records)
    }
  }

  useEffect(() => {
    handlePageChange(1)
  }, [table])

  useEffect(() => {
    if (records && props.quit) exit()
  }, [records])

  useInput((input, key) => {
    if (key.escape || input === "q") {
      exit()
    }

    if (key.pageUp || input === "K") {
      handlePageChange(page - 1)
    }

    if (key.pageDown || input === "J") {
      handlePageChange(page + 1)
    }

    if (key.downArrow || input === "j") {
      handleRowChange(row + 1)
    }

    if (key.upArrow || input === "k") {
      handleRowChange(row - 1)
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

  if (!records) {
    return null
  }

  return (
    <Box flexDirection="column">
      <DataGrid
        records={records}
        schema={schema}
        col={col}
        row={row}
        order={order}
        rowHeight={2}
        borderColor={borderColor}
        withTypes={props.withTypes}
      />
      <Help page={page} />
    </Box>
  )
}

function Help(props: { page: number }) {
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
        <PageItem page={props.page} />
        <Text>{", "}</Text>
        <HelpItem button="d" description="to toggle docs" />
        <Text>{", "}</Text>
        <HelpItem button="q" description="to quit" />
      </Box>
    )
  }

  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Text bold>Table Usage</Text>
      <HelpItem button="K, pgUp" description="for prev page" />
      <HelpItem button="J, pgDown" description="for next page" />
      <HelpItem button="k, up" description="for prev row" />
      <HelpItem button="j, down" description="for next row" />
      <HelpItem button="h, left" description="for prev column" />
      <HelpItem button="l, right" description="for next column" />
      <HelpItem button="o, enter" description="for order" />
      <HelpItem button="q, esc" description="for quit" />
    </Box>
  )
}

// It has weird Text.dimColor bug so we use picocolors here
function PageItem(props: { page: number }) {
  return (
    <Text>
      <Text>{pc.dim("page")} </Text>
      <Text bold>{props.page}</Text>
    </Text>
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
