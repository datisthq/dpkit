import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import * as lib from "frictionless-ts"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { zenodoPublishPackageCommand } from "./zenodo.ts"

useRecording()

describe("package publish zenodo", () => {
  it.skip("should attempt to publish package to Zenodo", async () => {
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

    const packagePath = await writeTempFile(packageContent, {
      filename: "datapackage.json",
    })

    const savePackageToZenodoSpy = vi
      .spyOn(lib, "savePackageToZenodo")
      .mockResolvedValue({
        path: "https://zenodo.org/record/12345",
        datasetUrl: "https://zenodo.org/record/12345",
      })

    const command = new Command()
      .addCommand(zenodoPublishPackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "zenodo",
        packagePath,
        "--to-zenodo-api-key",
        "test-key",
        "--silent",
      ])
    } catch (error) {}

    expect(savePackageToZenodoSpy).toHaveBeenCalled()

    savePackageToZenodoSpy.mockRestore()
  })
})
