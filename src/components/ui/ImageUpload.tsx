'use client';

import React, { useState, useRef } from 'react';
import { FaUpload, FaImage, FaTimes, FaSpinner } from 'react-icons/fa';

interface ImageUploadProps {
  entityId: number;
  entityType: 'sponsor' | 'featured-performer' | 'program-director';
  imageType: string;
  eventId: number;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  entityId,
  entityType,
  imageType,
  eventId,
  currentImageUrl,
  onImageUploaded,
  onError,
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      onError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call the backend API directly for image upload
      const response = await fetch(`/api/event-medias/upload/${entityType}/${entityId}/${imageType}?eventId=${eventId}&title=${imageType}&description=Uploaded image&tenantId=${process.env.NEXT_PUBLIC_TENANT_ID}&isPublic=true`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const result = await response.json();
      onImageUploaded(result.url || result.imageUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      onError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <FaSpinner className="animate-spin text-2xl mb-2" />
            <p className="text-sm">Uploading...</p>
          </div>
        ) : currentImageUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={currentImageUrl}
              alt={`${imageType} preview`}
              className="w-20 h-20 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-600">Click to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <FaImage className="text-3xl mb-2" />
            <p className="text-sm">Click to upload {imageType}</p>
            <p className="text-xs text-gray-400">or drag and drop</p>
          </div>
        )}
      </div>
    </div>
  );
}
