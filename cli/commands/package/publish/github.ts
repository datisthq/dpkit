import { Option } from "commander"
import { Command } from "commander"
import { loadPackage, savePackageToGithub } from "dpkit"
import { helpConfiguration } from "../../../helpers/help.ts"
import { Session } from "../../../helpers/session.ts"
import * as params from "../../../params/index.ts"

export const toGithubApiKey = new Option(
  "--to-api-key <apiKey>",
  "API key for GitHub API",
)

export const toGithubRepo = new Option(
  "--to-repo <repo>",
  "GitHub repository name",
)

export const toGithubOrg = new Option(
  "--to-org <org>",
  "GitHub organization (optional, defaults to user repositories)",
)

export const githubPublishPackageCommand = new Command("github")
  .configureHelp(helpConfiguration)
  .description("Publish a data package from a local or remote path to GitHub")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.withRemote)

  .optionsGroup("GitHub")
  .addOption(toGithubApiKey.makeOptionMandatory())
  .addOption(toGithubRepo.makeOptionMandatory())
  .addOption(toGithubOrg)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Publish package",
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
