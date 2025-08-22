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
