import { useMutation } from "@tanstack/react-query"
import { createRpcSession } from "#helpers/rpc.ts"
import type { validatePackage } from "./services.ts"
import { store } from "./store.ts"

export function useValidatePackage() {
  return useMutation({
    mutationKey: ["validatePackage"],
    mutationFn: async (source: Parameters<typeof validatePackage>[0]) => {
      store.setState({ isDialogOpen: true })
      store.setState({ isPending: true })

      const rpc = createRpcSession()
      const report = await rpc.validatePackage(source)

      store.setState({ isPending: false })
      store.setState({ report })
    },
    onError: () => {
      store.setState({ isPending: false })
      store.setState({ isError: true })
    },
  })
}
