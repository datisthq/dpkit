import { Option } from "commander"

export const toGithubApiKey = new Option(
  "--to-github-api-key <githubApiKey>",
  "API key for GitHub API",
).makeOptionMandatory()

export const toGithubRepo = new Option(
  "--to-github-repo <githubRepo>",
  "GitHub repository name",
).makeOptionMandatory()

export const toGithubOrg = new Option(
  "--to-github-org <githubOrg>",
  "GitHub organization (optional, defaults to user repositories)",
)
