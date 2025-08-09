import { Command } from "@oclif/core"
//import { readTable } from "dpkit"
import * as options from "../../options/index.ts"
import * as params from "../../params/index.ts"

export default class ChatTable extends Command {
  static override description =
    "Start an AI chat sesstion for a table from a local or remote path"

  static override args = {
    path: params.requriedTablePath,
  }

  static override flags = {
    ...options.dialectOptions,
  }

  public async run() {
    //const { args, flags } = await this.parse(ChatTable)
    throw new Error("Not implemented")
  }
}
