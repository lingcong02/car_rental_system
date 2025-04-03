"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ImageUploader() {
  const [previews, setPreviews] = useState<{url: string, name: string}[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    
    // Validate file count
    if (newFiles.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    
    // Create previews
    const newPreviews = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warning('No files selected');
      return;
    }
  
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
  
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      // First check if response is OK
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use status text
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }
  
      // Now safely parse the JSON
      const result = await response.json();
      
      toast.success('Images uploaded successfully');
      console.log('Uploaded files:', result.files);
      
      // Reset form
      setFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/jpeg, image/png, image/webp, image/gif, image/svg+xml"
        className="hidden"
        disabled={isUploading}
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 sm:flex-none"
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Images
        </Button>
        
        {files.length > 0 && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 sm:flex-none"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : `Upload ${files.length} Image(s)`}
          </Button>
        )}
      </div>
      
      {/* Image preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group h-48 flex flex-col">
              <div className="flex-1 relative overflow-hidden rounded-lg border">
                <img
                  src={preview.url}
                  alt={`Preview ${preview.name}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground truncate">
                {preview.name}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-sm text-muted-foreground">
        {files.length} image(s) selected (max 10)
      </p>
    </div>
  );
}