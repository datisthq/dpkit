import { Command } from "commander"
import { inferDialectCommand } from "./infer.tsx"
import { showDialectCommand } from "./show.tsx"

export const dialectCommand = new Command("dialect")
  .description("Table Dialect related commands")
  .addCommand(inferDialectCommand)
  .addCommand(showDialectCommand)
