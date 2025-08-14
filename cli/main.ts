import { program } from "commander"
import { dialectCommand } from "./commands/dialect/index.ts"
import { packageCommand } from "./commands/package/index.ts"
import { resourceCommand } from "./commands/resource/index.ts"
import { schemaCommand } from "./commands/schema/index.ts"
import { tableCommand } from "./commands/table/index.ts"
import { helpConfiguration } from "./helpers/help.ts"
import metadata from "./package.json" with { type: "json" }

program
  .name("dp")
  .description(
    "Fast data management CLI built on top of the Data Package standard and Polars DataFrames",
  )

  .version(metadata.version, "-v, --version")
  .configureHelp(helpConfiguration)

  .addCommand(packageCommand)
  .addCommand(resourceCommand)
  .addCommand(dialectCommand)
  .addCommand(schemaCommand)
  .addCommand(tableCommand)

  .parse()
