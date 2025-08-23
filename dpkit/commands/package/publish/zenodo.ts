import { Option } from "commander"
import { Command } from "commander"
import { loadPackage, savePackageToZenodo } from "dpkit"
import { helpConfiguration } from "../../../helpers/help.ts"
import { Session } from "../../../helpers/session.ts"
import * as params from "../../../params/index.ts"

export const toZenodoApiKey = new Option(
  "--to-api-key <apiKey>",
  "API key for Zenodo API",
)

export const toZenodoSandbox = new Option(
  "--to-sandbox",
  "Use Zenodo sandbox environment",
).default(false)

export const zenodoPublishPackageCommand = new Command("zenodo")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to Zenodo")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)

  .optionsGroup("Zenodo")
  .addOption(toZenodoApiKey.makeOptionMandatory())
  .addOption(toZenodoSandbox)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish package",
    })

    const dp = await session.task("Loading package", loadPackage(path))

    const result = await session.task(
      "Publishing package",
      savePackageToZenodo(dp, {
        apiKey: options.toApiKey,
        sandbox: options.toSandbox,
      }),
    )

    session.success(`Package from "${path}" published to "${result.path}"`)
  })
