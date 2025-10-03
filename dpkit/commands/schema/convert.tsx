import { convertSchemaToJsonSchema, convertSchemaFromJsonSchema } from "@dpkit/all"
import { loadDescriptor, saveDescriptor } from "@dpkit/all"
import { Command, Option } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { Session } from "../../helpers/session.ts"
import * as params from "../../params/index.ts"

const format = new Option("--format <format>", "source schema format").choices([
  "schema",
  "jsonschema",
])

const toFormat = new Option(
  "--to-format <format>",
  "target schema format",
).choices(["schema", "jsonschema"])

export const convertSchemaCommand = new Command("convert")
  .configureHelp(helpConfiguration)
  .description("Convert schema between different formats")

  .addArgument(params.positionalDescriptorPath)
  .addOption(format)
  .addOption(toFormat)
  .addOption(params.toPath)
  .addOption(params.json)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Convert schema",
      json: options.json || !options.toPath,
      debug: options.debug,
    })

    if (!options.format && !options.toFormat) {
      session.terminate("Either --format or --to-format must be specified")
      process.exit(1)
    }

    if (options.format === options.toFormat) {
      session.terminate("Source and target formats must be different")
      process.exit(1)
    }

    const converter =
      options.format === "schema" || options.toFormat === "jsonschema"
        ? convertSchemaToJsonSchema
        : convertSchemaFromJsonSchema

    const source = await session.task("Loading schema", loadDescriptor(path))
    const target = await session.task(
      "Converting schema",
      // @ts-ignore
      converter(source.descriptor),
    )

    if (!options.toPath) {
      session.render(target)
      return
    }

    await session.task(
      "Saving schema",
      saveDescriptor(target as any, {
        path: options.toPath,
      }),
    )

    session.success(`Converted schema from ${path} to ${options.toPath}`)
  })
