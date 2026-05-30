import { useState, useRef } from 'react'

export default function FashionInputPanel({ value, onChange, image, onImageChange, onGenerate }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const readImageFile = (file) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      onImageChange({
        base64: dataUrl.split(',')[1],
        mediaType: file.type,
        name: file.name,
        previewUrl: dataUrl,
      })
    }
    reader.readAsDataURL(file)
  }

  const clearImage = (e) => {
    e?.stopPropagation()
    onImageChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleChange = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    onChange(el.value)
  }

  const canGenerate = value.trim().length >= 5 || !!image

  const handleSubmit = () => {
    if (canGenerate) {
      onGenerate(value.trim(), image ? { base64: image.base64, mediaType: image.mediaType } : null)
    }
  }

  return (
    <section className="input-section">
      <div
        className={`input-card${isDragging ? ' drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer?.files[0]
          if (file) readImageFile(file)
        }}
      >
        <textarea
          value={value}
          onChange={handleChange}
          placeholder='Describe your clothing brand… e.g. "A minimalist womenswear label offering timeless, sustainable basics for urban professionals"'
          maxLength={800}
        />

        {/* Image preview — only visible when a file is loaded */}
        {image && (
          <div className="upload-preview" style={{ padding: '0.4rem 1.5rem 0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={image.previewUrl} alt="Uploaded preview" id="preview-img" />
            <div className="upload-preview-info">
              <span className="upload-filename">{image.name}</span>
              <span className="upload-hint">Image ready — add text for more context, or generate now</span>
            </div>
            <button className="upload-clear" onClick={clearImage} type="button" title="Remove image">
              &times;
            </button>
          </div>
        )}

        {/* Footer: paperclip trigger left, Generate button right */}
        <div className="input-footer" style={{ justifyContent: 'space-between' }}>
          <button
            className="upload-trigger-btn"
            onClick={() => fileInputRef.current?.click()}
            type="button"
            aria-label="Upload image"
          >
            <svg
              width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) readImageFile(e.target.files[0]) }}
          />
          <button className="generate-btn" disabled={!canGenerate} onClick={handleSubmit}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Personas
          </button>
        </div>
      </div>
    </section>
  )
}
