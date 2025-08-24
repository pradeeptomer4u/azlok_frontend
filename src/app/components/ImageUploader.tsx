import React, { useState, useRef } from 'react';
import { XCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  folder?: string;
  className?: string;
  maxSize?: number; // in MB
}

interface UploadResponse {
  filename: string;
  original_filename: string;
  size: number;
  content_type: string;
  url: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  folder = 'products',
  className = '',
  maxSize = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSizeBytes) {
      setError(`File size too large. Max size: ${maxSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/seller/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload image');
      }

      const data: UploadResponse = await response.json();
      onImageUploaded(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
          >
            <XCircleIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ) : (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-48 cursor-pointer hover:border-blue-500 transition-colors"
        >
          <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Click to upload an image
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, GIF, WEBP up to {maxSize}MB
          </p>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-md">
          <div className="loader"></div>
          <span className="ml-2 text-sm font-medium">Uploading...</span>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      <style jsx>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
