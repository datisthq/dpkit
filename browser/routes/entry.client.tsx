import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"
import { activateLocal, detectClientLocal } from "#helpers/locale.ts"

const languageId = await detectClientLocal()
await activateLocal(languageId)

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  )
})
