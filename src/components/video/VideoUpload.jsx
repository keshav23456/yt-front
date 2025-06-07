import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uploadVideo } from '../../store/slices/videoSlice';
import { Button, Input } from '../common';
import { Upload, X, Video, Image } from 'lucide-react';

const VideoUpload = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setFormData(prev => ({
          ...prev,
          videoFile: file
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.videoFile) {
      newErrors.videoFile = 'Video file is required';
    }
    
    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('videoFile', formData.videoFile);
      uploadData.append('thumbnail', formData.thumbnail);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);
      
      const result = await dispatch(uploadVideo(uploadData));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setUploadProgress(100);
        setTimeout(() => {
          onSuccess?.(result.payload);
          onClose?.();
        }, 1000);
      } else {
        throw new Error(result.payload || 'Upload failed');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upload Video</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video File
          </label>
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center
              ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
              ${formData.videoFile ? 'border-green-500 bg-green-50' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={videoInputRef}
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleChange}
              className="hidden"
            />
            
            {formData.videoFile ? (
              <div className="flex items-center justify-center space-x-2">
                <Video className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {formData.videoFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, videoFile: null }))}
                  className="p-1 hover:bg-red-100 rounded-full"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop your video here, or{' '}
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    click to browse
                  </button>
                </p>
                <p className="text-xs text-gray-500">
                  MP4, WebM, or MOV up to 100MB
                </p>
              </div>
            )}
          </div>
          {errors.videoFile && (
            <p className="mt-1 text-sm text-red-600">{errors.videoFile}</p>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail
          </label>
          <div className="flex items-center space-x-4">
            <input
              ref={thumbnailInputRef}
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            
            {formData.thumbnail ? (
              <div className="flex items-center space-x-2">
                <img
                  src={URL.createObjectURL(formData.thumbnail)}
                  alt="Thumbnail preview"
                  className="w-20 h-12 object-cover rounded"
                />
                <span className="text-sm text-gray-600">{formData.thumbnail.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
                  className="p-1 hover:bg-red-100 rounded-full"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Image className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Choose thumbnail</span>
              </button>
            )}
          </div>
          {errors.thumbnail && (
            <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="Enter video title"
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`
              block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
              placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
              ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            `}
            placeholder="Tell viewers about your video"
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isUploading}
            loading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;
