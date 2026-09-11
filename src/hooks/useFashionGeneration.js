import { useGeneration } from './useGeneration.js'

export function useFashionGeneration() {
  const state = useGeneration('fashion')
  return { ...state, brandInput: state.description }
}
