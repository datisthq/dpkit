import { Option } from "commander"

export const toGithubApiKey = new Option(
  "--to-github-api-key <apiKey>",
  "API key for GitHub API",
)

export const toGithubRepo = new Option(
  "--to-github-repo <repo>",
  "GitHub repository name",
)

export const toGithubOrg = new Option(
  "--to-github-org <org>",
  "GitHub organization (optional, defaults to user repositories)",
)
