import { requestPersonas } from './persona-client.js'

export const generatePlatePersonas = (description, extra, signal) => requestPersonas('plate', description, extra, signal)
