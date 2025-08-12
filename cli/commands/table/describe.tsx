import { Command } from "@oclif/core"
import { readTable } from "dpkit"
import { render } from "ink"
import React from "react"
import { TableGrid } from "../../components/TableGrid.tsx"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class DescribeTable extends Command {
  static override description = "Describe a table from a local or remote path"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    ...options.dialectOptions,
    json: options.json,
  }

  public async run() {
    const { args, flags } = await this.parse(DescribeTable)

    const dialect = options.createDialectFromFlags(flags)
    const table = await readTable({ path: args.path, dialect })

    const df = await table.collect()
    const stats = df.describe()

    if (flags.json) {
      this.logJson(stats)
      return
    }

    render(<TableGrid table={stats.lazy()} />)
  }
}
