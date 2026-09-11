import { requestPersonas } from './persona-client.js'

export const generateFashionPersonas = (description, extra, signal) => requestPersonas('fashion', description, extra, signal)
