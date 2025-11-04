import { writeTempFile } from "@dpkit/file"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { convertSchemaCommand } from "./convert.tsx"

useRecording()

describe("schema convert", () => {
  it("should convert schema to jsonschema", async () => {
    const schemaContent = JSON.stringify({
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    })
    const schemaPath = await writeTempFile(schemaContent)

    const outputs: string[] = []
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(msg => {
      outputs.push(msg)
    })
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as () => never)
    const stdoutSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true)
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true)

    const command = new Command()
      .addCommand(convertSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "convert",
        schemaPath,
        "--to-format",
        "jsonschema",
        "--json",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result).toBeDefined()
  })

  it("should convert jsonschema to table schema", async () => {
    const jsonSchemaContent = JSON.stringify({
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
      },
    })
    const schemaPath = await writeTempFile(jsonSchemaContent)

    const outputs: string[] = []
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(msg => {
      outputs.push(msg)
    })
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as () => never)
    const stdoutSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true)
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true)

    const command = new Command()
      .addCommand(convertSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "convert",
        schemaPath,
        "--format",
        "jsonschema",
        "--json",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result).toBeDefined()
  })

  it("should convert schema to markdown", async () => {
    const schemaContent = JSON.stringify({
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    })
    const schemaPath = await writeTempFile(schemaContent)

    const outputs: string[] = []
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(msg => {
      outputs.push(msg)
    })
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as () => never)
    const stdoutSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true)
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true)

    const command = new Command()
      .addCommand(convertSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "convert",
        schemaPath,
        "--to-format",
        "markdown",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    expect(outputs[0]).toContain("id")
    expect(outputs[0]).toContain("name")
  })
})
