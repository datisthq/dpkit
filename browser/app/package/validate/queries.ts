import { useMutation } from "@tanstack/react-query"
import { api } from "#services/api.ts"
import { store } from "./store.ts"

export function useValidatePackage() {
  return useMutation({
    mutationKey: ["validatePackage"],
    mutationFn: async (input: Parameters<typeof api.package.validate>[0]) => {
      return await api.package.validate(input)
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
    onError: error => {
      console.log(error)
      store.setState({ error })
    },
  })
}
