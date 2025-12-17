import { loadPackage, savePackageToGithub } from "frictionless-ts"
import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import * as params from "../../../params/index.ts"
import { Session } from "../../../session.ts"

export const githubPublishPackageCommand = new Command("github")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to GitHub")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)
  .addOption(params.debug)
  .addOption(params.silent)

  .optionsGroup("GitHub")
  .addOption(params.toGithubApiKey)
  .addOption(params.toGithubRepo)
  .addOption(params.toGithubOrg)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish to GitHub",
      debug: options.debug,
      silent: options.silent,
    })

    const dp = await session.task("Loading package", loadPackage(path))

    const result = await session.task(
      "Publishing package",
      savePackageToGithub(dp, {
        apiKey: options.toGithubApiKey,
        repo: options.toGithubRepo,
        org: options.toGithubOrg,
      }),
    )

    session.success(`Package from "${path}" published to "${result.path}"`)
  })
