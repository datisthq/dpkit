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
    // For health-checks we just return 200
    if (request.url === "/") {
      response.statusCode = 200
      response.end()
      return
    }

    await nodeHttpBatchRpcResponse(request, response, new Rpc())
  } catch (error: any) {
    response.statusCode = 500
    response.end("Internal Error")

    logger.error(error)
  } finally {
    logger.info(`[${request.method}] ${request.url}`, response.statusCode)
  }
})

server.listen(8080, () => {
  logger.info("Listening on port 8080")
})
