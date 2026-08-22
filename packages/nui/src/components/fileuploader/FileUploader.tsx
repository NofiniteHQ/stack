"use client";

import React, { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { cn } from '../../utils';

/* ============================================================
 * Helper
 * ============================================================ */

/**
 * Formats a byte count into a human-readable string (e.g., 1.5 MB).
 */
function formatBytes(bytes: number, decimals = 2) {
 if (!+bytes) return '0 Bytes';
 const k = 1024;
 const dm = decimals < 0 ? 0 : decimals;
 const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/* ============================================================
 * Types
 * ============================================================ */

export interface FileUploaderProps {
 /** Controlled state for the selected files */
 value?: File[];
 /** Uncontrolled initial state for the selected files */
 defaultValue?: File[];
 /** Callback fired when the list of selected files changes */
 onChange?: (files: File[]) => void;
 /** Whether to allow multiple files to be selected. Defaults to false. */
 multiple?: boolean;
 /** A comma-separated list of allowed file extensions or MIME types (e.g., '.jpg, .png, application/pdf') */
 accept?: string;
 /** Maximum allowed file size in bytes */
 maxSize?: number;
 /** Custom class name applied to the root container */
 className?: string;
 /** Custom text or element displayed inside the dropzone (Primary Title) */
 placeholder?: React.ReactNode;
 /** Secondary text or description below the placeholder */
 description?: React.ReactNode;
 /** Disables the dropzone and prevents file selection */
 disabled?: boolean;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * FileUploader Component
 * * A drag-and-drop zone for file uploads with built-in preview and file management.
 * * Follows WAI-ARIA guidelines by delegating keyboard interactions to a hidden native file input.
 */
export function FileUploader({
 value,
 defaultValue,
 onChange,
 multiple = false,
  accept,
  maxSize,
  className,
  placeholder,
  description,
  disabled = false,
}: FileUploaderProps) {
 const inputRef = useRef<HTMLInputElement | null>(null);
 
 const isControlled = value !== undefined;
 const [internalFiles, setInternalFiles] = useState<File[]>(defaultValue || []);
 const files = isControlled ? value : internalFiles;
 
 const [isDragOver, setIsDragOver] = useState(false);

 /* ----------------------------------------------------
 File Handlers
 ---------------------------------------------------- */
 const updateFiles = useCallback((newFiles: File[]) => {
 let validFiles = newFiles;

 // Filter by max size if provided
 if (maxSize) {
 validFiles = newFiles.filter(f => f.size <= maxSize);
 }

 const nextFiles = multiple ? [...files, ...validFiles] : [validFiles[0]].filter(Boolean);
 
 if (!isControlled) setInternalFiles(nextFiles);
 onChange?.(nextFiles);
 }, [files, multiple, maxSize, isControlled, onChange]);

 const removeFile = (fileToRemove: File) => {
 if (disabled) return;
 const nextFiles = files.filter(f => f !== fileToRemove);
 if (!isControlled) setInternalFiles(nextFiles);
 onChange?.(nextFiles);
 };

 /* ----------------------------------------------------
 Event Listeners
 ---------------------------------------------------- */
 const onDragOver = (e: DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 e.stopPropagation();
 if (!disabled) setIsDragOver(true);
 };

 const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 e.stopPropagation();
 setIsDragOver(false);
 };

 const onDrop = (e: DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 e.stopPropagation();
 setIsDragOver(false);
 
 if (disabled) return;
 if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
 updateFiles(Array.from(e.dataTransfer.files));
 }
 };

 const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
 if (e.target.files && e.target.files.length > 0) {
 updateFiles(Array.from(e.target.files));
 }
 // Clear the native input value so the exact same file can be selected again if removed
 if (inputRef.current) inputRef.current.value = '';
 };

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 return (
 <div className={cn("flex flex-col gap-4 font-sans box-border", className)}>
 
 {/* DROP ZONE */}
 <div
 role="button"
 tabIndex={disabled ? -1 : 0}
 aria-label="Upload files"
 aria-disabled={disabled}
        className={cn(
          "relative flex flex-col items-center justify-center px-6 py-10 gap-4 overflow-hidden border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] active:scale-[0.99] box-border",
          isDragOver 
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-primary dark:text-primary" 
            : disabled 
            ? "opacity-60 cursor-not-allowed bg-subtle border-default text-muted" 
            : "border-slate-300 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20 hover:border-primary dark:hover:border-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Animated background pulse for drag over */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 animate-pulse pointer-events-none" />
        )}

        {/* The elevated puck target */}
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full shadow-sm border transition-transform duration-200 z-10",
          isDragOver 
            ? "bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 scale-110" 
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        )}>
          {/* Optical centering: -translate-y-[1px] balances the heavy bottom line of the upload icon */}
          <svg className={cn("w-5 h-5 transition-colors duration-200 relative -translate-y-[1px]", isDragOver ? "text-primary dark:text-primary" : "text-slate-500 dark:text-slate-400")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        
        {/* Typography */}
        <div className="flex flex-col items-center text-center gap-1.5 z-10">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {placeholder || (
              <>
                <span className="text-primary dark:text-primary hover:underline">Click to upload</span>
                {' '}
                <span className="font-medium text-slate-500 dark:text-slate-400">or drag and drop</span>
              </>
            )}
          </div>
          {(description || accept || maxSize) && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description || (() => {
                const parts = [];
                if (accept) parts.push(accept.replace(/,\s*/g, ', '));
                if (maxSize) parts.push(`max. ${formatBytes(maxSize)}`);
                return parts.join(' ');
              })()}
            </p>
          )}
        </div>
      </div>

 {/* HIDDEN NATIVE INPUT */}
 <input
 ref={inputRef}
 type="file"
 data-testid="nui-file-input"
 accept={accept}
 multiple={multiple}
 disabled={disabled}
 onChange={onFileSelect}
 className="hidden"
 tabIndex={-1}
 aria-hidden="true"
 />

        {/* FILE LIST PREVIEW */}
        {files.length > 0 && (
          <ul className="list-none p-0 m-0 flex flex-col gap-2 box-border" aria-label="Selected files">
            {files.map((file) => {
              // Create a stable key based on file properties
              const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
              
              return (
                <li key={fileKey} className="group flex items-center justify-between p-3 bg-white dark:bg-[#0a0a0b] border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl transition-all hover:border-primary dark:hover:border-primary box-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-primary shrink-0 border border-blue-100 dark:border-blue-900/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate pr-4 leading-tight">{file.name}</span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{formatBytes(file.size)}</span>
                </div>
              </div>
              
              <button
                type="button"
                className="flex items-center justify-center p-1.5 ml-4 bg-transparent border-none rounded-full text-slate-400 cursor-pointer transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] md:opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(file)}
                disabled={disabled}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </li>
          );
 })}
 </ul>
 )}
 </div>
 );
}