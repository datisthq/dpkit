import { writeTempFile } from "@dpkit/file"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { validateSchemaCommand } from "./validate.tsx"

useRecording()

describe("schema validate", () => {
  it("should detect missing fields in schema", async () => {
    const schemaContent = JSON.stringify({
      fields: [],
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
      .addCommand(validateSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        schemaPath,
        "--json",
        "--quit",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it("should detect validation errors in invalid schema", async () => {
    const schemaContent = JSON.stringify({
      fields: [{ name: 123, type: "not-a-valid-type" }],
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
      .addCommand(validateSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        schemaPath,
        "--json",
        "--quit",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it("should detect invalid field format", async () => {
    const schemaContent = JSON.stringify({
      fields: [
        {
          name: "id",
          type: "integer",
          format: "invalid-format",
        },
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
      .addCommand(validateSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        schemaPath,
        "--json",
        "--quit",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})
