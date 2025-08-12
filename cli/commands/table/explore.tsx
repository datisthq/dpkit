import { Command } from "@oclif/core"
import { readTable } from "dpkit"
import { render } from "ink"
import React from "react"
import { TableGrid } from "../../components/TableGrid.tsx"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ExploreTable extends Command {
  static override description = "Explore a table from a local or remote path"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    ...options.dialectOptions,
  }

  public async run() {
    const { args, flags } = await this.parse(ExploreTable)

    const dialect = options.createDialectFromFlags(flags)
    const table = await readTable({ path: args.path, dialect })

    if (flags.json) {
      const df = await table.slice(0, 10).collect()
      const data = df.toRecords()
      this.logJson(data)
      return
    }

    render(<TableGrid table={table} />)
  }
}
