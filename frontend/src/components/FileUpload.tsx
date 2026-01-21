import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadApi } from '../api/client';

interface FileUploadProps {
  onUploadComplete: (upload: {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    createdAt: string;
    previewUrl?: string;
  }) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<{ url: string; name: string; type: string } | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }

      const isImage = file.type.startsWith('image/');
      let previewUrl: string | undefined;

      if (isImage) {
        previewUrl = URL.createObjectURL(file);
        setPreview({ url: previewUrl, name: file.name, type: file.type });
      } else {
        setPreview({ url: '', name: file.name, type: file.type });
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const response = await uploadApi.upload(file);

        clearInterval(progressInterval);
        setProgress(100);

        onUploadComplete({ ...response.data.data, previewUrl });

        setTimeout(() => {
          setProgress(0);
          setIsUploading(false);
        }, 500);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        setError(error.response?.data?.error || 'Upload failed');
        setIsUploading(false);
        setProgress(0);
        setPreview(null);
      }
    },
    [onUploadComplete, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload File</h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : isUploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="space-y-3">
            <div className="animate-pulse">
              <svg
                className="w-12 h-12 text-primary-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Uploading... {progress}%</p>
          </div>
        ) : (
          <>
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {isDragActive ? (
              <p className="text-primary-600 font-medium">Drop the file here</p>
            ) : (
              <>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium text-primary-600">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  TXT, CSV, MD, JSON, JPG, PNG, GIF, WEBP (max 10MB)
                </p>
              </>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {preview && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Preview</span>
            <button
              onClick={() => {
                if (preview.url) URL.revokeObjectURL(preview.url);
                setPreview(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {preview.url ? (
            <img
              src={preview.url}
              alt={preview.name}
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
          ) : (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-600 truncate">{preview.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
