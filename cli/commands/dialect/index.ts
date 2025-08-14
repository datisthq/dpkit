import { Command } from "commander"
import { inferDialectCommand } from "./infer.tsx"

export const dialectCommand = new Command("dialect")
  .description("Table Dialect related commands")
  .addCommand(inferDialectCommand)
