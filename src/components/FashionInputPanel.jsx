import { useState, useRef } from 'react'

const FASHION_EXAMPLES = [
  {
    label: 'Minimalist basics',
    text: 'A minimalist womenswear brand offering timeless, sustainable basics made from organic cotton for urban professionals'
  },
  {
    label: 'Limited drop streetwear',
    text: 'A high-end streetwear label releasing monthly limited drops targeting Gen Z sneakerheads and culture makers in major cities'
  },
  {
    label: 'Luxury leather goods',
    text: 'A luxury leather goods brand selling handcrafted bags and accessories to discerning shoppers who value heritage craftsmanship over trends'
  },
  {
    label: 'Size-inclusive activewear',
    text: 'A size-inclusive activewear brand empowering women of all body types with bold, functional performance wear designed for everyday movement'
  }
]

export default function FashionInputPanel({ onGenerate }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const readImageFile = (file) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setImage({
        base64: dataUrl.split(',')[1],
        mediaType: file.type,
        name: file.name,
        previewUrl: dataUrl
      })
    }
    reader.readAsDataURL(file)
  }

  const clearImage = (e) => {
    e?.stopPropagation()
    setImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const canGenerate = text.trim().length >= 5 || !!image

  const handleGenerate = () => {
    if (canGenerate) {
      onGenerate(text.trim(), image ? { base64: image.base64, mediaType: image.mediaType } : null)
    }
  }

  return (
    <section className="input-section">
      <div className="input-card">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
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
              <img
                src={image.previewUrl}
                alt="Uploaded preview"
                id="preview-img"
              />
              <div className="upload-preview-info">
                <span className="upload-filename">{image.name}</span>
                <span className="upload-hint">Image ready — add text for more context, or generate now</span>
              </div>
              <button
                className="upload-clear"
                onClick={clearImage}
                type="button"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          ) : (
            <div className="upload-prompt">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="5.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 11l3.5-3 2.5 2.5 2-2 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Drop a photo or click to upload — mood board, outfit, lookbook, or product shot
            </div>
          )}
        </div>
        <div className="input-footer">
          <span className="char-count">{text.length} / 800</span>
          <button className="generate-btn" disabled={!canGenerate} onClick={handleGenerate}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Personas
          </button>
        </div>
      </div>
      <div className="examples-row">
        <span className="examples-row-label">Try:</span>
        {FASHION_EXAMPLES.map(e => (
          <button key={e.label} className="example-pill" onClick={() => setText(e.text)}>
            {e.label}
          </button>
        ))}
      </div>
    </section>
  )
}
