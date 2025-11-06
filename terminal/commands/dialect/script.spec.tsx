import repl from "node:repl"
import { writeTempFile } from "@dpkit/dataset"
import { Command } from "commander"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { scriptDialectCommand } from "./script.tsx"

describe("dialect script", () => {
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
    const dialectContent = JSON.stringify({
      delimiter: ",",
      header: true,
    })
    const dialectPath = await writeTempFile(dialectContent)

    const command = new Command()
      .addCommand(scriptDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "script", dialectPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle dialect with custom delimiter", async () => {
    const dialectContent = JSON.stringify({
      delimiter: "|",
      header: true,
      quoteChar: '"',
    })
    const dialectPath = await writeTempFile(dialectContent)

    const command = new Command()
      .addCommand(scriptDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "script", dialectPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle json output option", async () => {
    const dialectContent = JSON.stringify({
      delimiter: ",",
      header: true,
    })
    const dialectPath = await writeTempFile(dialectContent)

    const command = new Command()
      .addCommand(scriptDialectCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "script",
        dialectPath,
        "--json",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })
})
