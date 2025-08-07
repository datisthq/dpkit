import { Flags } from "@oclif/core"

export const json = () => {
  return Flags.boolean({ char: "j", description: "output as JSON" })
}
