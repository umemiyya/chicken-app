'use client'

import { Upload, X } from 'lucide-react'
import { ChangeEvent, DragEvent, useState } from 'react'

interface UploadBoxProps {
  onImageSelect: (file: File) => void
}

export function UploadBox({ onImageSelect }: UploadBoxProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files?.[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    }
  }

  const clearPreview = () => {
    setPreview(null)
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden border-2 border-border">
          <img src={preview} alt="Preview" className="w-full h-auto object-cover" />
          <button
            onClick={clearPreview}
            className="absolute top-4 right-4 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        dragActive
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer block">
        <div className="flex justify-center mb-4">
          <Upload className="text-primary" size={48} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Seret dan lepas gambar di sini
        </h3>
        <p className="text-muted-foreground mb-4">
          atau klik untuk memilih file
        </p>
        <p className="text-xs text-muted-foreground">
          Format: JPG, PNG, WebP (Max 10MB)
        </p>
      </label>
    </div>
  )
}
