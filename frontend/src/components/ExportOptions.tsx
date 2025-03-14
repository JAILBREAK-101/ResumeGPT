'use client';

import { useState } from 'react';
import { ExportOptions as ExportOptionsType } from '@/lib/exports/types';
import { Select } from '@/components/ui/Select';

const exportFormatOptions = [
  { value: 'json', label: 'JSON' },
  { value: 'pdf', label: 'PDF (ATS-friendly)' },
  { value: 'docx', label: 'Word Document' },
  { value: 'xml', label: 'XML' },
  { value: 'csv', label: 'CSV (Spreadsheet)' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
];

export default function ExportOptions({ 
  onExport 
}: { 
  onExport: (options: ExportOptionsType) => void 
}) {
  const [format, setFormat] = useState<ExportOptionsType['format']>('json');

  return (
    <div className="flex items-end gap-2">
      <Select
        label="Export Format"
        value={format}
        onChange={(e) => setFormat(e.target.value as ExportOptionsType['format'])}
        options={exportFormatOptions}
      />
      <button 
        onClick={() => onExport({ format })}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Export
      </button>
    </div>
  );
}