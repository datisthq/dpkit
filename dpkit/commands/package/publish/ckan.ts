import { Option } from "commander"
import { Command } from "commander"
import { loadPackage, savePackageToCkan } from "dpkit"
import { helpConfiguration } from "../../../helpers/help.ts"
import { Session } from "../../../helpers/session.ts"
import * as params from "../../../params/index.ts"

export const toCkanApiKey = new Option(
  "--to-api-key <apiKey>",
  "API key for CKAN API",
)

export const toCkanUrl = new Option(
  "--to-ckan-url <ckanUrl>",
  "Base CKAN url to publish to",
)

export const toCkanOwnerOrg = new Option(
  "--to-owner-org <ownerOrg>",
  "Owner organization for the CKAN dataset",
)

export const toCkanDatasetName = new Option(
  "--to-dataset-name <datasetName>",
  "Name for the CKAN dataset",
)

export const ckanPublishPackageCommand = new Command("ckan")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to CKAN")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)

  .optionsGroup("CKAN")
  .addOption(toCkanApiKey.makeOptionMandatory())
  .addOption(toCkanUrl.makeOptionMandatory())
  .addOption(toCkanOwnerOrg.makeOptionMandatory())
  .addOption(toCkanDatasetName.makeOptionMandatory())

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish package",
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
