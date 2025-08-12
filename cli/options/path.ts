import { Flags } from "@oclif/core"

export const toPath = Flags.string({
  description: "a local output path",
})

export const requiredToFolder = Flags.string({
  description: "a local output folder path",
  required: true,
})

export const requiredToArchive = Flags.string({
  description: "a local output zip file path",
  required: true,
})
