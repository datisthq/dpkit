import http from "node:http"
import { RpcTarget, nodeHttpBatchRpcResponse } from "capnweb"
import { validatePackage } from "#routes/package/validate/services.ts"

export class Rpc extends RpcTarget {
  validatePackage = validatePackage

  hello(name: string) {
    return `Hello, ${name}!`
  }
}

const server = http.createServer(async (request, response) => {
  try {
    await nodeHttpBatchRpcResponse(request, response, new Rpc())
  } catch (err: any) {
    response.end(String(err?.stack || err))
  }
})

server.listen(8080)
