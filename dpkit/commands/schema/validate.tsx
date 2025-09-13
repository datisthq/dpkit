import { loadDescriptor, validateSchema } from "@dpkit/all"
import type { Descriptor } from "@dpkit/all"
import { Command } from "commander"
import React from "react"
import { ReportGrid } from "../../components/ReportGrid.tsx"
import { helpConfiguration } from "../../helpers/help.ts"
import { selectResource } from "../../helpers/resource.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

export const validateSchemaCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a table schema from a local or remote path")

  .addArgument(params.positionalTablePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Validate schema",
      json: options.json,
      debug: options.debug,
    })

    let descriptor: Descriptor | undefined

    if (!path) {
      const resource = await selectResource(session, options)

      if (!resource.schema) {
        Session.terminate("Schema is not available")
      }

      if (typeof resource.schema !== "string") {
        descriptor = resource.schema as unknown as Descriptor
      } else {
        path = resource.schema
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

    const report = await session.task(
      "Validating descriptor",
      // @ts-ignore
      validateSchema(descriptor),
    )

    if (report.valid) {
      session.success("Schema is valid")
    }

    session.render(report, <ReportGrid report={report} groupBy="type" />)
  })
