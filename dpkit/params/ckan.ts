import { Option } from "commander"

export const toCkanApiKey = new Option(
  "--to-ckan-api-key <apiKey>",
  "API key for CKAN API",
)

export const toCkanUrl = new Option("--to-ckan-url <ckanUrl>", "CKAN URL")

export const toCkanOwnerOrg = new Option(
  "--to-ckan-owner-org <ownerOrg>",
  "Owner organization for the CKAN dataset",
)

export const toCkanDatasetName = new Option(
  "--to-ckan-dataset-name <datasetName>",
  "Name for the CKAN dataset",
)
