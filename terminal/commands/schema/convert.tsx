import { writeFile } from "node:fs/promises"
import {
  convertSchemaFromJsonSchema,
  convertSchemaToHtml,
  convertSchemaToJsonSchema,
  convertSchemaToMarkdown,
} from "frictionless-ts"
import { loadDescriptor, saveDescriptor } from "frictionless-ts"
import { Command, Option } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

const format = new Option("--format <format>", "source schema format").choices([
  "jsonschema",
])

const toFormat = new Option(
  "--to-format <format>",
  "target schema format",
).choices(["jsonschema", "markdown", "html"])

const frontmatter = new Option(
  "--frontmatter",
  "use YAML frontmatter instead of H1 heading (markdown and html only)",
)

export const convertSchemaCommand = new Command("convert")
  .configureHelp(helpConfiguration)
  .description("Convert schema between different formats")

  .addArgument(params.positionalDescriptorPath)
  .addOption(format)
  .addOption(toFormat)
  .addOption(frontmatter)
  .addOption(params.toPath)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.silent)

  .action(async (path, options) => {
    const session = Session.create({
      title: "Convert schema",
      text: !options.toPath,
      json: options.json,
      debug: options.debug,
      silent: options.silent,
    })

    if (!options.format && !options.toFormat) {
      session.terminate("Either --format or --to-format must be specified")
      process.exit(1)
    }

    if (options.format === options.toFormat) {
      session.terminate("Source and target formats must be different")
      process.exit(1)
    }

    let converter: (schema: any) => any

    if (options.toFormat === "markdown") {
      converter = (schema: any) =>
        convertSchemaToMarkdown(schema, { frontmatter: options.frontmatter })
    } else if (options.toFormat === "html") {
      converter = (schema: any) =>
        convertSchemaToHtml(schema, { frontmatter: options.frontmatter })
    } else if (options.toFormat === "jsonschema") {
      converter = convertSchemaToJsonSchema
    } else {
      converter = convertSchemaFromJsonSchema
    }

    const source = await session.task("Loading schema", loadDescriptor(path))
    const target = await session.task("Converting schema", converter(source))

    if (!options.toPath) {
      if (options.toFormat === "markdown" || options.toFormat === "html") {
        session.render(target)
      } else {
        session.render(!options.json ? JSON.stringify(target, null, 2) : target)
      }
      return
    }

    if (options.toFormat === "markdown" || options.toFormat === "html") {
      await session.task(
        "Saving schema",
        writeFile(options.toPath, target as any, "utf-8"),
      )
    } else {
      await session.task(
        "Saving schema",
        saveDescriptor(target as any, {
          path: options.toPath,
        }),
      )
    }

    session.success(`Converted schema from "${path}" to "${options.toPath}"`)
  })
