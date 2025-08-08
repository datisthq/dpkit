import { Flags } from "@oclif/core"

export const json = Flags.boolean({
  description: "output as JSON",
  char: "j",
})
