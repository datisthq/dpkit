import repl from "node:repl"
import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { scriptResourceCommand } from "./script.tsx"

describe("resource script", () => {
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
    const resourceDescriptor = JSON.stringify({
      name: "test-resource",
      path: "data.csv",
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
    })
    const descriptorPath = await writeTempFile(resourceDescriptor)

    const command = new Command()
      .addCommand(scriptResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "script", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle resource with format", async () => {
    const resourceDescriptor = JSON.stringify({
      name: "test-resource",
      path: "data.json",
      format: "json",
    })
    const descriptorPath = await writeTempFile(resourceDescriptor)

    const command = new Command()
      .addCommand(scriptResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync(["node", "test", "script", descriptorPath])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })

  it("should handle json output option", async () => {
    const resourceDescriptor = JSON.stringify({
      name: "test-resource",
      path: "data.csv",
    })
    const descriptorPath = await writeTempFile(resourceDescriptor)

    const command = new Command()
      .addCommand(scriptResourceCommand)
      .configureOutput({
        writeOut: () => {},
        writeErr: () => {},
      })

    try {
      await command.parseAsync([
        "node",
        "test",
        "script",
        descriptorPath,
        "--json",
      ])
    } catch (error) {}

    const mockSession = vi.mocked(sessionModule.Session.create).mock.results[0]
      ?.value
    expect(mockSession).toBeDefined()
    expect(mockSession.task).toHaveBeenCalled()
  })
})
