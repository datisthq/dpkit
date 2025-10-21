import { newHttpBatchRpcSession } from "capnweb"
import * as settings from "#settings.ts"
import type * as types from "#types/index.ts"

export function createRpcSession() {
  const url = import.meta.env.PROD
    ? new URL("/rpc", settings.URL).toString()
    : "/rpc"

  return newHttpBatchRpcSession<types.Rpc>(url)
}
