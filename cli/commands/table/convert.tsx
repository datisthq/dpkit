import { Command } from "@oclif/core"
import { readTable, saveTable } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ConvertTable extends Command {
  static override description =
    "Convert a table from a local or remote source path to a target path"

  static override args = {
    path: params.requriedTablePath,
    toPath: params.requriedTablePath,
  }

  // TODO: support toDialectOptions
  static override flags = {
    ...options.dialectOptions,
  }

  public async run() {
    const { args, flags } = await this.parse(ConvertTable)

    const dialect = options.createDialectFromFlags(flags)
    const table = await readTable({ path: args.path, dialect })

    await saveTable(table, { path: args.toPath })

    this.log(`Converted table from ${args.path} to ${args.toPath}`)
  }
}
