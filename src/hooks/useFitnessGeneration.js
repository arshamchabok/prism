import { useGeneration } from './useGeneration.js'

export function useFitnessGeneration() {
  const state = useGeneration('fitness')
  return { ...state, brandInput: state.description }
}
