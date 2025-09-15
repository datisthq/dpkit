import { Argument, Option } from "commander"

export const optionalPositionalDescriptorPath = new Argument(
  "[path]",
  "local or remote path to the descriptor",
)

export const positionalDescriptorPath = new Argument(
  "<path>",
  "local or remote path to the descriptor",
)

export const positionalTablePath = new Argument(
  "[path]",
  "local or remote path to the table",
)

export const positionalFilePath = new Argument(
  "[path]",
  "local or remote path to the file",
)

export const requiredPositionalFilePath = new Argument(
  "<path>",
  "local or remote path to the file",
)

export const positionalFilePaths = new Argument(
  "<path...>",
  "local paths to files",
)

export const toPath = new Option("--to-path <toPath>", "a local output path")

export const toFolder = new Option(
  "--to-folder <path>",
  "a local output folder path",
)

export const toArchive = new Option(
  "--to-archive <path>",
  "a local output zip file path",
)
