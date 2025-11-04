import { writeTempFile } from "@dpkit/file"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { inferResourceCommand } from "./infer.tsx"

useRecording()

describe("resource infer", () => {
  it("should infer resource from csv file", async () => {
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
      .addCommand(inferResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync(["node", "test", "infer", csvPath, "--json"])

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.path).toBe(csvPath)
  })

  it("should infer resource with custom delimiter", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")

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
      .addCommand(inferResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync([
      "node",
      "test",
      "infer",
      csvPath,
      "--delimiter",
      "|",
      "--json",
    ])

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.path).toBe(csvPath)
  })

  it("should infer resource without header", async () => {
    const csvPath = await writeTempFile("1,alice\n2,bob")

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
      .addCommand(inferResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync([
      "node",
      "test",
      "infer",
      csvPath,
      "--header",
      "false",
      "--json",
    ])

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.path).toBe(csvPath)
  })
})
