import type { CanvasElement, CanvasConfig } from '@/types/canvas';
import { exportToPNG } from './exportPNG';

interface ExportPDFOptions {
  elements: CanvasElement[];
  canvas: CanvasConfig;
  scale?: number;
}

/**
 * Exports the canvas to a PDF Blob.
 * Renders to a PNG first, then embeds in PDF via jsPDF.
 */
export async function exportToPDF({
  elements,
  canvas,
  scale = 2,
}: ExportPDFOptions): Promise<Blob> {
  // Render to PNG first
  const pngBlob = await exportToPNG({ elements, canvas, scale, format: 'png' });

  // Convert blob to base64 data URL
  const dataUrl = await blobToDataURL(pngBlob);

  // Dynamically import jsPDF to keep bundle lean
  const { jsPDF } = await import('jspdf');

  const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [canvas.width, canvas.height],
    compress: true,
  });

  pdf.addImage(
    dataUrl,
    'PNG',
    0,
    0,
    canvas.width,
    canvas.height,
    undefined,
    'FAST'
  );

  return pdf.output('blob');
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}
