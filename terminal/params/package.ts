import { Option } from "commander"

export const withRemote = new Option(
  "--with-remote",
  "include remote resources",
)

export const fromPackage = new Option(
  "-p --package <path>",
  "package to select resource from",
)

export const fromResource = new Option(
  "-r --resource <path>",
  "resource in provided package",
)

export const toFolder = new Option(
  "--to-folder <toFolder>",
  "a local output folder path",
).makeOptionMandatory()

export const toArchive = new Option(
  "--to-archive <toArchive>",
  "a local output zip file path",
).makeOptionMandatory()
