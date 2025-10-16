import { makeLink } from "#helpers/link.ts"
import { useSystemContext } from "./context.ts"

export function usePayload() {
  const { payload } = useSystemContext()

  return {
    ...payload,
    languageId: payload.language.languageId,
    pageId: payload.page.pageId,
  }
}

export function useMakeLink() {
  const payload = usePayload()

  return (options: Partial<Parameters<typeof makeLink>[0]>) => {
    const { pageId, ...restOptions } = options

    return makeLink({
      languageId: payload.language.languageId,
      pageId: pageId ?? payload.page.pageId,
      ...restOptions,
    })
  }
}
