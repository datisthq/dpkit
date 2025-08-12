import { Flags } from "@oclif/core"

export const toPath = Flags.string({
  description: "a local output path",
})

export const requiredToFolder = Flags.string({
  description: "a local output folder",
  required: true,
})
