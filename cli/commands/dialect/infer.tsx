import { Command } from "commander"
import { inferDialect } from "dpkit"
import React from "react"
import { DialectGrid } from "../../components/DialectGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
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
    if (isEmptyObject(dialect)) {
      Session.terminate("Could not infer dialect")
    }

    await session.render(dialect, <DialectGrid dialect={dialect} />)
    session.outro("Thanks for using dpkit!")
  })
