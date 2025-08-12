import { Command } from "@oclif/core"
//import { readTable } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class QueryTable extends Command {
  static override description =
    "Start a querying session for a table from a local or remote path"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    ...options.dialectOptions,
  }

  public async run() {
    //const { args, flags } = await this.parse(QueryTable)
    throw new Error("Not implemented")
  }
}
