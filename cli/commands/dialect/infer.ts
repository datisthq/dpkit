import { Command } from "commander"
import { inferDialect } from "dpkit"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const inferDialectCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer a dialect from a table")

  .addArgument(params.positionalTablePath)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create(options)
    session.intro("Inferring dialect")

    const dialect = await session.task("Loading sample", inferDialect({ path }))

    session.object(dialect)
    session.outro("Thanks for using dpkit!")
  })
