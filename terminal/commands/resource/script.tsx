import repl from "node:repl"
import { loadResourceDescriptor } from "@dpkit/library"
import * as dpkit from "@dpkit/library"
import { Command } from "commander"
import pc from "picocolors"
import { helpConfiguration } from "../../helpers/help.ts"
import { isEmptyObject } from "../../helpers/object.ts"
import { selectResource } from "../../helpers/resource.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const scriptResourceCommand = new Command("script")
  .configureHelp(helpConfiguration)
  .description("Script a data resource from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Script resource",
      json: options.json,
      debug: options.debug,
    })
    const resource = path
      ? await session.task("Loading resource", loadResourceDescriptor(path))
      : await selectResource(session, options)

    if (isEmptyObject(resource)) {
      session.terminate("Resource is not available")
      process.exit(1) // typescript ignore never return type above
    }

    console.log(
      pc.dim("`dpkit` and `resource` variables are available in the session"),
    )

    const replSession = repl.start({ prompt: "dp> " })
    replSession.context.dpkit = dpkit
    replSession.context.resource = resource
  })
