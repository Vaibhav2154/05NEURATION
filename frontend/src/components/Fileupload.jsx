// File: Fileupload.jsx
import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/Fileupload.css';
import { useAuth } from './authcontext';

export default function FileUpload() {
  const { user } = useAuth();
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
    if (!file || !user) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user.id);

    setUploadStatus({ status: 'uploading' });

    try {
      const response = await fetch('http://localhost:5000/extract', {
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
    <div className="file-upload-container">
      <div className="file-upload-inner">
        <div className="w-full">
          <label htmlFor="file-upload" className="file-upload-dropzone">
            <div className="file-upload-content">
              <Upload className="file-upload-icon" />
              <div className="file-upload-text-container">
                <p className="file-upload-text">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              required
            />
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploadStatus.status === 'uploading'}
          className={`file-upload-button ${
            !file || uploadStatus.status === 'uploading' ? 'disabled' : 'enabled'
          }`}
        >
          {uploadStatus.status === 'uploading' ? 'Uploading...' : 'Upload File'}
        </button>

        {uploadStatus.status !== 'idle' && (
          <div
            className={`upload-status ${
              uploadStatus.status === 'success' ? 'upload-success' : 'upload-error'
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