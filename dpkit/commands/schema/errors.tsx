import { loadDescriptor, validateSchema } from "@dpkit/all"
import { loadResourceSchema } from "@dpkit/all"
import type { Resource } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const errorsSchemaCommand = new Command("errors")
  .configureHelp(helpConfiguration)
  .description("Show errors for a table schema from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Schema errors",
      json: options.json,
      debug: options.debug,
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
      Session.terminate("Schema is not available")
    }

    const report = await session.task(
      "Validating schema",
      validateSchema(descriptor),
    )

    if (report.valid) {
      session.success("Schema is valid")
    }

    session.render(report, <ReportGrid report={report} />)
  })
