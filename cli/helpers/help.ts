import { styleText } from "node:util"
import type { HelpConfiguration } from "commander"

export const helpConfiguration: HelpConfiguration = {
  styleTitle: str => styleText("bold", str.toUpperCase().slice(0, -1)),
}
