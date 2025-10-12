import { existsSync } from "node:fs"
import { getTempFilePath, writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it } from "vitest"
import { copyFileCommand } from "./copy.ts"

useRecording()

describe("file copy", () => {
  it("should copy file to target path", async () => {
    const sourcePath = await writeTempFile("test content")
    const targetPath = getTempFilePath()

    const command = new Command().addCommand(copyFileCommand).configureOutput({
      writeOut: () => {},
      writeErr: () => {},
    })

    await command.parseAsync([
      "node",
      "test",
      "copy",
      sourcePath,
      "--to-path",
      targetPath,
      "--silent",
    ])

    expect(existsSync(targetPath)).toBe(true)
  })
})
