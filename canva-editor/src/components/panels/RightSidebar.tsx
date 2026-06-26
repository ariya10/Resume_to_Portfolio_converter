import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertiesPanel } from './PropertiesPanel';
import { AnimationsPanel } from './AnimationsPanel';
import { AppearancePanel } from './AppearancePanel';
import { Settings, Sparkles, Palette } from 'lucide-react';
import { useEditorStore, useSelectedElements } from '@/stores/editorStore';

export function RightSidebar() {
  const { rightPanelTab, rightPanelOpen } = useEditorStore((s) => ({
    rightPanelTab: s.rightPanelTab,
    rightPanelOpen: s.rightPanelOpen,
  }));
  const selectedElements = useSelectedElements();

  if (!rightPanelOpen) return null;

  return (
    <div className="w-80 h-full flex flex-col bg-white">
      <Tabs
        value={rightPanelTab}
        onValueChange={(v) =>
          useEditorStore.setState({ rightPanelTab: v as any })
        }
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full grid grid-cols-3 h-12 bg-slate-50 rounded-none border-b">
          <TabsTrigger value="properties" className="flex flex-col items-center gap-1 py-2">
            <Settings className="w-4 h-4" />
            <span className="text-xs">Properties</span>
          </TabsTrigger>
          <TabsTrigger value="animations" className="flex flex-col items-center gap-1 py-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs">Animate</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex flex-col items-center gap-1 py-2">
            <Palette className="w-4 h-4" />
            <span className="text-xs">Style</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="properties" className="h-full m-0 p-0">
            <PropertiesPanel selectedElements={selectedElements} />
          </TabsContent>
          <TabsContent value="animations" className="h-full m-0 p-0">
            <AnimationsPanel selectedElements={selectedElements} />
          </TabsContent>
          <TabsContent value="appearance" className="h-full m-0 p-0">
            <AppearancePanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default RightSidebar;
