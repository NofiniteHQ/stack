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
 /** Custom text or element displayed inside the dropzone */
 placeholder?: React.ReactNode;
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
 placeholder = 'Drag & drop files here, or click to browse',
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
 <div className={cn("flex flex-col gap-4 font-sans w-full", className)}>
 
 {/* DROP ZONE */}
 <div
 role="button"
 tabIndex={disabled ? -1 : 0}
 aria-label="Upload files"
 aria-disabled={disabled}
 className={cn(
 "flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
 isDragOver 
 ? "border-default bg-subtle text-default" 
 : disabled 
 ? "opacity-60 cursor-not-allowed bg-subtle border-default text-muted" 
 : "border-default bg-surface text-muted hover:bg-subtle hover:text-default"
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
 <svg className="opacity-70" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
 <polyline points="17 8 12 3 7 8"></polyline>
 <line x1="12" y1="3" x2="12" y2="15"></line>
 </svg>
 <span className="text-sm font-medium text-center">{placeholder}</span>
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
 <ul className="list-none p-0 m-0 flex flex-col gap-2" aria-label="Selected files">
 {files.map((file) => {
 // Create a stable key based on file properties
 const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
 
 return (
 <li key={fileKey} className="flex items-center justify-between p-4 bg-surface border border-default rounded-md">
 <div className="flex items-center gap-2 min-w-0">
 <svg className="text-muted shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
 <polyline points="13 2 13 9 20 9"></polyline>
 </svg>
 <div className="flex flex-col min-w-0">
 <span className="text-sm font-medium text-default truncate">{file.name}</span>
 <span className="text-xs text-muted">{formatBytes(file.size)}</span>
 </div>
 </div>
 
 <button
 type="button"
 className="flex items-center justify-center p-1 ml-4 bg-transparent border-none rounded-sm text-muted cursor-pointer transition-all duration-200 hover:bg-subtle hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50 disabled:cursor-not-allowed"
 aria-label={`Remove ${file.name}`}
 onClick={() => removeFile(file)}
 disabled={disabled}
 >
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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