/**
 * Compresses an image file to reduce size for upload
 * Targets a maximum size while maintaining reasonable quality
 */

export interface CompressOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    maxSizeKB?: number
}

const DEFAULT_OPTIONS: CompressOptions = {
    maxWidth: 1200,      // Max width in pixels
    maxHeight: 1600,     // Max height in pixels
    quality: 0.7,        // JPEG quality (0-1)
    maxSizeKB: 500,      // Target max size in KB
}

/**
 * Compresses an image file and returns a base64 data URL
 */
export async function compressImage(
    file: File,
    options: CompressOptions = {}
): Promise<string> {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    return new Promise((resolve, reject) => {
        // If it's a PDF, don't try to compress - read as-is
        if (file.type === 'application/pdf') {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => reject(new Error('Failed to read PDF'))
            reader.readAsDataURL(file)
            return
        }

        // For images, compress using canvas
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
        }

        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let { width, height } = img

            if (width > (opts.maxWidth || 1200)) {
                height = (height * (opts.maxWidth || 1200)) / width
                width = opts.maxWidth || 1200
            }

            if (height > (opts.maxHeight || 1600)) {
                width = (width * (opts.maxHeight || 1600)) / height
                height = opts.maxHeight || 1600
            }

            canvas.width = width
            canvas.height = height

            // Draw and compress
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)

            // Start with initial quality
            let quality = opts.quality || 0.7
            let result = canvas.toDataURL('image/jpeg', quality)

            // If still too large, reduce quality iteratively
            const maxSizeBytes = (opts.maxSizeKB || 500) * 1024

            while (result.length > maxSizeBytes && quality > 0.1) {
                quality -= 0.1
                result = canvas.toDataURL('image/jpeg', quality)
            }

            // If still too large, reduce dimensions
            if (result.length > maxSizeBytes && width > 600) {
                canvas.width = width * 0.5
                canvas.height = height * 0.5
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                result = canvas.toDataURL('image/jpeg', 0.6)
            }

            resolve(result)
        }

        img.onerror = () => {
            reject(new Error('Failed to load image'))
        }

        // Load image from file
        const reader = new FileReader()
        reader.onloadend = () => {
            img.src = reader.result as string
        }
        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }
        reader.readAsDataURL(file)
    })
}

/**
 * Estimates the size of a base64 string in KB
 */
export function getBase64SizeKB(base64String: string): number {
    // Base64 encoding increases size by ~33%, and the header adds some bytes
    const base64Data = base64String.split(',')[1] || base64String
    return Math.ceil((base64Data.length * 3) / 4 / 1024)
}
