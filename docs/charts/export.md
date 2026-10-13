# Exporting Charts

Export charts as high-resolution PNG raster images or standalone scalable vector graphics (SVG) for reporting and presentations.

---

## Programmatic Export

You can export any Nofinite Chart SVG directly in the browser using the DOM or canvas API:

```tsx
import React, { useRef } from 'react';
import { AreaChart } from '@nofinite/charts/react';

export function ExportableReport({ data }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    const svgElement = chartContainerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgElement.clientWidth * 2; // 2x resolution for retina displays
      canvas.height = svgElement.clientHeight * 2;
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.drawImage(image, 0, 0);
        const png = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'chart-export.png';
        downloadLink.href = png;
        downloadLink.click();
      }
    };
    image.src = blobURL;
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button className="btn btn-sm btn-secondary" onClick={handleExportPNG}>
          Export PNG
        </button>
      </div>
      <div ref={chartContainerRef} className="w-full h-64">
        <AreaChart
          data={data}
          xAccessor={(d) => d.time}
          yAccessor={(d) => d.value}
        />
      </div>
    </div>
  );
}
```
