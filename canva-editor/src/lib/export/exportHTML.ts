import type { CanvasElement, CanvasConfig } from '@/types/canvas';

interface ExportHTMLOptions {
  elements: CanvasElement[];
  canvas: CanvasConfig;
  projectName?: string;
}

/**
 * Exports the canvas design to a self-contained HTML/CSS Blob.
 * All images are embedded as base64. Suitable for static hosting.
 */
export async function exportToHTML({
  elements,
  canvas,
  projectName = 'design',
}: ExportHTMLOptions): Promise<Blob> {
  const elementStyles = elements
    .filter((el) => el.visible)
    .map((el) => buildElementHTML(el))
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHTML(projectName)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f1f5f9;
      font-family: system-ui, sans-serif;
    }

    .canvas {
      position: relative;
      width: ${canvas.width}px;
      height: ${canvas.height}px;
      background: ${canvas.background};
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }

    @media (max-width: ${canvas.width + 40}px) {
      body { padding: 20px; }
      .canvas {
        width: 100%;
        height: auto;
        aspect-ratio: ${canvas.width} / ${canvas.height};
        transform-origin: top left;
      }
    }

    .el {
      position: absolute;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="canvas">
${elementStyles}
  </div>
</body>
</html>`;

  return new Blob([html], { type: 'text/html; charset=utf-8' });
}

/* ── Element HTML builders ──────────────────────────────── */

function buildElementHTML(el: CanvasElement): string {
  const baseStyle = [
    `left:${el.x}px`,
    `top:${el.y}px`,
    `width:${el.width}px`,
    `height:${el.height}px`,
    `transform:rotate(${el.rotation}deg)`,
    `opacity:${el.opacity}`,
  ].join(';');

  const shadowStyle = el.shadow?.enabled
    ? `box-shadow:${el.shadow.offsetX}px ${el.shadow.offsetY}px ${el.shadow.blur}px ${el.shadow.color}`
    : '';

  if (el.type === 'text') {
    const t = el as any;
    const style = [
      baseStyle,
      `font-family:${t.fontFamily},sans-serif`,
      `font-size:${t.fontSize}px`,
      `font-weight:${t.fontWeight}`,
      `font-style:${t.fontStyle}`,
      `text-decoration:${t.textDecoration}`,
      `text-align:${t.textAlign}`,
      `line-height:${t.lineHeight}`,
      `letter-spacing:${t.letterSpacing}px`,
      `color:${t.fill}`,
      `white-space:pre-wrap`,
      `word-break:break-word`,
      `overflow:hidden`,
      shadowStyle,
    ]
      .filter(Boolean)
      .join(';');

    return `    <div class="el" style="${style}">${escapeHTML(t.content)}</div>`;
  }

  if (el.type === 'image') {
    const img = el as any;
    const filterParts = img.filters
      ? [
          img.filters.brightness !== 100 ? `brightness(${img.filters.brightness}%)` : '',
          img.filters.contrast   !== 100 ? `contrast(${img.filters.contrast}%)`     : '',
          img.filters.saturation !== 100 ? `saturate(${img.filters.saturation}%)`   : '',
          img.filters.blur       > 0     ? `blur(${img.filters.blur}px)`            : '',
          img.filters.grayscale  > 0     ? `grayscale(${img.filters.grayscale}%)`   : '',
          img.filters.sepia      > 0     ? `sepia(${img.filters.sepia}%)`           : '',
          img.filters.hueRotate  > 0     ? `hue-rotate(${img.filters.hueRotate}deg)` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : '';

    const style = [
      baseStyle,
      `object-fit:fill`,
      filterParts ? `filter:${filterParts}` : '',
      shadowStyle,
    ]
      .filter(Boolean)
      .join(';');

    return `    <img class="el" src="${img.src}" alt="${escapeHTML(img.name)}" style="${style}" />`;
  }

  if (el.type === 'shape') {
    const s = el as any;
    let extraStyle = '';

    if (s.shapeType === 'rectangle') {
      extraStyle = [
        `background:${s.fill}`,
        s.stroke ? `border:${s.strokeWidth || 1}px solid ${s.stroke}` : '',
        s.cornerRadius ? `border-radius:${s.cornerRadius}px` : '',
      ]
        .filter(Boolean)
        .join(';');
    } else if (s.shapeType === 'circle' || s.shapeType === 'ellipse') {
      extraStyle = [
        `background:${s.fill}`,
        s.stroke ? `border:${s.strokeWidth || 1}px solid ${s.stroke}` : '',
        `border-radius:50%`,
      ]
        .filter(Boolean)
        .join(';');
    } else {
      // For lines, polygons, stars – fallback to SVG rendering
      return buildSVGShape(s, baseStyle, shadowStyle);
    }

    const style = [baseStyle, extraStyle, shadowStyle].filter(Boolean).join(';');
    return `    <div class="el" style="${style}"></div>`;
  }

  return '';
}

function buildSVGShape(el: any, baseStyle: string, shadowStyle: string): string {
  const w = el.width;
  const h = el.height;
  let svgContent = '';

  if (el.shapeType === 'line' || el.shapeType === 'arrow') {
    const pts = el.points || [0, 0, w, h];
    svgContent = `<line x1="${pts[0]}" y1="${pts[1]}" x2="${pts[2]}" y2="${pts[3]}" stroke="${el.stroke || el.fill}" stroke-width="${el.strokeWidth || 2}" stroke-linecap="round" />`;
  } else if (el.shapeType === 'polygon' || el.shapeType === 'star') {
    const sides = el.sides || 6;
    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(w, h) / 2;
    const innerR = el.shapeType === 'star' ? outerR / 2.5 : outerR;
    const total = el.shapeType === 'star' ? sides * 2 : sides;
    const points: string[] = [];

    for (let i = 0; i < total; i++) {
      const angle = (i * Math.PI * 2) / total - Math.PI / 2;
      const r = el.shapeType === 'star' && i % 2 === 1 ? innerR : outerR;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }

    svgContent = `<polygon points="${points.join(' ')}" fill="${el.fill}" stroke="${el.stroke || 'none'}" stroke-width="${el.strokeWidth || 0}" />`;
  }

  const style = [baseStyle, shadowStyle].filter(Boolean).join(';');
  return `    <svg class="el" viewBox="0 0 ${w} ${h}" style="${style}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
