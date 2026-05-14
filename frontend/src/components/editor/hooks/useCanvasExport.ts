import { useCallback } from 'react';
import { useCanvasEditorStore } from '@/store/canvas-editor-store';
import type { ExportOptions } from '@/lib/canvas/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Hook for exporting canvas content to various formats
 */
export function useCanvasExport() {
  const { elements, selectedIds } = useCanvasEditorStore();

  // Export as JSON
  const exportJSON = useCallback(
    (filename: string = 'canvas.json') => {
      const data = {
        elements,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [elements]
  );

  // Export selected to JSON
  const exportSelectionJSON = useCallback(
    (filename: string = 'selection.json') => {
      const selected = elements.filter((el) => selectedIds.includes(el.id));
      const data = {
        elements: selected,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [elements, selectedIds]
  );

  // Export as PNG
  const exportPNG = useCallback(
    async (
      canvasElement: HTMLCanvasElement,
      filename: string = 'canvas.png',
      options: Partial<ExportOptions> = {}
    ) => {
      try {
        const scale = options.scale || 2;
        const canvas = await html2canvas(canvasElement, {
          scale,
          backgroundColor: options.transparent ? 'rgba(0,0,0,0)' : '#FFFFFF',
          logging: false,
          allowTaint: true,
          useCORS: true,
        });

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('PNG export failed:', error);
      }
    },
    []
  );

  // Export as PDF
  const exportPDF = useCallback(
    async (
      canvasElement: HTMLCanvasElement,
      filename: string = 'canvas.pdf',
      options: Partial<ExportOptions> = {}
    ) => {
      try {
        const scale = options.scale || 2;
        const canvas = await html2canvas(canvasElement, {
          scale,
          backgroundColor: '#FFFFFF',
          logging: false,
          allowTaint: true,
          useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = canvas.width > canvas.height ? 297 : 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(filename);
      } catch (error) {
        console.error('PDF export failed:', error);
      }
    },
    []
  );

  // Export as HTML + CSS
  const exportHTML = useCallback(
    (filename: string = 'canvas.html') => {
      const htmlContent = generateHTMLContent(elements);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [elements]
  );

  return {
    exportJSON,
    exportSelectionJSON,
    exportPNG,
    exportPDF,
    exportHTML,
  };
}

/**
 * Generate HTML content from canvas elements
 */
function generateHTMLContent(elements: any[]): string {
  const styles = generateStyles(elements);
  const html = generateElementsHTML(elements);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas Export</title>
  <style>
    ${styles}
  </style>
</head>
<body>
  <div class="canvas-container">
    ${html}
  </div>
</body>
</html>`;
}

/**
 * Generate CSS styles from elements
 */
function generateStyles(elements: any[]): string {
  let css = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .canvas-container {
      width: 1200px;
      height: 800px;
      position: relative;
      background: white;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .element {
      position: absolute;
      overflow: hidden;
    }
  `;

  elements.forEach((el, i) => {
    const { x, y, width, height, rotation } = el.transform;
    css += `
      .element-${i} {
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
        height: ${height}px;
        transform: rotate(${rotation}deg);
        opacity: ${el.opacity};
        ${generateElementStyles(el)}
      }
    `;
  });

  return css;
}

/**
 * Generate element-specific styles
 */
function generateElementStyles(el: any): string {
  let style = '';

  if (el.fill?.color) {
    style += `background-color: ${el.fill.color};`;
  }

  if (el.stroke?.color) {
    style += `border: ${el.stroke.width}px solid ${el.stroke.color};`;
  }

  if (el.shadow) {
    const { blur, offsetX, offsetY, color } = el.shadow;
    style += `box-shadow: ${offsetX}px ${offsetY}px ${blur}px ${color};`;
  }

  if (el.borderRadius) {
    style += `border-radius: ${el.borderRadius}px;`;
  }

  return style;
}

/**
 * Generate HTML elements
 */
function generateElementsHTML(elements: any[]): string {
  return elements
    .map((el, i) => {
      switch (el.type) {
        case 'text':
          return `<div class="element element-${i}" style="display: flex; align-items: center; justify-content: center;">
            <span style="font-size: ${el.textStyle?.fontSize || 16}px; font-family: ${el.textStyle?.fontFamily || 'inherit'}; color: ${el.textColor || '#000'};${el.textStyle?.fontStyle === 'italic' ? 'font-style: italic;' : ''}">
              ${el.content || ''}
            </span>
          </div>`;
        case 'rectangle':
        case 'circle':
          return `<div class="element element-${i}"></div>`;
        case 'image':
          return `<div class="element element-${i}"><img src="${el.src}" style="width: 100%; height: 100%; object-fit: cover;"></div>`;
        default:
          return '';
      }
    })
    .join('\n');
}

export default useCanvasExport;
