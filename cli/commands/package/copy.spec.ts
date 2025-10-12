import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { copyPackageCommand } from "./copy.ts"

useRecording()

describe("package copy", () => {
  it("should copy package to target path", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: csvPath,
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)
    const targetPath = join(tmpdir(), `test-package-${Date.now()}`)

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
      .addCommand(copyPackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "copy",
        packagePath,
        "--to-path",
        targetPath,
      ])
    } catch (error) {}

    consoleSpy.mockRestore()
    exitSpy.mockRestore()
    stdoutSpy.mockRestore()
    stderrSpy.mockRestore()

    expect(existsSync(packagePath)).toBe(true)
  })
})
