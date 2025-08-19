import { styleText } from "node:util"
import { program } from "commander"
import { dialectCommand } from "./commands/dialect/index.js"
import { packageCommand } from "./commands/package/index.js"
import { tableCommand } from "./commands/table/index.js"
import metadata from "./package.json" with { type: "json" }

const root = program
  .name("dp")
  .description(
    "Fast TypeScript data management framework built on top of the Data Package standard and Polars DataFrames",
  )
  .version(metadata.version)
  .configureHelp({
    styleTitle: str => styleText("bold", str.toUpperCase().slice(0, -1)),
  })

root.addCommand(packageCommand)
root.addCommand(tableCommand)
root.addCommand(dialectCommand)

root.parse()
