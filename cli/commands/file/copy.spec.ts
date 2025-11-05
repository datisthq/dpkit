import { existsSync } from "node:fs"
import { getTempFilePath, writeTempFile } from "@dpkit/dataset"
import { Command } from "commander"
import { describe, expect, it } from "vitest"
import { useRecording } from "vitest-polly"
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
