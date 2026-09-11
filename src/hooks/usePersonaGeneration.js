import { useGeneration } from './useGeneration.js'

export function usePersonaGeneration() {
  const state = useGeneration('main')
  return { ...state, productInput: state.description }
}
