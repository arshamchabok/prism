import { requestPersonas } from './persona-client.js'

export const generatePersonas = (description, extra, signal) => requestPersonas('main', description, extra, signal)
