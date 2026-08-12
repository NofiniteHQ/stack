import React from 'react';
import { File, Download, Loader2 } from 'lucide-react';
import { cn } from '../../utils';

export interface AttachmentProps {
  filename: string;
  filesize: number;
  filetype: string;
  src?: string;
  isLoading?: boolean;
  className?: string;
}

export const Attachment: React.FC<AttachmentProps> = ({
  filename,
  filesize,
  filetype,
  src,
  isLoading = false,
  className,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("flex w-full max-w-sm items-center gap-3 rounded-lg border border-default bg-surface p-3 shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-subtle text-primary">
        {isLoading ? <Loader2 size={20} className="animate-spin text-muted" /> : <File size={20} />}
      </div>
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <span className="truncate text-sm font-medium text-default">{filename || 'File'}</span>
        <span className="text-xs text-muted truncate">{formatSize(filesize)} • {filetype?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
      </div>
      {!isLoading && src && (
        <a href={src} download={filename} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-subtle text-muted hover:text-default transition-colors" onClick={e => e.stopPropagation()}>
          <Download size={16} />
        </a>
      )}
    </div>
  );
};
