import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import InsightsDisplay from '../components/InsightsDisplay';
import { uploadApi, insightsApi } from '../api/client';

interface Upload {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  hasInsights?: boolean;
}

interface Insight {
  id: string;
  type: string;
  content: {
    summary?: string;
    sentiment?: { label: string; score: number; explanation: string };
    keyInsights?: string[];
    imageDescription?: string;
    objects?: string[];
    themes?: string[];
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUploads = useCallback(async () => {
    try {
      const response = await uploadApi.list();
      setUploads(response.data.data);
    } catch (err) {
      console.error('Failed to fetch uploads:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const handleUploadComplete = (upload: Upload) => {
    setUploads((prev) => [upload, ...prev]);
    setSelectedUpload(upload);
    setInsights([]);
  };

  const handleSelectUpload = async (upload: Upload) => {
    setSelectedUpload(upload);
    setError(null);

    try {
      const response = await insightsApi.get(upload.id);
      setInsights(response.data.data);
    } catch {
      setInsights([]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedUpload) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await insightsApi.analyze(selectedUpload.id);
      setInsights(response.data.data);
      fetchUploads();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async (uploadId: string) => {
    try {
      await uploadApi.delete(uploadId);
      setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      if (selectedUpload?.id === uploadId) {
        setSelectedUpload(null);
        setInsights([]);
      }
    } catch (err) {
      console.error('Failed to delete upload:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Kentrick AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload & Files */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload onUploadComplete={handleUploadComplete} />

            {/* Files List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Your Files
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : uploads.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No files uploaded yet
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      onClick={() => handleSelectUpload(upload)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUpload?.id === upload.id
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {upload.filename}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(upload.fileSize)} •{' '}
                            {formatDate(upload.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {upload.hasInsights && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                              Analyzed
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(upload.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Analysis */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              {selectedUpload ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {selectedUpload.filename}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedUpload.fileType} •{' '}
                        {formatFileSize(selectedUpload.fileSize)}
                      </p>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          Analyze with AI
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {error}
                    </div>
                  )}

                  <InsightsDisplay insights={insights} isLoading={isAnalyzing} />
                </>
              ) : (
                <div className="text-center py-16">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No file selected
                  </h3>
                  <p className="text-gray-500">
                    Upload a file or select one from the list to analyze
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
