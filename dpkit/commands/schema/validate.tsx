import { loadDescriptor, validateSchema } from "@dpkit/lib"
import { loadResourceSchema } from "@dpkit/lib"
import type { Resource } from "@dpkit/lib"
import { Command } from "commander"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateSchemaCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table schema from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.quit)
  .addOption(params.all)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate schema",
      json: options.json,
      debug: options.debug,
      quit: options.quit,
      all: options.all,
    })

    const resource: Partial<Resource> | undefined = !path
      ? await selectResource(session, options)
      : undefined

    const schema = resource?.schema
      ? await session.task(
          "Loading schema",
          loadResourceSchema(resource.schema),
        )
      : undefined

    const { descriptor } = path
      ? await session.task("Loading descriptor", loadDescriptor(path))
      : schema
        ? { descriptor: schema }
        : { descriptor: undefined }

    if (!descriptor) {
      session.terminate("Schema is not available")
      process.exit(1) // typescript ignore never return type above
    }

    const report = await session.task(
      "Validating descriptor",
      validateSchema(descriptor),
    )

    if (report.errors.length) {
      const type = await selectErrorType(session, report.errors)
      if (type) report.errors = report.errors.filter(e => e.type === type)
    }

    if (report.valid) {
      session.success("Table is valid")
    }

    session.render(
      report,
      <ErrorGrid errors={report.errors} quit={options.quit} />,
    )
  })
