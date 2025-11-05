import { Option } from "commander"

export const toCkanApiKey = new Option(
  "--to-ckan-api-key <ckanApiKey>",
  "API key for CKAN API",
).makeOptionMandatory()

export const toCkanUrl = new Option(
  "--to-ckan-url <ckanUrl>",
  "Base CKAN url to publish to",
).makeOptionMandatory()

export const toCkanOwnerOrg = new Option(
  "--to-ckan-owner-org <ckanOwnerOrg>",
  "Owner organization for the CKAN dataset",
).makeOptionMandatory()

export const toCkanDatasetName = new Option(
  "--to-ckan-dataset-name <ckanDatasetName>",
  "Name for the CKAN dataset",
).makeOptionMandatory()
