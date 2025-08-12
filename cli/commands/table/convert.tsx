import { Command } from "@oclif/core"
import { getTempFilePath, loadFile } from "dpkit"
import { readTable, saveTable } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ConvertTable extends Command {
  static override description =
    "Convert a table from a local or remote source path to a target path"

  static override args = {
    path: params.requriedTablePath,
  }

  // TODO: support toDialectOptions
  static override flags = {
    toPath: options.toPath,
    toFormat: options.toFormat,
    ...options.dialectOptions,
    ...options.toDialectOptions,
  }

  public async run() {
    const { args, flags } = await this.parse(ConvertTable)

    const dialect = options.createDialectFromFlags(flags)
    const table = await readTable({ path: args.path, dialect })

    const toPath = flags.toPath ?? getTempFilePath()
    const toDialect = options.createToDialectFromFlags(flags)
    await saveTable(table, {
      path: toPath,
      format: flags.toFormat,
      dialect: toDialect,
    })

    if (!flags.toPath) {
      // TODO: stream to stdout
      const buffer = await loadFile(toPath)
      this.log(buffer.toString().trim())
      return
    }

    this.log(`Converted table from ${args.path} to ${flags.toPath}`)
  }
}
