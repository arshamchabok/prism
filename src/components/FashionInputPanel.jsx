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
      <div className="input-card">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder='Describe your clothing brand… e.g. "A minimalist womenswear label offering timeless, sustainable basics for urban professionals"'
          maxLength={800}
        />
        <div
          className={`upload-zone${isDragging ? ' drag-over' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer?.files[0]
            if (file) readImageFile(file)
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) readImageFile(e.target.files[0]) }}
          />
          {image ? (
            <div className="upload-preview">
              <img src={image.previewUrl} alt="Uploaded preview" id="preview-img" />
              <div className="upload-preview-info">
                <span className="upload-filename">{image.name}</span>
                <span className="upload-hint">Image ready — add text for more context, or generate now</span>
              </div>
              <button className="upload-clear" onClick={clearImage} type="button" title="Remove image">
                &times;
              </button>
            </div>
          ) : (
            <div className="upload-prompt">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="5.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 11l3.5-3 2.5 2.5 2-2 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Drop a photo or click to upload — mood board, outfit, lookbook, or product shot
            </div>
          )}
        </div>
        <div className="input-footer">
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
