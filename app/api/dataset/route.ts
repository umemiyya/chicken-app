import { readdirSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const datasetDir = join(process.cwd(), 'public', 'dataset')
    
    // Read files from dataset directory
    const files = readdirSync(datasetDir).filter((file) => {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    })

    // Map files to image objects
    const images = files.map((file) => ({
      name: file,
      path: `/dataset/${file}`,
      url: `/dataset/${file}`,
    }))

    return Response.json({
      success: true,
      count: images.length,
      images: images,
    })
  } catch (error) {
    console.error('[v0] Error reading dataset directory:', error)
    return Response.json({
      success: false,
      error: 'Failed to read dataset directory',
      images: [],
      count: 0,
    })
  }
}
