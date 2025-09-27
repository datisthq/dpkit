import { loadDescriptor, validateDialect } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { loadResourceDialect } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ErrorGrid } from "../../components/ErrorGrid.tsx"
import { selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateDialectCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table dialect from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.quit)
  .addOption(params.all)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate dialect",
      json: options.json,
      debug: options.debug,
      quit: options.quit,
      all: options.all,
    })

    const resource: Partial<Resource> | undefined = !path
      ? await selectResource(session, options)
      : undefined

    const dialect = resource?.dialect
      ? await session.task(
          "Loading dialect",
          loadResourceDialect(resource.dialect),
        )
      : undefined

    const { descriptor } = path
      ? await session.task("Loading descriptor", loadDescriptor(path))
      : dialect
        ? { descriptor: dialect }
        : { descriptor: undefined }

    if (!descriptor) {
      session.terminate("Dialect is not available")
      process.exit(1)
    }

    const report = await session.task(
      "Validating dialect",
      validateDialect(descriptor),
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
