import { writeTempFile } from "@dpkit/file"
import * as lib from "@dpkit/lib"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import { ckanPublishPackageCommand } from "./ckan.ts"

useRecording()

describe("package publish ckan", () => {
  it("should attempt to publish package to CKAN", async () => {
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

    const savePackageToCkanSpy = vi
      .spyOn(lib, "savePackageToCkan")
      .mockResolvedValue({
        path: "https://ckan.example.com/dataset/test",
        datasetUrl: "https://ckan.example.com/dataset/test-package",
      })

    const command = new Command()
      .addCommand(ckanPublishPackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "ckan",
        packagePath,
        "--to-ckan-url",
        "https://ckan.example.com",
        "--to-ckan-api-key",
        "test-key",
        "--to-ckan-owner-org",
        "test-org",
        "--to-ckan-dataset-name",
        "test-dataset",
        "--silent",
      ])
    } catch (error) {}

    expect(savePackageToCkanSpy).toHaveBeenCalled()

    savePackageToCkanSpy.mockRestore()
  })
})
