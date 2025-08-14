import { Command } from "commander"
import { loadDialect } from "dpkit"
import type { Dialect } from "dpkit"
import React from "react"
import { DialectGrid } from "../../components/DialectGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const showDialectCommand = new Command("show")
  .configureHelp(helpConfiguration)
  .description("Show a table dialect from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    let dialect: Dialect | undefined

    const session = Session.create({
      title: "Show dialect",
      json: options.json,
    })

    if (!path) {
      const resource = await selectResource(session, options)
      if (typeof resource.dialect !== "string") {
        dialect = resource.dialect
      } else {
        path = resource.dialect
      }
    }

    if (!dialect) {
      // @ts-ignore
      dialect = await session.task("Loading dialect", loadDialect(path))
    }

    if (isEmptyObject(dialect)) {
      Session.terminate("Dialect is not available")
    }

    await session.render(dialect, <DialectGrid dialect={dialect} />)
  })
