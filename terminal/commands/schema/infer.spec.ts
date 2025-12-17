import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { inferSchemaCommand } from "./infer.tsx"

useRecording()

describe("schema infer", () => {
  it("should infer schema from csv table", async () => {
    const csvPath = await writeTempFile("id,name,age\n1,alice,25\n2,bob,30")

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
      .addCommand(inferSchemaCommand)
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

  it("should infer schema with numeric types", async () => {
    const csvPath = await writeTempFile(
      "id,value,score\n1,100,95.5\n2,200,87.3",
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
      .addCommand(inferSchemaCommand)
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

  it("should infer schema with custom delimiter", async () => {
    const csvPath = await writeTempFile(
      "id|name|active\n1|test|true\n2|demo|false",
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
      .addCommand(inferSchemaCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "infer",
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
