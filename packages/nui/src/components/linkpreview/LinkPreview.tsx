import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Loader2, ExternalLink } from 'lucide-react';
import { Card } from '../card/Card';
import { cn } from '../../utils';

export interface LinkPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  loading?: boolean;
  error?: boolean;
  /**
   * Custom fetcher for OpenGraph metadata. 
   * Useful for bypassing third-party limits by routing through your own backend proxy.
   * If omitted, defaults to the public Microlink API for quick prototyping.
   */
  fetcher?: (url: string) => Promise<{ title?: string; description?: string; image?: string }>;
}

/**
 * LinkPreview Component
 * A component to display rich link unfurling. 
 * If only a `url` is provided without a `title`, it will automatically attempt to fetch OpenGraph metadata.
 */
export const LinkPreview = React.forwardRef<HTMLDivElement, LinkPreviewProps>(({
  url,
  title: propTitle,
  description: propDesc,
  image: propImage,
  loading: propLoading = false,
  error: propError = false,
  fetcher,
  className,
  ...props
}, ref) => {
  const [internalData, setInternalData] = useState<{ title?: string; description?: string; image?: string } | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState(false);

  useEffect(() => {
    // If a title is provided via props, we assume the data is controlled externally.
    if (propTitle || !url) {
      setInternalData(null);
      setInternalLoading(false);
      setInternalError(false);
      return;
    }

    let isMounted = true;
    const fetchPreview = async () => {
      setInternalLoading(true);
      setInternalError(false);
      try {
        if (fetcher) {
          const data = await fetcher(url);
          if (isMounted) {
            setInternalData({
              title: data.title || '',
              description: data.description || '',
              image: data.image || ''
            });
          }
        } else {
          // Fallback to Microlink if no custom fetcher is provided
          const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
          if (!response.ok) throw new Error('Failed to fetch link preview');
          const json = await response.json();
          
          if (isMounted && json.status === 'success') {
            setInternalData({
              title: json.data?.title || '',
              description: json.data?.description || '',
              image: json.data?.image?.url || json.data?.logo?.url || ''
            });
          }
        }
      } catch (err) {
        if (isMounted) setInternalError(true);
      } finally {
        if (isMounted) setInternalLoading(false);
      }
    };

    fetchPreview();

    return () => {
      isMounted = false;
    };
  }, [url, propTitle]);

  const loading = propLoading || internalLoading;
  const error = propError || internalError;
  const title = propTitle || internalData?.title;
  const description = propDesc || internalData?.description;
  const image = propImage || internalData?.image;

  return (
    <div ref={ref} className={cn("w-full max-w-2xl select-none relative group", className)} {...props}>
      <Card hover clickable onClick={() => window.open(url, '_blank')} className="p-0 overflow-hidden h-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center w-full h-32 bg-subtle">
            <Loader2 className="animate-spin text-muted mb-2" size={24} />
            <span className="text-sm text-muted">Unfurling link...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 w-full bg-subtle text-muted">
            <LinkIcon size={20} />
            <span className="text-sm truncate flex-1">{url}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row h-full">
            <div className="flex flex-1 flex-col justify-between p-4 order-2 sm:order-1 min-w-0">
              <div>
                <h3 className="text-base font-semibold text-default truncate mb-1 group-hover:text-primary transition-colors">{title || url}</h3>
                <p className="text-sm text-muted line-clamp-2">{description}</p>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted truncate">
                <LinkIcon size={14} />
                <span className="truncate">{url}</span>
              </div>
            </div>
            {image && (
              <div className="w-full sm:w-1/3 h-40 sm:h-auto order-1 sm:order-2 border-b sm:border-b-0 sm:border-l border-default bg-subtle">
                <img src={image} alt={title || 'Preview'} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}
        {!loading && !error && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/80 dark:bg-black/50 backdrop-blur-md p-2 rounded-full shadow-md border border-black/5 dark:border-white/10 text-default hover:scale-105">
            <ExternalLink size={16} />
          </div>
        )}
      </Card>
    </div>
  );
});

LinkPreview.displayName = 'LinkPreview';
