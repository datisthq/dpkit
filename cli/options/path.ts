import { Flags } from "@oclif/core"

export const requriedToPath = Flags.string({
  description: "a local output path",
  required: true,
})
