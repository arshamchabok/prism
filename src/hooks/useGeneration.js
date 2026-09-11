import { useEffect, useRef, useState } from 'react'
import { requestPersonas } from '../persona-client.js'

export function useGeneration(kind) {
  const [view, setView] = useState('input')
  const [personas, setPersonas] = useState([])
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [sessionCount, setSessionCount] = useState(0)
  const active = useRef(null)
  useEffect(() => () => { active.current?.abort(); active.current = null }, [])

  const handleGenerate = async (input, extra) => {
    if (active.current) return
    const controller = new AbortController()
    active.current = controller
    setDescription(input || 'Uploaded image')
    setError('')
    setView('loading')
    window.scrollTo({ top: 0, behavior: 'instant' })
    try {
      const result = await requestPersonas(kind, input, extra, controller.signal)
      if (active.current !== controller) return
      setPersonas(result)
      setSessionCount(count => count + 1)
      setView('results')
    } catch (err) {
      if (active.current !== controller || controller.signal.aborted) return
      setError(err.message)
      setView('error')
    } finally {
      if (active.current === controller) active.current = null
    }
  }
  const cancel = () => {
    active.current?.abort()
    active.current = null
    setView('input')
    setError('')
  }
  const reset = () => {
    cancel()
    setPersonas([])
    setDescription('')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return { view, personas, description, error, sessionCount, handleGenerate, reset, cancel }
}
