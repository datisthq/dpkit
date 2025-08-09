import { Command } from "@oclif/core"
import { readTable } from "dpkit"
import { render } from "ink"
import React from "react"
import { TableGrid } from "../../components/TableGrid.tsx"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ReadTable extends Command {
  static override description = "Read a table from a local or remote path"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    json: options.json,
  }

  public async run() {
    const { args, flags } = await this.parse(ReadTable)

    const table = await readTable({ path: args.path })

    if (flags.json) {
      const df = await table.slice(0, 10).collect()
      const data = df.toRecords()
      this.logJson(data)
      return
    }

    render(<TableGrid table={table} />)
  }
}
