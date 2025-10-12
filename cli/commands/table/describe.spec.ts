import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { describeTableCommand } from "./describe.tsx"

useRecording()

describe("table describe", () => {
  it("should describe a csv table", async () => {
    const csvPath = await writeTempFile(
      "id,name,age\n1,alice,25\n2,bob,30\n3,charlie,35",
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
      .addCommand(describeTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "describe", csvPath, "--json"])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result).toBeDefined()
  })

  it("should describe a table with numeric columns", async () => {
    const csvPath = await writeTempFile(
      "value,score\n10,95.5\n20,87.3\n30,92.1",
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
      .addCommand(describeTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "describe", csvPath, "--json"])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result).toBeDefined()
  })

  it("should describe a table with custom delimiter", async () => {
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
      .addCommand(describeTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "describe",
        csvPath,
        "--delimiter",
        "|",
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
})
