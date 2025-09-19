import repl from "node:repl"
import { loadPackage } from "@dpkit/all"
import * as dpkit from "@dpkit/all"
import { Command } from "commander"
import pc from "picocolors"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const scriptPackageCommand = new Command("script")
  .configureHelp(helpConfiguration)
  .description("Script a Data Package descriptor")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Script package",
      json: options.json,
      debug: options.debug,
    })

    const dataPackage = await session.task("Loading package", loadPackage(path))

    console.log(
      pc.dim(
        "`dpkit` and `dataPackage` variables are available in the session",
      ),
    )

    const replSession = repl.start({ prompt: "dp> " })
    replSession.context.dpkit = dpkit
    replSession.context.dataPackage = dataPackage
  })
