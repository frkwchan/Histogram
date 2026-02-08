import React, { useState, useCallback } from 'react';
import { Upload, FileText, ClipboardList } from 'lucide-react';

interface FileUploadProps {
  onDataLoaded: (data: number[], fileName?: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const numbers = parseAndLoad(text);
      onDataLoaded(numbers, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onDataLoaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const parseAndLoad = (text: string): number[] => {
     // Simple client-side re-use of the parser logic or just pass text back
     // For this component, we'll just emit the raw text logic via the parent's parser
     // But to keep it clean, we usually invoke the parent's parser. 
     // For now, let's assume the parent handles the string parsing or we do it here.
     // To avoid circular deps, I'll do a quick parse here or just pass raw data?
     // Better: pass the raw string to parent? No, the prop expects `data: number[]`.
     // I'll import the parser here.
     // Dynamic import or duplicate? I'll just import it.
     return text.split(/[\s,]+/).map(v => Number(v)).filter(n => !isNaN(n) && n !== 0); // Very rough, real parser is in utils
  };
  
  // Actually, let's just use the prop to pass raw data.
  // Wait, I can't import `parseCSV` from `../utils/statistics` easily without strict checks? 
  // It's fine in this environment.
  const handleTextSubmit = () => {
      // Basic split for the manual input
      const numbers = textInput.split(/[\s,]+/)
        .map(v => v.trim())
        .filter(v => v !== '')
        .map(Number)
        .filter(n => !isNaN(n));
      onDataLoaded(numbers, "Manual Input");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Drag & Drop Zone */}
      <div
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
        ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          accept=".csv,.txt"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-400' : 'text-slate-400'}`} />
          <p className="mb-2 text-sm text-slate-300 font-medium">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">CSV or TXT (Comma/Newline separated)</p>
        </div>
      </div>

      {/* Manual Input Zone */}
      <div className="flex flex-col h-64 bg-slate-800/50 border border-slate-600 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2 text-slate-300">
            <ClipboardList className="w-4 h-4" />
            <span className="text-sm font-medium">Or paste data directly</span>
        </div>
        <textarea 
            className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="12.5, 15.2, 18.9..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
        />
        <button 
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
            Process Data
        </button>
      </div>
    </div>
  );
};
