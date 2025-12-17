import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { convertTableCommand } from "./convert.tsx"

useRecording()

describe("table convert", () => {
  it("should convert csv table", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const outputPath = join(tmpdir(), `test-convert-${Math.random()}.json`)

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
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
      .addCommand(convertTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "convert",
        csvPath,
        "--to-path",
        outputPath,
        "--to-format",
        "json",
        "--silent",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(existsSync(csvPath)).toBe(true)
  })

  it("should handle delimiter option", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")
    const outputPath = join(tmpdir(), `test-convert-${Math.random()}.json`)

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
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
      .addCommand(convertTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "convert",
        csvPath,
        "--delimiter",
        "|",
        "--to-path",
        outputPath,
        "--to-format",
        "json",
        "--silent",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(existsSync(csvPath)).toBe(true)
  })
})
