import repl from "node:repl"
import { Command } from "commander"
import { writeTempFile } from "frictionless-ts"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as sessionModule from "../../session.ts"
import { scriptSchemaCommand } from "./script.tsx"

describe("schema script", () => {
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
    const schemaDescriptor = JSON.stringify({
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    })
    const descriptorPath = await writeTempFile(schemaDescriptor)

    const command = new Command()
      .addCommand(scriptSchemaCommand)
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

  it("should handle schema with constraints", async () => {
    const schemaDescriptor = JSON.stringify({
      fields: [
        { name: "id", type: "integer", constraints: { required: true } },
        { name: "email", type: "string", format: "email" },
      ],
    })
    const descriptorPath = await writeTempFile(schemaDescriptor)

    const command = new Command()
      .addCommand(scriptSchemaCommand)
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
    const schemaDescriptor = JSON.stringify({
      fields: [
        { name: "id", type: "integer" },
        { name: "value", type: "number" },
      ],
    })
    const descriptorPath = await writeTempFile(schemaDescriptor)

    const command = new Command()
      .addCommand(scriptSchemaCommand)
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
