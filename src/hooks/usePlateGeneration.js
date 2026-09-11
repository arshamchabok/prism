import { useGeneration } from './useGeneration.js'

export function usePlateGeneration() {
  const state = useGeneration('plate')
  return { ...state, brandInput: state.description }
}
