import repl from "node:repl"
import * as dpkit from "@dpkit/all"
import { loadDialect } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { loadResourceDialect } from "@dpkit/all"
import { Command } from "commander"
import pc from "picocolors"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const scriptDialectCommand = new Command("script")
  .configureHelp(helpConfiguration)
  .description("Script a table dialect from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Script dialect",
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
      session.terminate("Dialect is not available")
      process.exit(1) // typescript ignore never return type above
    }

    console.log(
      pc.dim("`dpkit` and `dialect` variables are available in the session"),
    )

    const replSession = repl.start({ prompt: "dp> " })
    replSession.context.dpkit = dpkit
    replSession.context.dialect = dialect
  })
