import { loadPackage, savePackageToZenodo } from "@dpkit/lib"
import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { Session } from "../../../session.ts"
import * as params from "../../../params/index.ts"

export const zenodoPublishPackageCommand = new Command("zenodo")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to Zenodo")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)
  .addOption(params.debug)
  .addOption(params.silent)

  .optionsGroup("Zenodo")
  .addOption(params.toZenodoApiKey)
  .addOption(params.toZenodoSandbox)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish package",
      debug: options.debug,
      silent: options.silent,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    const result = await session.task(
      "Publishing package",
      savePackageToZenodo(dp, {
        apiKey: options.toZenodoApiKey,
        sandbox: options.toZenodoSandbox,
      }),
    )

    session.success(`Package from "${path}" published to "${result.path}"`)
  })
