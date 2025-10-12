import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { inferDialectCommand } from "./infer.tsx"

useRecording()

describe("dialect infer", () => {
  it("should infer dialect from csv file", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")

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
      .addCommand(inferDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "infer", csvPath, "--json"])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result).toBeDefined()
  })

  it("should infer dialect with pipe delimiter", async () => {
    const csvPath = await writeTempFile("id|name|value\n1|test|100\n2|demo|200")

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
      .addCommand(inferDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "infer", csvPath, "--json"])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result).toBeDefined()
  })

  it("should infer dialect with tab delimiter", async () => {
    const csvPath = await writeTempFile(
      "id\tname\tvalue\n1\ttest\t100\n2\tdemo\t200",
    )

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
      .addCommand(inferDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "infer", csvPath, "--json"])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result).toBeDefined()
  })
})
