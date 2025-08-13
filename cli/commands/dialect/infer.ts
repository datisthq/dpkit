import { Command } from "commander"
import { inferDialect } from "dpkit"
import * as params from "../../params/index.ts"

export const inferDialectCommand = new Command("infer")
  .description("Infer a dialect from a table")
  .addArgument(params.positionalTablePath)
  .addOption(params.json)
  .action(async (path, options) => {
    const dialect = await inferDialect({ path })

    if (options.json) {
      console.log(JSON.stringify(dialect, null, 2))
      return
    }

    console.log(dialect)
  })
