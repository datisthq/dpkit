import { writeTempFile } from "@dpkit/file"
import * as lib from "@dpkit/lib"
import { useRecording } from "@dpkit/test"
import { Command } from "commander"
import { describe, expect, it, vi } from "vitest"
import { githubPublishPackageCommand } from "./github.ts"

useRecording()

describe("package publish github", () => {
  it("should attempt to publish package to GitHub", async () => {
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

    const savePackageToGithubSpy = vi
      .spyOn(lib, "savePackageToGithub")
      .mockResolvedValue({
        path: "https://github.com/test-org/test-repo/releases/tag/v1.0.0",
        repoUrl: "https://github.com/test-org/test-repo",
      })

    const command = new Command()
      .addCommand(githubPublishPackageCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "github",
        packagePath,
        "--to-github-api-key",
        "test-key",
        "--to-github-org",
        "test-org",
        "--to-github-repo",
        "test-repo",
        "--silent",
      ])
    } catch (error) {}

    expect(savePackageToGithubSpy).toHaveBeenCalled()

    savePackageToGithubSpy.mockRestore()
  })
})
