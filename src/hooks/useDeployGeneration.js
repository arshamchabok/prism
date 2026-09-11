import { useGeneration } from './useGeneration.js'

export function useDeployGeneration() {
  const state = useGeneration('deploy')
  return { ...state, brandInput: state.description }
}
