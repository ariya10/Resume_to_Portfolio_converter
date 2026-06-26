import React, { useRef, useEffect, useState } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { useEditorStore } from '@/stores/editorStore';
import type { TextElement as TextElementType } from '@/types/canvas';

interface TextElementProps {
  element: TextElementType;
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

export function TextElement({
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
}: TextElementProps) {
  const textRef = useRef<Konva.Text>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { updateElement } = useEditorStore();

  // Handle double-click to edit
  const handleDblClick = () => {
    if (element.locked) return;
    setIsEditing(true);
  };

  // Create HTML input for editing
  useEffect(() => {
    if (!isEditing || !textRef.current) return;

    const textNode = textRef.current;
    const stage = textNode.getStage();
    if (!stage) return;

    const stageBox = stage.container().getBoundingClientRect();
    const textPosition = textNode.absolutePosition();
    const rotation = textNode.rotation();

    // Create textarea
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    const transform = textNode.getAbsoluteTransform().copy();
    const rotation_rad = (rotation * Math.PI) / 180;

    textarea.value = element.content;
    textarea.style.position = 'absolute';
    textarea.style.top = `${stageBox.top + textPosition.y}px`;
    textarea.style.left = `${stageBox.left + textPosition.x}px`;
    textarea.style.width = `${textNode.width()}px`;
    textarea.style.height = `${textNode.height() + 5}px`;
    textarea.style.fontSize = `${element.fontSize}px`;
    textarea.style.fontFamily = element.fontFamily;
    textarea.style.fontWeight = element.fontWeight;
    textarea.style.fontStyle = element.fontStyle;
    textarea.style.textAlign = element.textAlign;
    textarea.style.color = element.fill;
    textarea.style.lineHeight = `${element.lineHeight}`;
    textarea.style.letterSpacing = `${element.letterSpacing}px`;
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.border = '2px solid #0ea5e9';
    textarea.style.borderRadius = '4px';
    textarea.style.transformOrigin = 'left top';
    textarea.style.transform = `rotateZ(${rotation}deg)`;

    textarea.focus();
    textarea.select();

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target !== textarea) {
        updateElement(element.id, { content: textarea.value });
        setIsEditing(false);
        document.body.removeChild(textarea);
      }
    };

    // Handle key events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        updateElement(element.id, { content: textarea.value });
        setIsEditing(false);
        document.body.removeChild(textarea);
      }
      e.stopPropagation();
    };

    setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
      textarea.addEventListener('keydown', handleKeyDown);
    });

    return () => {
      window.removeEventListener('click', handleClickOutside);
      document.body.contains(textarea) && document.body.removeChild(textarea);
    };
  }, [isEditing, element, updateElement]);

  return (
    <Text
      ref={textRef}
      id={id}
      x={x}
      y={y}
      text={element.content}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fontStyle={`${element.fontStyle} ${element.fontWeight}`}
      textDecoration={element.textDecoration}
      align={element.textAlign}
      lineHeight={element.lineHeight}
      letterSpacing={element.letterSpacing}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth || 0}
      width={element.width}
      height={element.height}
      rotation={rotation}
      opacity={opacity}
      visible={visible && !isEditing}
      draggable={draggable}
      shadowColor={element.shadow?.enabled ? element.shadow.color : undefined}
      shadowBlur={element.shadow?.enabled ? element.shadow.blur : 0}
      shadowOffsetX={element.shadow?.enabled ? element.shadow.offsetX : 0}
      shadowOffsetY={element.shadow?.enabled ? element.shadow.offsetY : 0}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
    />
  );
}

export default TextElement;
