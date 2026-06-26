import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Line, Group, Transformer } from 'react-konva';
import Konva from 'konva';
import { TextElement } from './TextElement';
import { ImageElement } from './ImageElement';
import { ShapeElement } from './ShapeElement';
import { useEditorStore } from '@/stores/editorStore';
import { calculateSnapGuides } from '@/lib/canvas/snapping';
import type { CanvasElement } from '@/types/canvas';

interface CanvasProps {
  width: number;
  height: number;
  elements: CanvasElement[];
  selectedIds: string[];
  zoom: number;
  panX: number;
  panY: number;
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;
  snapToObjects: boolean;
  snapThreshold: number;
  background: string;
}

export function Canvas({
  width,
  height,
  elements,
  selectedIds,
  zoom,
  panX,
  panY,
  gridEnabled,
  gridSize,
  snapToGrid,
  snapToObjects,
  snapThreshold,
  background,
}: CanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [snapGuides, setSnapGuides] = useState<{ x: number[]; y: number[] }>({
    x: [],
    y: [],
  });

  const {
    selectElement,
    deselectAll,
    updateElement,
    activeTool,
    setZoom,
    setPan,
  } = useEditorStore();

  // Calculate container size
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 64 : 1080;

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current) return;

    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!stage) return;

    const selectedNodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter((n): n is Konva.Node => n != null);

    transformer.nodes(selectedNodes);
    transformer.getLayer()?.batchDraw();
  }, [selectedIds]);

  // Handle element selection
  const handleSelect = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (activeTool !== 'select') return;

      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        deselectAll();
        return;
      }

      const clickedElement = e.target;
      const id = clickedElement.id();

      if (!id) return;

      const isMultiSelect = e.evt.shiftKey || e.evt.metaKey || e.evt.ctrlKey;
      selectElement(id, isMultiSelect);
    },
    [activeTool, selectElement, deselectAll]
  );

  // Handle element drag
  const handleDragMove = useCallback(
    (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      let newX = node.x();
      let newY = node.y();

      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      if (snapToObjects) {
        const guides = calculateSnapGuides(
          { x: newX, y: newY, width: node.width(), height: node.height() },
          elements.filter((el) => el.id !== id),
          snapThreshold
        );

        if (guides.x.length > 0) {
          newX = guides.x[0];
        }
        if (guides.y.length > 0) {
          newY = guides.y[0];
        }

        setSnapGuides(guides);
      }

      node.position({ x: newX, y: newY });
    },
    [snapToGrid, snapToObjects, gridSize, snapThreshold, elements]
  );

  const handleDragEnd = useCallback(
    (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      updateElement(id, {
        x: node.x(),
        y: node.y(),
      });
      setSnapGuides({ x: [], y: [] });
    },
    [updateElement]
  );

  // Handle transform
  const handleTransformEnd = useCallback(
    (id: string, e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // Reset scale and update dimensions
      node.scaleX(1);
      node.scaleY(1);

      updateElement(id, {
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      });
    },
    [updateElement]
  );

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = zoom;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - panX) / oldScale,
        y: (pointer.y - panY) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const scaleBy = 1.05;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      const clampedScale = Math.max(0.1, Math.min(5, newScale));

      const newPanX = pointer.x - mousePointTo.x * clampedScale;
      const newPanY = pointer.y - mousePointTo.y * clampedScale;

      setZoom(clampedScale);
      setPan(newPanX, newPanY);
    },
    [zoom, panX, panY, setZoom, setPan]
  );

  // Render element based on type
  const renderElement = (element: CanvasElement) => {
    const commonProps = {
      id: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation,
      opacity: element.opacity,
      visible: element.visible,
      draggable: !element.locked && activeTool === 'select',
      onDragMove: (e: Konva.KonvaEventObject<DragEvent>) =>
        handleDragMove(element.id, e),
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) =>
        handleDragEnd(element.id, e),
      onTransformEnd: (e: Konva.KonvaEventObject<Event>) =>
        handleTransformEnd(element.id, e),
    };

    switch (element.type) {
      case 'text':
        return <TextElement key={element.id} element={element} {...commonProps} />;
      case 'image':
        return <ImageElement key={element.id} element={element} {...commonProps} />;
      case 'shape':
        return <ShapeElement key={element.id} element={element} {...commonProps} />;
      case 'group':
        return (
          <Group key={element.id} {...commonProps}>
            {/* Group children would be rendered here */}
          </Group>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: width * zoom,
        height: height * zoom,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        borderRadius: 8,
      }}
    >
      <Stage
        ref={stageRef}
        width={width * zoom}
        height={height * zoom}
        scaleX={zoom}
        scaleY={zoom}
        onClick={handleSelect}
        onTap={handleSelect}
        onWheel={handleWheel}
      >
        <Layer ref={layerRef}>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={background}
            listening={false}
          />

          {/* Render all elements */}
          {elements.map(renderElement)}

          {/* Snap guides */}
          {snapGuides.x.map((x, i) => (
            <Line
              key={`snap-x-${i}`}
              points={[x, 0, x, height]}
              stroke="#0ea5e9"
              strokeWidth={1 / zoom}
              dash={[4 / zoom, 4 / zoom]}
              listening={false}
            />
          ))}
          {snapGuides.y.map((y, i) => (
            <Line
              key={`snap-y-${i}`}
              points={[0, y, width, y]}
              stroke="#0ea5e9"
              strokeWidth={1 / zoom}
              dash={[4 / zoom, 4 / zoom]}
              listening={false}
            />
          ))}

          {/* Transformer for selected elements */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
            rotateEnabled={true}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
              'middle-left',
              'middle-right',
              'top-center',
              'bottom-center',
            ]}
            borderStroke="#0ea5e9"
            borderStrokeWidth={2 / zoom}
            anchorStroke="#0ea5e9"
            anchorFill="#ffffff"
            anchorSize={8 / zoom}
            anchorCornerRadius={4 / zoom}
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;
