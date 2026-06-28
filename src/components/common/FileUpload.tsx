'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  error?: string | null;
  success?: boolean;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = '.pdf',
  maxSizeMB = 10,
  disabled = false,
  error = null,
  success = false,
  className = '',
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // ── Validation ──────────────────────────────────────────────────────────────
  function validateFile(file: File): string | null {
    // Check file type
    if (accept === '.pdf' && file.type !== 'application/pdf') {
      return 'Apenas arquivos PDF são aceitos.';
    }

    // Check file size
    if (file.size > maxSizeBytes) {
      return `O arquivo deve ter no máximo ${maxSizeMB}MB.`;
    }

    return null;
  }

  // ── Handle file selection ───────────────────────────────────────────────────
  function handleFileChange(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      setLocalError(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      setSelectedFile(null);
      return;
    }

    setLocalError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }

  // ── Input change handler ────────────────────────────────────────────────────
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  }

  // ── Drag & drop handlers ────────────────────────────────────────────────────
  function handleDrag(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }

  // ── Remove file ─────────────────────────────────────────────────────────────
  function handleRemove() {
    setSelectedFile(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onFileRemove) {
      onFileRemove();
    }
  }

  // ── Open file picker ────────────────────────────────────────────────────────
  function handleClick() {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }

  const displayError = error || localError;
  const hasFile = !!selectedFile;

  return (
    <div className={`w-full ${className}`}>
      {/* Upload area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 ease-in-out
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
          ${displayError ? 'border-red-400 bg-red-50/50' : ''}
          ${success ? 'border-green-400 bg-green-50/50' : ''}
        `}
      >
        {!disabled && (
          <button
            type="button"
            onClick={handleClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="absolute inset-0 z-0 w-full h-full cursor-pointer rounded-lg"
            aria-label="Selecionar arquivo para upload"
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {hasFile ? (
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="pointer-events-none flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="pointer-events-auto flex-shrink-0 p-1.5 rounded-md hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="relative z-10 pointer-events-none flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Clique ou arraste seu currículo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF até {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mt-3 flex items-start gap-2 text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{displayError}</p>
        </div>
      )}

      {/* Success message */}
      {success && !displayError && (
        <div className="mt-3 flex items-start gap-2 text-green-600">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">Currículo enviado com sucesso!</p>
        </div>
      )}
    </div>
  );
}
