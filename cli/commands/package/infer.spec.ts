import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { inferPackageCommand } from "./infer.tsx"

useRecording()

describe("package infer", () => {
  it("should infer package from csv file", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")

    const outputs: string[] = []
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(msg => {
      outputs.push(msg)
    })

    const command = new Command()
      .addCommand(inferPackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync(["node", "test", "infer", csvPath, "--json"])

    consoleSpy.mockRestore()

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.resources).toBeDefined()
    expect(result.resources.length).toBe(1)
    expect(result.resources[0].path).toBe(csvPath)
  })

  it("should infer package from multiple files", async () => {
    const csvPath1 = await writeTempFile("id,name\n1,alice\n2,bob")
    const csvPath2 = await writeTempFile("id,age\n1,25\n2,30")

    const outputs: string[] = []
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(msg => {
      outputs.push(msg)
    })

    const command = new Command()
      .addCommand(inferPackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync([
      "node",
      "test",
      "infer",
      csvPath1,
      csvPath2,
      "--json",
    ])

    consoleSpy.mockRestore()

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.resources).toBeDefined()
    expect(result.resources.length).toBe(2)
  })

  it("should infer package with custom delimiter", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")

    const outputs: string[] = []
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(msg => {
      outputs.push(msg)
    })

    const command = new Command()
      .addCommand(inferPackageCommand)
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

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.resources).toBeDefined()
    expect(result.resources[0].path).toBe(csvPath)
  })
})
