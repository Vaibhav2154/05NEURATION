import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ status: 'idle' });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus({ status: 'idle' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus({ status: 'uploading' });

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadStatus({ status: 'success', message: data.message });
    } catch (error) {
      setUploadStatus({
        status: 'error',
        message: 'Failed to upload file. Please try again.',
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-blue-200 mb-2" />
              <p className="text-sm text-blue-200">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.csv"
            />
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploadStatus.status === 'uploading'}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !file || uploadStatus.status === 'uploading'
              ? 'bg-blue-800 text-blue-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {uploadStatus.status === 'uploading' ? 'Uploading...' : 'Upload File'}
        </button>

        {uploadStatus.status !== 'idle' && (
          <div
            className={`flex items-center gap-2 text-sm ${
              uploadStatus.status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {uploadStatus.status === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
