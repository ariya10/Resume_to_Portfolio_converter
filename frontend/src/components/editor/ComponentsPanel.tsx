import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Layout,
  Eye,
  EyeOff,
  GripVertical,
  Search,
  Monitor,
  Tablet,
  Smartphone,
  Grid3X3,
  Layers,
  Columns2,
  Square,
  PanelLeft,
  PanelRight,
  SplitSquareHorizontal,
  LayoutGrid,
  BookOpen,
  GitBranch,
  SquareStack,
  Maximize2,
  AlignJustify,
  Minimize2,
  ChevronDown,
  Check,
  MousePointer2,
  Sticker,
  Shapes,
  Image as ImageIcon,
  Star,
  Heart,
  ArrowRight,
  Sparkles,
  Circle as CircleIcon,
  Square as SquareIcon,
  Triangle,
  Palette,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getDefaultCustomization, THEME_PRESETS } from "@/lib/portfolio-templates";

type ViewportSize = "desktop" | "tablet" | "mobile";

const PREMIUM_LAYOUTS = [
  { id: "minimal", name: "Minimal Streamline", description: "Clean, single-column flow" },
  { id: "split", name: "Split Screen", description: "Fixed sidebar, scrolling content" },
  { id: "grid", name: "Bento Grid", description: "Modern masonry grid style" },
];
import { useEditorStore } from "@/store/editor-store";

// ─── Sortable Section Item ─────────────────────────────────────────

function SortableSectionItem({ id, label, visible }: { id: string; label: string; visible: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const toggleSectionVisibility = useEditorStore((s) => s.toggleSectionVisibility);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
        visible
          ? "bg-white/5 border-white/10 hover:border-violet-500/30"
          : "bg-white/[0.02] border-white/5 opacity-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className={cn("flex-1 text-sm", visible ? "text-slate-200" : "text-slate-500")}>{label}</span>
      <button
        onClick={() => toggleSectionVisibility(id)}
        className="text-slate-500 hover:text-violet-400 transition-colors"
      >
        {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────

export default function ComponentsPanel() {
  const {
    selectedThemeId,
    selectedLayoutId,
    customization,
    leftPanelTab,
    viewport,
    themeSearch,
    themeCategory,
    setTheme,
    setLeftPanelTab,
    setLayout,
    setViewport,
    setThemeSearch,
    setThemeCategory,
    moveSection,
    setSectionVariant,
  } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const instances = customization.sectionInstances || [];
        const oldIndex = instances.findIndex((s) => s.id === active.id);
        const newIndex = instances.findIndex((s) => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          moveSection(oldIndex, newIndex);
        }
      }
    },
    [customization.sectionInstances, moveSection]
  );

  const categories = [
    { id: "all", label: "All" },
    { id: "student", label: "Student" },
    { id: "fresher", label: "Fresher" },
    { id: "professional", label: "Professional" },
    { id: "freelancer", label: "Freelancer" },
    { id: "developer", label: "Developer" },
  ];

  return (
    <div className="flex flex-col h-full">
            {/* Tab Switcher */}
      <div className="flex border-b border-white/10 px-1 pt-1">
        {([
          { id: "templates" as const, icon: <Grid3X3 className="w-3.5 h-3.5" />, label: "Templates" },
          
          { id: "sections" as const, icon: <Layers className="w-3.5 h-3.5" />, label: "Layers" },
          { id: "assets" as const, icon: <Sticker className="w-3.5 h-3.5" />, label: "Assets" },
          { id: "layout" as const, icon: <Layout className="w-3.5 h-3.5" />, label: "Layouts" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLeftPanelTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors border-b-2",
              leftPanelTab === tab.id
                ? "text-violet-300 border-violet-500"
                : "text-slate-400 border-transparent hover:text-slate-300"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3">

          {/* Layers Tab (formerly Sections) */}
          {leftPanelTab === "sections" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Canvas Layers</p>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] text-violet-400">Lock All</Button>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={(customization.sectionInstances || []).map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {(customization.sectionInstances || []).map((section) => (
                      <SortableSectionItem
                        key={section.id}
                        id={section.id}
                        label={section.label}
                        visible={section.visible}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              
              <div className="pt-4 border-t border-white/5">
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3">Add Elements</p>
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-16 flex-col gap-1.5 bg-white/5 border-white/10 hover:bg-white/10 text-[10px]">
                       <Type className="w-4 h-4 text-violet-400" /> Add Text
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1.5 bg-white/5 border-white/10 hover:bg-white/10 text-[10px]">
                       <ImageIcon className="w-4 h-4 text-emerald-400" /> Add Image
                    </Button>
                 </div>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {leftPanelTab === "assets" && (
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3">Shapes</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "square", icon: <SquareIcon className="w-5 h-5" /> },
                    { id: "circle", icon: <CircleIcon className="w-5 h-5" /> },
                    { id: "triangle", icon: <Triangle className="w-5 h-5" /> },
                    { id: "line", icon: <GripVertical className="w-5 h-5 rotate-90" /> },
                  ].map(shape => (
                    <button key={shape.id} className="aspect-square flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-violet-500/50 transition-all text-slate-300">
                      {shape.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3">Graphics & Icons</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "star", icon: <Star className="w-5 h-5" /> },
                    { id: "heart", icon: <Heart className="w-5 h-5" /> },
                    { id: "arrow", icon: <ArrowRight className="w-5 h-5" /> },
                    { id: "sparkle", icon: <Sparkles className="w-5 h-5" /> },
                    { id: "badge", icon: <Check className="w-5 h-5" /> },
                    { id: "layout", icon: <Grid3X3 className="w-5 h-5" /> },
                    { id: "image", icon: <ImageIcon className="w-5 h-5" /> },
                    { id: "cursor", icon: <MousePointer2 className="w-5 h-5" /> },
                  ].map(icon => (
                    <button key={icon.id} className="aspect-square flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-violet-500/50 transition-all text-slate-300">
                      {icon.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-600/20 to-emerald-600/20 border border-white/10">
                <p className="text-xs font-bold text-white mb-1">Upload Media</p>
                <p className="text-[10px] text-slate-400 mb-3">Drag and drop images here</p>
                <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 border-none text-[10px] font-bold">Select Files</Button>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {leftPanelTab === "templates" && (
            <div className="space-y-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Choose a Template</p>
              <div className="grid gap-2">
                {THEME_PRESETS.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTheme(tpl.id)}
                    className={cn(
                      "relative group flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      selectedThemeId === tpl.id
                        ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_16px_rgba(139,92,246,0.15)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    {/* Color swatch */}
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 border border-white/10"
                      style={{ background: `linear-gradient(135deg, ${tpl.defaultColors.primary}, ${tpl.defaultColors.accent})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">{tpl.name}</span>
                      <p className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-1">{tpl.description}</p>
                    </div>
                    {selectedThemeId === tpl.id && (
                      <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {leftPanelTab === "layout" && (
            <div className="space-y-4">
              
              {/* Premium Layouts */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Structural Layout</p>
                <div className="grid gap-2">
                  {PREMIUM_LAYOUTS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLayout(opt.id)}
                      className={cn(
                        "flex flex-col items-start gap-1 py-3 px-3 rounded-lg border transition-all text-left",
                        selectedLayoutId === opt.id
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/5"
                      )}
                    >
                      <span className="text-[11px] font-bold text-white">{opt.name}</span>
                      <span className="text-[9px] text-slate-500">{opt.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Style Controls */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Section Styles</p>
                <div className="grid gap-3">
                  {[
                    {
                      section: "skills",
                      label: "Skills Style",
                      options: [
                        { id: "default", label: "Tags" },
                        { id: "grid", label: "Grid" },
                      ],
                    },
                    {
                      section: "experience",
                      label: "Experience Style",
                      options: [
                        { id: "default", label: "Cards" },
                        { id: "timeline", label: "Timeline" },
                      ],
                    },
                    {
                      section: "projects",
                      label: "Projects Style",
                      options: [
                        { id: "default", label: "Cards" },
                        { id: "gallery", label: "Gallery" },
                      ],
                    },
                  ].map((group) => (
                    <div key={group.section} className="space-y-2">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{group.label}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {group.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSectionVariant(group.section, opt.id)}
                            className={cn(
                              "text-[10px] rounded-lg px-2.5 py-2 border transition-all",
                              customization.sectionVariants?.[group.section] === opt.id
                                ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                                : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viewport */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Preview Viewport</p>
                <div className="flex gap-1.5">
                  {([
                    { id: "desktop" as ViewportSize, icon: <Monitor className="w-4 h-4" />, label: "Desktop" },
                    { id: "tablet" as ViewportSize, icon: <Tablet className="w-4 h-4" />, label: "Tablet" },
                    { id: "mobile" as ViewportSize, icon: <Smartphone className="w-4 h-4" />, label: "Mobile" },
                  ] as const).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setViewport(v.id)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-all text-[10px]",
                        viewport === v.id
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"
                      )}
                    >
                      {v.icon}
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}