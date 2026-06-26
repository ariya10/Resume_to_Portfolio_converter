import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolsPanel } from './ToolsPanel';
import { AssetsPanel } from './AssetsPanel';
import { LayersPanel } from './LayersPanel';
import { MousePointer2, Image, Layers, LayoutTemplate } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';

export function LeftSidebar() {
  const { leftPanelTab, leftPanelOpen } = useEditorStore((state) => ({
    leftPanelTab: state.leftPanelTab,
    leftPanelOpen: state.leftPanelOpen,
  }));

  if (!leftPanelOpen) return null;

  return (
    <div className="w-80 h-full flex flex-col bg-white">
      <Tabs
        value={leftPanelTab}
        onValueChange={(value) => {
          useEditorStore.setState({ leftPanelTab: value as any });
        }}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full grid grid-cols-4 h-12 bg-slate-50 rounded-none border-b">
          <TabsTrigger value="tools" className="flex flex-col items-center gap-1 py-2">
            <MousePointer2 className="w-4 h-4" />
            <span className="text-xs">Tools</span>
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex flex-col items-center gap-1 py-2">
            <Image className="w-4 h-4" />
            <span className="text-xs">Assets</span>
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex flex-col items-center gap-1 py-2">
            <Layers className="w-4 h-4" />
            <span className="text-xs">Layers</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex flex-col items-center gap-1 py-2">
            <LayoutTemplate className="w-4 h-4" />
            <span className="text-xs">Templates</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="tools" className="h-full m-0 p-0">
            <ToolsPanel />
          </TabsContent>

          <TabsContent value="assets" className="h-full m-0 p-0">
            <AssetsPanel />
          </TabsContent>

          <TabsContent value="layers" className="h-full m-0 p-0">
            <LayersPanel />
          </TabsContent>

          <TabsContent value="templates" className="h-full m-0 p-0">
            <div className="p-4 text-center text-sm text-slate-500">
              Templates coming soon...
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default LeftSidebar;
