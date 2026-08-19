"use client";

import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface WatermarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The text to display. Can be an array for multi-line watermarks. */
  text: string | string[];
  opacity?: number;
  rotate?: number;
  /** The spacing between watermark instances */
  gap?: number;
  fontSize?: number;
  color?: string;
  zIndex?: number;
}

export const Watermark = forwardRef<HTMLDivElement, WatermarkProps>(
  (
    {
      children,
      className,
      text,
      opacity = 0.05,
      rotate = -20,
      gap = 120,
      fontSize = 16,
      color = 'currentColor',
      zIndex = 10,
      ...props
    },
    ref
  ) => {
    const textArray = Array.isArray(text) ? text : [text];
    const lineHeight = fontSize * 1.2;
    
    // We create a "staggered" (diamond) pattern for a more professional look.
    // To prevent SVG boundary clipping, we draw two instances completely inside the tile
    // rather than on the edges.
    const tileW = gap * 2;
    const tileH = gap * 2;

    const renderTextContent = () => {
      return textArray.map((line, i) => {
        // Offset Y so the block of text is vertically centered
        const startY = -((textArray.length - 1) * lineHeight) / 2;
        return `<tspan x="0" y="${startY + i * lineHeight}" dominant-baseline="central">${line}</tspan>`;
      }).join('');
    };

    // Creating the SVG. We place the text twice to create the staggered grid pattern.
    const svg = `
      <svg width="${tileW}" height="${tileH}" xmlns="http://www.w3.org/2000/svg">
        <g 
          fill="${color}" 
          opacity="${opacity}" 
          font-family="sans-serif" 
          font-size="${fontSize}px" 
          font-weight="600" 
          text-anchor="middle"
        >
          <!-- First Instance (Top-Left quadrant) -->
          <g transform="translate(${gap / 2}, ${gap / 2}) rotate(${rotate})">
            <text x="0" y="0">${renderTextContent()}</text>
          </g>
          
          <!-- Second Instance (Bottom-Right quadrant) -->
          <g transform="translate(${gap + gap / 2}, ${gap + gap / 2}) rotate(${rotate})">
            <text x="0" y="0">${renderTextContent()}</text>
          </g>
        </g>
      </svg>
    `;
    // encodeURIComponent safely handles all special characters (including # and %) for SSR/Edge.
    const backgroundUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        {children}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden"
          style={{
            zIndex,
            backgroundImage: backgroundUrl,
            backgroundRepeat: 'repeat',
          }}
          aria-hidden="true"
        />
      </div>
    );
  }
);

Watermark.displayName = 'Watermark';
