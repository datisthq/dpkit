import { useMutation } from "@tanstack/react-query"
import { newHttpBatchRpcSession } from "capnweb"
import type { Rpc } from "#rpc.ts"
import { store } from "./store.ts"

export function useValidatePackage() {
  return useMutation({
    mutationKey: ["validatePackage"],
    mutationFn: async (source: string) => {
      store.setState({ isDialogOpen: true })
      store.setState({ isPending: true })

      const rpc = newHttpBatchRpcSession<Rpc>("/rpc")
      const report = await rpc.validatePackage(source)

      store.setState({ isPending: false })
      store.setState({ report })
    },
  })
}
