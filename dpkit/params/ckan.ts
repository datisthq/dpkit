import { Option } from "commander"

export const toCkanApiKey = new Option(
  "--to-api-key <apiKey>",
  "API key for CKAN API",
).makeOptionMandatory()

export const toCkanUrl = new Option(
  "--to-ckan-url <ckanUrl>",
  "Base CKAN url to publish to",
).makeOptionMandatory()

export const toCkanOwnerOrg = new Option(
  "--to-owner-org <ownerOrg>",
  "Owner organization for the CKAN dataset",
).makeOptionMandatory()

export const toCkanDatasetName = new Option(
  "--to-dataset-name <datasetName>",
  "Name for the CKAN dataset",
).makeOptionMandatory()
