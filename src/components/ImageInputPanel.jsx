import { useEffect, useRef, useState } from 'react'
import { prepareImage } from '../utils/prepareImage.js'

export default function ImageInputPanel({ value, onChange, image, onImageChange, onGenerate, label, placeholder }) {
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileInput = useRef(null)
  const version = useRef(0)
  useEffect(() => () => { version.current++ }, [])
  const read = async file => {
    if (!file) return
    const current = ++version.current
    setProcessing(true)
    setError('')
    onImageChange(null)
    try {
      const result = await prepareImage(file)
      if (version.current === current) onImageChange(result)
    } catch (err) { if (version.current === current) setError(err.message) }
    finally { if (version.current === current) setProcessing(false) }
  }
  const clear = () => {
    version.current++
    onImageChange(null)
    setProcessing(false)
    setError('')
    if (fileInput.current) fileInput.current.value = ''
  }
  const ready = !processing && (value.trim().length >= 5 || !!image)
  return <section className="input-section">
    <form className={`input-card${dragging ? ' drag-over' : ''}`} onSubmit={event => {
      event.preventDefault()
      if (ready) onGenerate(value.trim(), image ? { base64: image.base64, mediaType: image.mediaType } : null)
    }} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); read(event.dataTransfer.files[0]) }}>
      <label className="input-label" htmlFor="brand-description">{label}</label>
      <textarea id="brand-description" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} maxLength={800} aria-describedby="image-help" />
      {image && <div className="upload-preview"><img src={image.previewUrl} alt="Image prepared for generation" /><span className="upload-filename">{image.name}</span><button type="button" className="upload-clear" onClick={clear} aria-label="Remove image">×</button></div>}
      <p id="image-help" className="input-help">JPEG, PNG, or WebP, up to 4 MB. Images are resized and file metadata is removed before sending.</p>
      {error && <p className="upload-error" role="alert">{error}</p>}
      {processing && <p className="input-help" role="status">Preparing image…</p>}
      <div className="input-footer">
        <button type="button" className="upload-trigger-btn" onClick={() => fileInput.current?.click()} aria-label="Upload image">+ Image</button>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={event => { read(event.target.files[0]); event.target.value = '' }} />
        <button className="generate-btn" disabled={!ready}>Generate Personas</button>
      </div>
    </form>
  </section>
}
