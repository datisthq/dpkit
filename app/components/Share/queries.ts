import { useClipboard } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { useMutation } from "@tanstack/react-query"
import { cloneDeep } from "es-toolkit"
import { useTranslation } from "react-i18next"
import invariant from "tiny-invariant"
import { useListFavorites } from "#components/Favorite/index.ts"
import { showNotification } from "#components/Notification/index.ts"
import { useConfig } from "#components/Search/index.ts"
import { useLocation } from "#components/System/index.ts"
import { usePayload } from "#components/System/index.ts"
import { rpc } from "#endpoints/client.ts"
import { makeLink } from "#helpers/link.ts"
import * as settings from "#settings.ts"
import type * as types from "#types/index.ts"

export function useSharePage() {
  const { t } = useTranslation()
  const location = useLocation()
  const favorites = useListFavorites().data
  const clipboard = useClipboard()
  const searchConfig = useConfig()
  const { languageId, countryId, searchType, searchMode } = usePayload()

  return useMutation({
    mutationFn: async () => {
      let path = location?.pathname ?? "/"
      let config: types.ReadConfig | undefined

      if (searchMode === "preset") {
        config = cloneDeep(searchConfig)
      }

      if (searchMode === "favorites") {
        config = {
          ...config,
          carIds: favorites
            ?.filter(car => !car.deletedAt)
            .map(car => car.carId),
        }
      }

      if (config) {
        invariant(searchType, "searchType is required")

        const prompt = await rpc.ensurePrompt.query({
          languageId,
          countryId,
          searchType,
          config,
        })

        if (prompt) {
          path = makeLink({
            languageId,
            countryId,
            pageId: "carSearch",
            params: { promptSlug: prompt.slug },
          })
        }
      }

      const share = await rpc.createShare.mutate({ path })
      const url = `${settings.URL}/${share.slug}`

      return url
    },
    onSuccess: url => {
      clipboard.copy(url)
    },
    onError: () => {
      modals.closeAll()

      showNotification({
        title: t("Please try again later"),
        message: t("Failed to share the page"),
        type: "error",
      })
    },
  })
}
