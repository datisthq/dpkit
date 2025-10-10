import { loadPackage, savePackageToGithub } from "@dpkit/lib"
import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { Session } from "../../../helpers/session.ts"
import * as params from "../../../params/index.ts"

export const githubPublishPackageCommand = new Command("github")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to GitHub")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)
  .addOption(params.debug)

  .optionsGroup("GitHub")
  .addOption(params.toGithubApiKey)
  .addOption(params.toGithubRepo)
  .addOption(params.toGithubOrg)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish to GitHub",
      debug: options.debug,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    const result = await session.task(
      "Publishing package",
      savePackageToGithub(dp, {
        apiKey: options.toApiKey,
        repo: options.toRepo,
        org: options.toOrg,
      }),
    )

    session.success(`Package from "${path}" published to "${result.path}"`)
  })
