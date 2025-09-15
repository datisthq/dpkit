import { loadDialect } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { loadResourceDialect } from "@dpkit/all"
import { Command } from "commander"
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
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Show dialect",
      json: options.json,
      debug: options.debug,
    })

    const resource: Partial<Resource> | undefined = !path
      ? await selectResource(session, options)
      : undefined

    const dialect = await session.task(
      "Loading dialect",
      path ? loadDialect(path) : loadResourceDialect(resource?.dialect),
    )

    if (!dialect || isEmptyObject(dialect)) {
      Session.terminate("Dialect is not available")
    }

    await session.render(dialect, <DialectGrid dialect={dialect} />)
  })
