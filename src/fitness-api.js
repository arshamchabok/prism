import { requestPersonas } from './persona-client.js'

export const generateFitnessPersonas = (description, extra, signal) => requestPersonas('fitness', description, extra, signal)
