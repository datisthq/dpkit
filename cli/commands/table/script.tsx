import repl from "node:repl"
import { Command } from "@oclif/core"
import { readTable } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ScriptTable extends Command {
  static override description =
    "Start a scripting session for a table from a local or remote path"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    ...options.dialectOptions,
  }

  public async run() {
    const { args, flags } = await this.parse(ScriptTable)

    const dialect = options.createDialectFromFlags(flags)
    const table = await readTable({ path: args.path, dialect })

    const session = repl.start({ prompt: "dp> " })
    session.context.table = table
  }
}
