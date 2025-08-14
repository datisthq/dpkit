import { Command } from "commander"
import { loadDescriptor, validateDialect } from "dpkit"
import type { Descriptor } from "dpkit"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateDialectCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table dialect from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate dialect",
      json: options.json,
    })

    let descriptor: Descriptor | undefined

    if (!path) {
      const resource = await selectResource(session, options)

      if (!resource.dialect) {
        Session.terminate("Dialect is not available")
      }

      if (typeof resource.dialect !== "string") {
        descriptor = resource.dialect as Descriptor
      } else {
        path = resource.dialect
      }
    }

    if (!descriptor) {
      const result = await session.task(
        "Loading descriptor",
        // @ts-ignore
        loadDescriptor(path),
      )

      descriptor = result.descriptor
    }

    const { valid } = await session.task(
      "Validating descriptor",
      // @ts-ignore
      validateDialect(descriptor),
    )

    valid
      ? session.success("Dialect is valid")
      : session.error("Dialect is not valid")
  })
