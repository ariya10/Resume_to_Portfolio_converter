import type { CanvasElement, CanvasConfig } from '@/types/canvas';

interface ExportPNGOptions {
  elements: CanvasElement[];
  canvas: CanvasConfig;
  scale?: number;
  quality?: number;
  format?: 'png' | 'jpeg';
  transparentBackground?: boolean;
}

/**
 * Exports the canvas design to a PNG/JPG Blob.
 * Renders elements onto an offscreen HTMLCanvasElement.
 */
export async function exportToPNG({
  elements,
  canvas,
  scale = 2,
  quality = 1,
  format = 'png',
  transparentBackground = false,
}: ExportPNGOptions): Promise<Blob> {
  const outputW = canvas.width * scale;
  const outputH = canvas.height * scale;

  const offscreen = document.createElement('canvas');
  offscreen.width = outputW;
  offscreen.height = outputH;
  const ctx = offscreen.getContext('2d')!;

  ctx.scale(scale, scale);

  // Background
  if (!transparentBackground) {
    ctx.fillStyle = canvas.background === 'transparent' ? '#ffffff' : canvas.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Render each element in z-order
  for (const el of elements) {
    if (!el.visible) continue;

    ctx.save();
    ctx.globalAlpha = el.opacity;

    // Apply transform
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    // Shadow
    if (el.shadow?.enabled) {
      ctx.shadowColor = el.shadow.color;
      ctx.shadowBlur = el.shadow.blur;
      ctx.shadowOffsetX = el.shadow.offsetX;
      ctx.shadowOffsetY = el.shadow.offsetY;
    }

    if (el.type === 'text') {
      renderText(ctx, el as any, canvas);
    } else if (el.type === 'image') {
      await renderImage(ctx, el as any);
    } else if (el.type === 'shape') {
      renderShape(ctx, el as any);
    }

    ctx.restore();
  }

  return new Promise<Blob>((resolve, reject) => {
    offscreen.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      },
      format === 'jpeg' ? 'image/jpeg' : 'image/png',
      quality
    );
  });
}

/* ── Element renderers ──────────────────────────────────── */

function renderText(ctx: CanvasRenderingContext2D, el: any, _canvas: CanvasConfig) {
  const style = [el.fontStyle !== 'normal' ? el.fontStyle : '', `${el.fontWeight}`, `${el.fontSize}px`, el.fontFamily]
    .filter(Boolean)
    .join(' ');

  ctx.font = style;
  ctx.fillStyle = el.fill;
  ctx.textBaseline = 'top';
  ctx.letterSpacing = `${el.letterSpacing}px`;

  if (el.stroke) {
    ctx.strokeStyle = el.stroke;
    ctx.lineWidth = el.strokeWidth || 0;
  }

  const lineH = el.fontSize * el.lineHeight;
  const lines = el.content.split('\n');

  lines.forEach((line: string, i: number) => {
    const yPos = el.y + i * lineH;
    let xPos = el.x;

    if (el.textAlign === 'center') xPos = el.x + el.width / 2;
    if (el.textAlign === 'right')  xPos = el.x + el.width;

    ctx.textAlign = el.textAlign === 'justify' ? 'left' : el.textAlign;

    if (el.stroke) ctx.strokeText(line, xPos, yPos);
    ctx.fillText(line, xPos, yPos);

    if (el.textDecoration === 'underline') {
      const metrics = ctx.measureText(line);
      ctx.fillRect(xPos, yPos + el.fontSize + 2, metrics.width, 1);
    }
    if (el.textDecoration === 'line-through') {
      const metrics = ctx.measureText(line);
      ctx.fillRect(xPos, yPos + el.fontSize / 2, metrics.width, 1);
    }
  });
}

async function renderImage(ctx: CanvasRenderingContext2D, el: any): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (el.filters) {
        ctx.filter = [
          `brightness(${el.filters.brightness}%)`,
          `contrast(${el.filters.contrast}%)`,
          `saturate(${el.filters.saturation}%)`,
          el.filters.blur     > 0 ? `blur(${el.filters.blur}px)` : '',
          el.filters.grayscale > 0 ? `grayscale(${el.filters.grayscale}%)` : '',
          el.filters.sepia    > 0 ? `sepia(${el.filters.sepia}%)` : '',
          el.filters.hueRotate > 0 ? `hue-rotate(${el.filters.hueRotate}deg)` : '',
        ]
          .filter(Boolean)
          .join(' ');
      }

      ctx.drawImage(
        img,
        el.cropX, el.cropY, el.cropWidth, el.cropHeight,
        el.x, el.y, el.width, el.height
      );
      ctx.filter = 'none';
      resolve();
    };
    img.onerror = () => resolve(); // Silently skip broken images
    img.src = el.src;
  });
}

function renderShape(ctx: CanvasRenderingContext2D, el: any) {
  ctx.fillStyle = el.fill;
  if (el.stroke) {
    ctx.strokeStyle = el.stroke;
    ctx.lineWidth = el.strokeWidth || 0;
  }

  switch (el.shapeType) {
    case 'rectangle':
      if (el.cornerRadius) {
        roundRect(ctx, el.x, el.y, el.width, el.height, el.cornerRadius);
      } else {
        ctx.fillRect(el.x, el.y, el.width, el.height);
        if (el.stroke && el.strokeWidth) ctx.strokeRect(el.x, el.y, el.width, el.height);
      }
      break;

    case 'circle':
    case 'ellipse': {
      ctx.beginPath();
      ctx.ellipse(
        el.x + el.width / 2,
        el.y + el.height / 2,
        el.width / 2,
        el.height / 2,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      if (el.stroke && el.strokeWidth) ctx.stroke();
      break;
    }

    case 'line':
    case 'arrow': {
      ctx.beginPath();
      const pts = el.points || [0, 0, el.width, el.height];
      ctx.moveTo(el.x + pts[0], el.y + pts[1]);
      ctx.lineTo(el.x + pts[2], el.y + pts[3]);
      ctx.stroke();
      break;
    }

    case 'polygon':
    case 'star': {
      const sides = el.sides || 6;
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      const outerR = Math.min(el.width, el.height) / 2;
      const innerR = el.shapeType === 'star' ? outerR / 2.5 : outerR;
      const total = el.shapeType === 'star' ? sides * 2 : sides;

      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = (i * Math.PI * 2) / total - Math.PI / 2;
        const r = el.shapeType === 'star' && i % 2 === 1 ? innerR : outerR;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      if (el.stroke && el.strokeWidth) ctx.stroke();
      break;
    }
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}
