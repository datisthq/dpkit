import repl from "node:repl"
import { writeTempFile } from "@dpkit/dataset"
import { Command } from "commander"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useRecording } from "vitest-polly"
import * as sessionModule from "../../session.ts"
import { scriptTableCommand } from "./script.tsx"

useRecording()

describe("table script", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(repl, "start").mockReturnValue({
      context: {},
    } as any)

    vi.spyOn(sessionModule.Session, "create").mockImplementation(() => {
      const session = {
        task: vi.fn(async (_message: string, promise: Promise<any>) => {
          try {
            return await promise
          } catch (error) {
            console.log(String(error))
            return undefined
          }
        }),
        terminate: vi.fn((msg: string) => {
          throw new Error(msg)
        }),
      }
      return session as any
    })
  })

  it("should call session methods when starting a script session", async () => {
    const csvPath = await writeTempFile(
      "id,name,age\n1,alice,25\n2,bob,30\n3,charlie,35",
    )

    const command = new Command()
      .addCommand(scriptTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "script", csvPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle custom delimiter option", async () => {
    const csvPath = await writeTempFile("id|name|value\n1|test|100\n2|demo|200")

    const command = new Command()
      .addCommand(scriptTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "script",
        csvPath,
        "--delimiter",
        "|",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle query option", async () => {
    const csvPath = await writeTempFile(
      "id,name,age\n1,alice,25\n2,bob,30\n3,charlie,35",
    )

    const command = new Command()
      .addCommand(scriptTableCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "script",
        csvPath,
        "--query",
        "SELECT * FROM self WHERE age > 25",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })
})
