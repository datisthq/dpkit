import { loadPackage, savePackageToCkan } from "@dpkit/all"
import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { Session } from "../../../helpers/session.ts"
import * as params from "../../../params/index.ts"

export const ckanPublishPackageCommand = new Command("ckan")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to CKAN")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)
  .addOption(params.debug)

  .optionsGroup("CKAN")
  .addOption(params.toCkanApiKey.makeOptionMandatory())
  .addOption(params.toCkanUrl.makeOptionMandatory())
  .addOption(params.toCkanOwnerOrg.makeOptionMandatory())
  .addOption(params.toCkanDatasetName.makeOptionMandatory())

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish package",
      debug: options.debug,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    const result = await session.task(
      "Publishing package",
      savePackageToCkan(dp, {
        ckanUrl: options.toCkanUrl,
        apiKey: options.toApiKey,
        ownerOrg: options.toOwnerOrg,
        datasetName: options.toDatasetName,
      }),
    )

    session.success(`Package from "${path}" published to "${result.path}"`)
  })
