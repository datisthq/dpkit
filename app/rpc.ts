import http from "node:http"
import { RpcTarget, nodeHttpBatchRpcResponse } from "capnweb"
import { logger } from "#logger.ts"
import { validatePackage } from "#routes/package/validate/services.ts"

export class Rpc extends RpcTarget {
  validatePackage(...args: Parameters<typeof validatePackage>) {
    return validatePackage(...args)
  }
}

const server = http.createServer(async (request, response) => {
  try {
    await nodeHttpBatchRpcResponse(request, response, new Rpc())
    logger.info(`[${request.method}] ${request.url}`, response.statusCode)
  } catch (error: any) {
    logger.error(`[${request.method}] ${request.url}`, error)
    response.end("Internal Error")
  }
})

server.listen(8080, () => {
  logger.info("RPC server listening on port 8080")
})
