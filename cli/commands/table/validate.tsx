import { Command } from "@oclif/core"
import { validateTable } from "dpkit"
import { render } from "ink"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ExploreTable extends Command {
  static override description = "Explore a table from a local or remote path"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    ...options.dialectOptions,
    json: options.json,
  }

  public async run() {
    const { args, flags } = await this.parse(ExploreTable)

    const dialect = options.createDialectFromFlags(flags)
    const { errors } = await validateTable({ path: args.path, dialect })

    if (flags.json) {
      this.logJson(errors)
      return
    }

    render(<ErrorGrid errors={errors} />)
  }
}
