'use client';

import { useState } from 'react';
import { Resume } from '@/lib/types/resume';
import { ExportHandler } from '@/lib/exports/handlers';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';
type NotificationType = 'success' | 'error' | null;

interface Notification {
  type: NotificationType;
  message: string;
}

export default function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [resume, setResume] = useState<Resume | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'pdf' | 'docx' | 'xml' | 'csv' | 'markdown' | 'html'>('json');

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/)) {
      showNotification('error', 'Please upload a PDF or DOCX file');
      return;
    }

    try {
      setUploadState('uploading');
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      setResume(data.resume);
      setUploadState('success');
      showNotification('success', 'Resume uploaded successfully!');

    } catch (err) {
      setUploadState('error');
      showNotification('error', err instanceof Error ? err.message : 'Failed to upload resume');
    }
  };

  const handleExport = async () => {
    if (!resume) return;

    try {
      const exportHandler = new ExportHandler();
      let result;

      switch (exportFormat) {
        case 'pdf':
          result = await exportHandler.toPDF(resume);
          break;
        case 'docx':
          result = await exportHandler.toWord(resume);
          break;
        case 'xml':
          result = exportHandler.toXML(resume);
          break;
        case 'csv':
          result = exportHandler.toCSV(resume);
          break;
        case 'markdown':
          result = exportHandler.toMarkdown(resume);
          break;
        case 'html':
          result = exportHandler.toHTML(resume);
          break;
        default:
          result = JSON.stringify(resume, null, 2);
      }

      // Create and download file
      const blob = new Blob([result], { 
        type: `application/${exportFormat === 'docx' ? 'vnd.openxmlformats-officedocument.wordprocessingml.document' : exportFormat}` 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume.${exportFormat}`;
      a.click();
      showNotification('success', 'Resume exported successfully!');

    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to export resume');
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFileUpload(file);
        }}
      >
        {/* Loading Overlay */}
        {uploadState === 'uploading' && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        <input
          type="file"
          id="resume"
          className="hidden"
          accept=".pdf,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
        <label htmlFor="resume" className="flex flex-col items-center cursor-pointer">
          <svg
            className="w-12 h-12 text-blue-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3v-12"
            />
          </svg>
          <span className="text-lg mb-2">
            {uploadState === 'uploading' 
              ? 'Uploading...' 
              : 'Drag & drop your resume or click to browse'}
          </span>
          <span className="text-sm text-gray-500">
            Supports PDF and DOCX files
          </span>
        </label>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Resume Preview & Export */}
      {resume && (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Parsed Resume</h3>
            <div className="flex gap-4">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
              >
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
              </select>
              <button
                onClick={handleExport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Export
              </button>
            </div>
          </div>
          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto">
            <code>{JSON.stringify(resume, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}