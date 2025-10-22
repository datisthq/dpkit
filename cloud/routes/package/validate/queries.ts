import { useMutation } from "@tanstack/react-query"
import { service } from "#service.ts"
import { store } from "./store.ts"

export function useValidatePackage() {
  return useMutation({
    mutationKey: ["validatePackage"],
    mutationFn: async (
      input: Parameters<typeof service.package.validate>[0],
    ) => {
      return await service.package.validate(input)
    },
    onMutate: () => {
      store.setState({ isDialogOpen: true })
      store.setState({ isPending: true })
    },
    onSettled: () => {
      store.setState({ isPending: false })
    },
    onSuccess: report => {
      store.setState({ report })
    },
    onError: () => {
      store.setState({ isFault: true })
    },
  })
}
