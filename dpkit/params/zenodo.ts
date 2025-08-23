import { Option } from "commander"

export const toZenodoApiKey = new Option(
  "--to-zenodo-api-key <apiKey>",
  "API key for Zenodo API",
)

export const toZenodoSandbox = new Option(
  "--to-zenodo-sandbox",
  "Use Zenodo sandbox environment",
).default(false)
