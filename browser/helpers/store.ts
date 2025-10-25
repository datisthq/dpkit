import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export function createStore<T>(name: string, initialState?: T) {
  const useState = create(
    devtools(
      immer(() => initialState ?? ({} as T)),
      { name },
    ),
  )

  const getState = useState.getState
  const setState = useState.setState

  return { useState, getState, setState }
}
