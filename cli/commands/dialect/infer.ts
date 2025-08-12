import { Command } from "@oclif/core"
import { inferDialect } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class InferDialect extends Command {
  static override description = "Infer a dialect from a table"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    json: options.json,
  }

  public async run() {
    const { args, flags } = await this.parse(InferDialect)

    const dialect = await inferDialect({ path: args.path })

    if (flags.json) {
      this.logJson(dialect)
      return
    }

    console.log(dialect)
  }
}
