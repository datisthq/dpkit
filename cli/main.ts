import { styleText } from "node:util"
import { program } from "commander"
import { dialectCommand } from "./commands/dialect/index.ts"
import { packageCommand } from "./commands/package/index.ts"
import { tableCommand } from "./commands/table/index.ts"
import metadata from "./package.json" with { type: "json" }

program
  .name("dp")
  .description(
    "Fast data management CLI built on top of the Data Package standard and Polars DataFrames",
  )
  .version(metadata.version)
  .configureHelp({
    styleTitle: str => styleText("bold", str.toUpperCase().slice(0, -1)),
  })
  .addCommand(packageCommand)
  .addCommand(tableCommand)
  .addCommand(dialectCommand)
  .parse()
