import { basename } from "node:path"
import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { validatePackageCommand } from "./validate.tsx"

useRecording()

describe("package validate", () => {
  it("should validate a valid package", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: basename(csvPath),
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)

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
      .addCommand(validatePackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        packagePath,
        "--json",
        "--quit",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
  })

  it("should detect validation errors in invalid package", async () => {
    const packageContent = JSON.stringify({
      name: 123,
      resources: "not-an-array",
    })
    const packagePath = await writeTempFile(packageContent)

    const outputs: string[] = []
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(msg => {
      outputs.push(msg)
    })
    const command = new Command()
      .addCommand(validatePackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    await command.parseAsync([
      "node",
      "test",
      "validate",
      packagePath,
      "--json",
      "--quit",
    ])

    consoleSpy.mockRestore()

    const result = JSON.parse(outputs?.[0] ?? "")
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it("should validate package with resources", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-data",
          path: basename(csvPath),
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)

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
      .addCommand(validatePackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "validate",
        packagePath,
        "--json",
        "--quit",
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(outputs.length).toBeGreaterThan(0)
  })
})
