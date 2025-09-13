import { Option } from "commander"

export const toZenodoApiKey = new Option(
  "--to-api-key <apiKey>",
  "API key for Zenodo API",
)

export const toZenodoSandbox = new Option(
  "--to-sandbox",
  "Use Zenodo sandbox environment",
).default(false)
