import { Args } from "@oclif/core"

export const requriedDescriptorPath = Args.string({
  description: "local or remote path to the descriptor",
  required: true,
})
