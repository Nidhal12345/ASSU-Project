import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X } from "lucide-react"

interface FileUploadProps {
  label: string
  file: File | null
  setFile: (file: File | null) => void
  acceptedFileTypes: string
}

export default function FileUpload({ label, file, setFile, acceptedFileTypes }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">Cliquez pour téléverser</span> ou glissez-déposez
            </div>
            <p className="text-xs text-gray-400">PDF, JPG ou PNG (max. 10 Mo)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-gray-500" />
            <div className="text-sm truncate max-w-[200px] sm:max-w-xs">{file.name}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveFile} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
