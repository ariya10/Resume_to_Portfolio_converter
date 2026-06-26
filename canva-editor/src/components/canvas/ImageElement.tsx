import React, { useRef, useEffect, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import type { ImageElement as ImageElementType } from '@/types/canvas';

interface ImageElementProps {
  element: ImageElementType;
  id: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  draggable: boolean;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export function ImageElement({
  element,
  id,
  x,
  y,
  rotation,
  opacity,
  visible,
  draggable,
  onDragMove,
  onDragEnd,
  onTransformEnd,
}: ImageElementProps) {
  const imageRef = useRef<Konva.Image>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImage(img);
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', element.src);
    };
    
    img.src = element.src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [element.src]);

  // Apply filters
  useEffect(() => {
    if (!imageRef.current || !element.filters) return;

    const filters: any[] = [];

    if (element.filters.brightness !== 100) {
      filters.push(Konva.Filters.Brighten);
    }
    if (element.filters.contrast !== 100) {
      filters.push(Konva.Filters.Contrast);
    }
    if (element.filters.saturation !== 100) {
      filters.push(Konva.Filters.HSL);
    }
    if (element.filters.blur > 0) {
      filters.push(Konva.Filters.Blur);
    }
    if (element.filters.grayscale > 0) {
      filters.push(Konva.Filters.Grayscale);
    }

    imageRef.current.filters(filters);
    imageRef.current.cache();
    imageRef.current.getLayer()?.batchDraw();
  }, [element.filters]);

  if (!image) {
    return null;
  }

  return (
    <KonvaImage
      ref={imageRef}
      id={id}
      x={x}
      y={y}
      image={image}
      width={element.width}
      height={element.height}
      crop={{
        x: element.cropX,
        y: element.cropY,
        width: element.cropWidth,
        height: element.cropHeight,
      }}
      rotation={rotation}
      opacity={opacity}
      visible={visible}
      draggable={draggable}
      shadowColor={element.shadow?.enabled ? element.shadow.color : undefined}
      shadowBlur={element.shadow?.enabled ? element.shadow.blur : 0}
      shadowOffsetX={element.shadow?.enabled ? element.shadow.offsetX : 0}
      shadowOffsetY={element.shadow?.enabled ? element.shadow.offsetY : 0}
      // Filters
      brightness={element.filters ? (element.filters.brightness - 100) / 100 : 0}
      contrast={element.filters ? (element.filters.contrast - 100) / 100 : 0}
      blurRadius={element.filters?.blur || 0}
      saturation={element.filters ? (element.filters.saturation - 100) / 100 : 0}
      hue={element.filters?.hueRotate || 0}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
}

export default ImageElement;
