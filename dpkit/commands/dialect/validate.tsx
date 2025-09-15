import { loadDescriptor, validateDialect } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { loadResourceDialect } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
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
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate dialect",
      json: options.json,
      debug: options.debug,
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
      Session.terminate("Dialect is not available")
    }

    const report = await session.task(
      "Validating dialect",
      // @ts-ignore
      validateDialect(descriptor),
    )

    if (report.valid) {
      session.success("Dialect is valid")
    }

    session.render(report, <ReportGrid report={report} groupBy="type" />)
  })
