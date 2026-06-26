import React from 'react';
import { Rect, Circle, Line, RegularPolygon, Star, Ellipse } from 'react-konva';
import Konva from 'konva';
import type { ShapeElement as ShapeElementType } from '@/types/canvas';

interface ShapeElementProps {
  element: ShapeElementType;
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

export function ShapeElement({
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
}: ShapeElementProps) {
  const commonProps = {
    id,
    x,
    y,
    rotation,
    opacity,
    visible,
    draggable,
    fill: element.fill,
    stroke: element.stroke,
    strokeWidth: element.strokeWidth || 0,
    shadowColor: element.shadow?.enabled ? element.shadow.color : undefined,
    shadowBlur: element.shadow?.enabled ? element.shadow.blur : 0,
    shadowOffsetX: element.shadow?.enabled ? element.shadow.offsetX : 0,
    shadowOffsetY: element.shadow?.enabled ? element.shadow.offsetY : 0,
    onDragMove,
    onDragEnd,
    onTransformEnd,
  };

  switch (element.shapeType) {
    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          width={element.width}
          height={element.height}
          cornerRadius={element.cornerRadius || 0}
        />
      );

    case 'circle':
      return (
        <Circle
          {...commonProps}
          radius={Math.min(element.width, element.height) / 2}
        />
      );

    case 'ellipse':
      return (
        <Ellipse
          {...commonProps}
          radiusX={element.width / 2}
          radiusY={element.height / 2}
        />
      );

    case 'polygon':
      return (
        <RegularPolygon
          {...commonProps}
          sides={element.sides || 6}
          radius={Math.min(element.width, element.height) / 2}
        />
      );

    case 'star':
      return (
        <Star
          {...commonProps}
          numPoints={element.sides || 5}
          innerRadius={Math.min(element.width, element.height) / 4}
          outerRadius={Math.min(element.width, element.height) / 2}
        />
      );

    case 'line':
    case 'arrow':
      return (
        <Line
          {...commonProps}
          points={element.points || [0, 0, element.width, element.height]}
          lineCap="round"
          lineJoin="round"
          pointerLength={element.shapeType === 'arrow' ? 10 : 0}
          pointerWidth={element.shapeType === 'arrow' ? 10 : 0}
        />
      );

    default:
      return null;
  }
}

export default ShapeElement;
