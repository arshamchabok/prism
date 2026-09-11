import { requestPersonas } from './persona-client.js'

export const generateDeployPersonas = (description, extra, signal) => requestPersonas('deploy', description, extra, signal)
