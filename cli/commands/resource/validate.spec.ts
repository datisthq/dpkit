import { basename } from "node:path"
import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { validateResourceCommand } from "./validate.tsx"

useRecording()

describe("resource validate", () => {
  it("should validate a valid resource", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resourceContent = JSON.stringify({
      name: "test-resource",
      path: basename(csvPath),
    })
    const resourcePath = await writeTempFile(resourceContent)

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
      .addCommand(validateResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync([
      "node",
      "test",
      "validate",
      resourcePath,
      "--json",
      "--quit",
    ])

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const jsonOutput = outputs.find(o => o.startsWith("{") || o.startsWith("["))
    expect(jsonOutput).toBeDefined()
    const result = JSON.parse(jsonOutput ?? "")
    expect(result.valid).toBe(true)
  })

  it("should detect validation errors in invalid resource", async () => {
    const resourceContent = JSON.stringify({
      name: 123,
      path: null,
    })
    const resourcePath = await writeTempFile(resourceContent)

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
      .addCommand(validateResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync([
      "node",
      "test",
      "validate",
      resourcePath,
      "--json",
      "--quit",
    ])

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it("should validate resource with schema", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resourceContent = JSON.stringify({
      name: "test-resource",
      path: basename(csvPath),
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
    })
    const resourcePath = await writeTempFile(resourceContent)

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
      .addCommand(validateResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync([
      "node",
      "test",
      "validate",
      resourcePath,
      "--json",
      "--quit",
    ])

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const jsonOutput = outputs.find(o => o.startsWith("{") || o.startsWith("["))
    expect(jsonOutput).toBeDefined()
    const result = JSON.parse(jsonOutput ?? "")
    expect(result.valid).toBe(true)
  })
})
