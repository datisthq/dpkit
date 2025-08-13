import { styleText } from "node:util"
import { Command, Help, Option, program } from "commander"

const testOption = new Option("-t, --test-option <test>")

const testCommand = new Command("test").addOption(testOption).action(() => {
  const options = testCommand.opts() // smart type
  console.log(options)
}) // program type includes chained options and arguments

const main = new Command("main").addCommand(testCommand)
const sub = new Command("sub").addCommand(testCommand)

class CustomHelp extends Help {
  styleTitle(str: string) {
    // Make titles bold and uppercase
    return `\x1b[1m${str.toUpperCase()}:\x1b[0m`
  }
}

const root = program
  .addCommand(main)
  .addCommand(sub)
  .configureHelp({
    styleTitle: str => styleText("bold", str.toUpperCase().slice(0, -1)),
  })

root.parse()
