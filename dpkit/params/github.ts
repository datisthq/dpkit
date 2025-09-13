import { Option } from "commander"

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
