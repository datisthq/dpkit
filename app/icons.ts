import { Share2, Upload } from "lucide-react"
import { detectPlatform } from "#helpers/platform.ts"

export { Sun as LightTheme } from "lucide-react"
export { Moon as DarkTheme } from "lucide-react"
export { Loader } from "lucide-react"
export { Languages as Language } from "lucide-react"
export { Github as GitHub } from "lucide-react"
export { ExternalLink } from "lucide-react"

export const Share = detectPlatform() === "ios" ? Upload : Share2
