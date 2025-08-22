import type { HelpConfiguration } from "commander"
import pc from "picocolors"

export const helpConfiguration: HelpConfiguration = {
  styleTitle: str => pc.bold(str.toUpperCase().replace(":", "")),
}
