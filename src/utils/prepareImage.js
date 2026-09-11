import { IMAGE_LIMIT } from '../../shared/personas.js'

export async function prepareImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.')
  if (!file.size || file.size > IMAGE_LIMIT) throw new Error('Choose an image under 4 MB.')
  let bitmap
  try { bitmap = await createImageBitmap(file) }
  catch { throw new Error('This image could not be read. Try a different file.') }
  try {
    if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 40000000) throw new Error('This image has too many pixels. Please resize it first.')
    const ratio = Math.min(1, 1568 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio))
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Your browser could not prepare the image.')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    // Re-encoding pixels drops EXIF, location data, and the original file name.
    const previewUrl = canvas.toDataURL('image/jpeg', 0.9)
    const base64 = previewUrl.split(',')[1]
    if (!base64 || base64.length > Math.ceil(IMAGE_LIMIT / 3) * 4) throw new Error('The prepared image is too large. Try a smaller file.')
    return { base64, mediaType: 'image/jpeg', name: file.name, previewUrl }
  } finally { bitmap.close() }
}
