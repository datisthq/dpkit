import { createContext as reactCreateContext } from "react"
import { useContext as reactUseContext } from "react"

export function createContext<T>() {
  const Context = reactCreateContext<T | undefined>(undefined)

  const useContext = () => {
    const context = reactUseContext(Context)

    if (!context) {
      throw new Error("Missing context provider")
    }

    return context
  }

  return [Context, useContext] as const
}
