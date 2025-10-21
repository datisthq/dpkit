import { Share2, Upload } from "lucide-react"
import { detectPlatform } from "#helpers/platform.ts"

export { Sun as LightTheme } from "lucide-react"
export { Moon as DarkTheme } from "lucide-react"
export { Loader as Pending } from "lucide-react"
export { Languages as Language } from "lucide-react"
export { Github as GitHub } from "lucide-react"
export { ExternalLink } from "lucide-react"
export { CheckCircle as Success } from "lucide-react"
export { XCircle as Error } from "lucide-react"
export { Ban as Fault } from "lucide-react"
export { FileJson as Json } from "lucide-react"
export { Globe as Url } from "lucide-react"
export { Upload as File } from "lucide-react"
export { FileText as Text } from "lucide-react"

export const Share = detectPlatform() === "ios" ? Upload : Share2
