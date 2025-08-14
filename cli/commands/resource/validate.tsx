import { Command } from "commander"
import { loadDescriptor, validateResourceDescriptor } from "dpkit"
import type { Descriptor } from "dpkit"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateResourceCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a data resource from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)

  .action(async (path, options) => {
    let descriptor: Descriptor | undefined

    const session = Session.create({
      title: "Validate resource",
      json: options.json,
    })

    if (!path) {
      const resource = await selectResource(session, options)
      descriptor = resource as unknown as Descriptor
    } else {
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
      validateResourceDescriptor(descriptor),
    )

    valid
      ? session.success("Resource is valid")
      : session.error("Resource is not valid")
  })
