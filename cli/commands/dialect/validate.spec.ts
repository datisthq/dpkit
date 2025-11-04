import { writeTempFile } from "@dpkit/file"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { validateDialectCommand } from "./validate.tsx"

useRecording()

describe("dialect validate", () => {
  it("should detect missing delimiter", async () => {
    const dialectContent = JSON.stringify({
      header: true,
      quoteChar: 123,
    })
    const dialectPath = await writeTempFile(dialectContent)

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
      .addCommand(validateDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        dialectPath,
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

  it("should detect validation errors in invalid dialect", async () => {
    const dialectContent = JSON.stringify({
      delimiter: 123,
      header: "not-a-boolean",
    })
    const dialectPath = await writeTempFile(dialectContent)

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
      .addCommand(validateDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        dialectPath,
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

  it("should detect invalid escape character", async () => {
    const dialectContent = JSON.stringify({
      delimiter: "|",
      header: "not-boolean",
      escapeChar: 999,
    })
    const dialectPath = await writeTempFile(dialectContent)

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
      .addCommand(validateDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        dialectPath,
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
