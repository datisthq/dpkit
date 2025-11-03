import repl from "node:repl"
import { loadSchema } from "@dpkit/lib"
import type { Resource } from "@dpkit/lib"
import { resolveSchema } from "@dpkit/lib"
import * as dpkit from "@dpkit/lib"
import { Command } from "commander"
import pc from "picocolors"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../session.ts"
import * as params from "../../params/index.ts"

export const scriptSchemaCommand = new Command("script")
  .configureHelp(helpConfiguration)
  .description("Script a table schema from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Script schema",
      json: options.json,
      debug: options.debug,
    })

    const resource: Partial<Resource> | undefined = !path
      ? await selectResource(session, options)
      : undefined

    const schema = await session.task(
      "Loading schema",
      path ? loadSchema(path) : resolveSchema(resource?.schema),
    )

    console.log(
      pc.dim("`dpkit` and `schema` variables are available in the session"),
    )

    const replSession = repl.start({ prompt: "dp> " })
    replSession.context.dpkit = dpkit
    replSession.context.schema = schema
  })
