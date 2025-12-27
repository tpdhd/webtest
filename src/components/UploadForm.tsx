'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

interface UploadFormProps {
  categories: Category[]
  userId: string
}

export default function UploadForm({ categories, userId }: UploadFormProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [material, setMaterial] = useState('')
  const [printTime, setPrintTime] = useState('')
  const [layerHeight, setLayerHeight] = useState('')
  const [infill, setInfill] = useState('')
  const [supportsRequired, setSupportsRequired] = useState(false)

  // File state
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validExtensions = ['.stl', '.obj', '.gltf', '.glb']
      const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

      if (!validExtensions.includes(fileExt)) {
        setError('Please upload a valid 3D model file (.stl, .obj, .gltf, .glb)')
        return
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB')
        return
      }

      setModelFile(file)
      setError(null)
    }
  }

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate image
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file')
        return
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setPreviewImage(file)
      setPreviewImageUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsUploading(true)

    try {
      // Validation
      if (!title.trim()) {
        throw new Error('Title is required')
      }

      if (!modelFile) {
        throw new Error('3D model file is required')
      }

      if (!previewImage) {
        throw new Error('Preview image is required')
      }

      if (!categoryId) {
        throw new Error('Please select a category')
      }

      // 1. Upload model file to Supabase Storage
      const modelFileExt = modelFile.name.slice(modelFile.name.lastIndexOf('.'))
      const modelFileName = `${userId}/${Date.now()}${modelFileExt}`

      const { data: modelData, error: modelUploadError } = await supabase.storage
        .from('models')
        .upload(modelFileName, modelFile)

      if (modelUploadError) {
        throw new Error(`Failed to upload model: ${modelUploadError.message}`)
      }

      // Get public URL for model
      const { data: modelUrlData } = supabase.storage
        .from('models')
        .getPublicUrl(modelData.path)

      // 2. Upload preview image
      const imageExt = previewImage.name.slice(previewImage.name.lastIndexOf('.'))
      const imageFileName = `${userId}/${Date.now()}${imageExt}`

      const { data: imageData, error: imageUploadError } = await supabase.storage
        .from('images')
        .upload(imageFileName, previewImage)

      if (imageUploadError) {
        throw new Error(`Failed to upload image: ${imageUploadError.message}`)
      }

      // Get public URL for image
      const { data: imageUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(imageData.path)

      // 3. Create print record in database
      const { data: printData, error: dbError } = await supabase
        .from('prints')
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim() || null,
          category_id: categoryId,
          model_file_url: modelUrlData.publicUrl,
          preview_image_url: imageUrlData.publicUrl,
          file_format: modelFileExt.slice(1), // Remove dot
          file_size_bytes: modelFile.size,
          material: material.trim() || null,
          print_time_hours: printTime ? parseFloat(printTime) : null,
          layer_height_mm: layerHeight ? parseFloat(layerHeight) : null,
          infill_percentage: infill ? parseInt(infill) : null,
          supports_required: supportsRequired,
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (dbError) {
        throw new Error(`Failed to create print: ${dbError.message}`)
      }

      // Success! Redirect to the new print page
      router.push(`/prints/${printData.id}`)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload. Please try again.')
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Benchy Boat, Calibration Cube, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this print..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={categoryId?.toString()}
              onValueChange={(value) => setCategoryId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files */}
      <Card>
        <CardHeader>
          <CardTitle>Files *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 3D Model File */}
          <div>
            <Label htmlFor="modelFile">3D Model (.stl, .obj, .gltf, .glb)</Label>
            <div className="mt-2">
              <label
                htmlFor="modelFile"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {modelFile ? modelFile.name : 'Click to upload 3D model'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 100MB • STL, OBJ, GLTF, GLB
                  </p>
                </div>
              </label>
              <input
                type="file"
                id="modelFile"
                className="hidden"
                accept=".stl,.obj,.gltf,.glb"
                onChange={handleModelFileChange}
                required
              />
            </div>
          </div>

          {/* Preview Image */}
          <div>
            <Label htmlFor="previewImage">Preview Image</Label>
            <div className="mt-2">
              {previewImageUrl ? (
                <div className="relative">
                  <img
                    src={previewImageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null)
                      setPreviewImageUrl(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="previewImage"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload preview image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 5MB • JPG, PNG
                    </p>
                  </div>
                </label>
              )}
              <input
                type="file"
                id="previewImage"
                className="hidden"
                accept="image/*"
                onChange={handlePreviewImageChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Settings (optional) */}
      <Card>
        <CardHeader>
          <CardTitle>Print Settings (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="PLA, PETG, Resin..."
              />
            </div>

            <div>
              <Label htmlFor="printTime">Print Time (hours)</Label>
              <Input
                id="printTime"
                type="number"
                step="0.1"
                value={printTime}
                onChange={(e) => setPrintTime(e.target.value)}
                placeholder="4.5"
              />
            </div>

            <div>
              <Label htmlFor="layerHeight">Layer Height (mm)</Label>
              <Input
                id="layerHeight"
                type="number"
                step="0.01"
                value={layerHeight}
                onChange={(e) => setLayerHeight(e.target.value)}
                placeholder="0.2"
              />
            </div>

            <div>
              <Label htmlFor="infill">Infill (%)</Label>
              <Input
                id="infill"
                type="number"
                value={infill}
                onChange={(e) => setInfill(e.target.value)}
                placeholder="20"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="supports"
              checked={supportsRequired}
              onChange={(e) => setSupportsRequired(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="supports" className="cursor-pointer">
              Supports required
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isUploading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Print'}
        </Button>
      </div>
    </form>
  )
}
