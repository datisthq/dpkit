import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export function createStore<T>(initialState?: T) {
  const useState = create(immer(() => initialState ?? ({} as T)))
  const getState = useState.getState
  const setState = useState.setState

  return { useState, getState, setState }
}
