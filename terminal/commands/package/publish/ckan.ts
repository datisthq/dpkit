import { Command } from "commander"
import { loadPackage, savePackageToCkan } from "frictionless-ts"
import { helpConfiguration } from "../../../helpers/help.ts"
import * as params from "../../../params/index.ts"
import { Session } from "../../../session.ts"

export const ckanPublishPackageCommand = new Command("ckan")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to CKAN")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)
  .addOption(params.debug)
  .addOption(params.silent)

  .optionsGroup("CKAN")
  .addOption(params.toCkanApiKey)
  .addOption(params.toCkanUrl)
  .addOption(params.toCkanOwnerOrg)
  .addOption(params.toCkanDatasetName)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish package",
      debug: options.debug,
      silent: options.silent,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    const result = await session.task(
      "Publishing package",
      savePackageToCkan(dp, {
        ckanUrl: options.toCkanUrl,
        apiKey: options.toCkanApiKey,
        ownerOrg: options.toCkanOwnerOrg,
        datasetName: options.toCkanDatasetName,
      }),
    )

    session.success(`Package from "${path}" published to "${result.path}"`)
  })
