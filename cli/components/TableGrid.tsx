import type { Table } from "dpkit"
import { useApp, useInput } from "ink"
import { useEffect, useState } from "react"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

const PAGE_SIZE = 10

export function TableGrid(props: { table: Table }) {
  const { table } = props
  const { exit } = useApp()
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Record<string, any>[]>([])

  const handlePageChange = async (page: number) => {
    if (page === 0) return

    const offset = (page - 1) * PAGE_SIZE
    const df = await table.slice(offset, PAGE_SIZE).collect()
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
    if (input === "q") {
      exit()
    }

    if (key.upArrow || input === "k") {
      handlePageChange(page - 1)
    }

    if (key.downArrow || input === "j") {
      handlePageChange(page + 1)
    }
  })

  return <DataGrid data={data} />
}
