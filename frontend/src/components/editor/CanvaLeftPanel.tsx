import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Layers as LayersIcon,
  Columns2,
  Sticker,
  Layout,
  Sparkles,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
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
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SectionInstance, PortfolioData } from "@/lib/portfolio-templates";

function LayerLabel({ instance }: { instance: SectionInstance }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(instance.label || "");
  const setSectionInstances = useEditorStore((s) => s.setSectionInstances);
  const customization = useEditorStore((s) => s.customization);

  const handleBlur = () => {
    setIsEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== instance.label) {
      const next = (customization.sectionInstances || []).map((l) =>
        l.id === instance.id ? { ...l, label: trimmed } : l
      );
      setSectionInstances(next);
    }
  };

  if (isEditing) {
    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleBlur();
          if (e.key === "Escape") {
            setValue(instance.label || "");
            setIsEditing(false);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-slate-800 text-white text-[12px] px-1 py-0.5 rounded outline-none border border-violet-500"
        autoFocus
      />
    );
  }

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="text-[12px] font-bold truncate select-none cursor-text text-slate-200 hover:text-white"
      title="Double click to rename"
    >
      {instance.label || "Untitled"}
    </div>
  );
}

function SortableLayerRow({ instance, selected, onSelect }: { instance: SectionInstance; selected?: boolean; onSelect?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transition, isDragging, transform } = useSortable({
    id: instance.id,
  });

  const toggleSectionVisibility = useEditorStore((s) => s.toggleSectionVisibility);
  const toggleSectionLock = useEditorStore((s) => s.toggleSectionLock);
  const toggleSectionCollapse = useEditorStore((s) => s.toggleSectionCollapse);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect && onSelect(instance.id)}
      tabIndex={0}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer focus:outline-none",
        selected ? "ring-2 ring-violet-500 bg-slate-900 border-violet-500/50" : "",
        instance.visible
          ? "bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 focus:bg-slate-900/60"
          : "bg-slate-950/20 border-slate-900/40 opacity-50",
        instance.locked ? "opacity-75" : ""
      )}
    >
      {/* Expand / collapse for collections */}
      {(instance.id === 'projects' || instance.id === 'experience' || instance.id === 'education') ? (
        <button onClick={(e) => { e.stopPropagation(); toggleSectionCollapse(instance.id); }} className="p-1">
          <ChevronRight className={cn("w-4 h-4 text-slate-400 hover:text-slate-200 transition-transform duration-150", instance.collapsed ? "" : "rotate-90")} />
        </button>
      ) : (
        <div className="w-4" />
      )}

      <button
        {...(instance.locked ? {} : attributes)}
        {...(instance.locked ? {} : listeners)}
        className={cn("cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 touch-none p-1", instance.locked ? "opacity-40" : "")}
        aria-label="Drag layer"
        title={instance.locked ? "Locked" : "Drag to reorder"}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <LayerLabel instance={instance} />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(instance.id); }}
        className="text-slate-500 hover:text-violet-300 transition-colors p-1"
        aria-label={instance.visible ? "Hide layer" : "Show layer"}
      >
        {instance.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); toggleSectionLock(instance.id); }}
        className={cn("transition-colors p-1 rounded flex items-center justify-center", instance.locked ? "bg-violet-950/25 text-violet-400" : "text-slate-500 hover:text-violet-400")}
        aria-label={instance.locked ? "Unlock layer" : "Lock layer"}
        title={instance.locked ? "Locked" : "Lock layer"}
      >
        {instance.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
      </button>
    </div>
  );
}

function SortableProjectRow({
  project,
  index,
}: {
  project: PortfolioData["projects"][number];
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transition, isDragging, transform } = useSortable({
    id: `project-${index}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-2 px-3 py-2 rounded-lg border bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-200"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 touch-none p-1"
        aria-label="Drag project"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-slate-200 truncate">
          {project.name || `Project ${index + 1}`}
        </div>
        {project.description ? (
          <div className="text-[11px] text-slate-400 truncate">{project.description}</div>
        ) : null}
      </div>
    </div>
  );
}

function SortableExperienceRow({
  exp,
  index,
}: {
  exp: PortfolioData["experience"][number];
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transition, isDragging, transform } = useSortable({
    id: `exp-${index}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-2 px-3 py-2 rounded-lg border bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-200"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 touch-none p-1"
        aria-label="Drag experience"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-slate-200 truncate">
          {exp.role || `Role ${index + 1}`} {exp.company ? `· ${exp.company}` : ""}
        </div>
        {exp.duration ? <div className="text-[11px] text-slate-400 truncate">{exp.duration}</div> : null}
      </div>
    </div>
  );
}

function SortableEducationRow({
  edu,
  index,
}: {
  edu: PortfolioData["education"][number];
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transition, isDragging, transform } = useSortable({
    id: `edu-${index}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-2 px-3 py-2 rounded-lg border bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-200"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 touch-none p-1"
        aria-label="Drag education"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-slate-200 truncate">
          {edu.degree || `Degree ${index + 1}`} {edu.institution ? `· ${edu.institution}` : ""}
        </div>
        {edu.duration ? <div className="text-[11px] text-slate-400 truncate">{edu.duration}</div> : null}
      </div>
    </div>
  );
}

export default function CanvaLeftPanel() {
  const {
    customization,
    leftPanelTab,
    setLeftPanelTab,
    setSectionVariant,
    viewport,
    setViewport,
    moveSection,
    selectedThemeId,
    setTheme,
    portfolioData,
    setPortfolioData,
    toggleSectionVisibility,
    setSectionInstances,
  } = useEditorStore();

  const layers = useMemo(
    () => (customization.sectionInstances || []) as SectionInstance[],
    [customization.sectionInstances]
  );

  const projects = portfolioData.projects || [];
  const experience = portfolioData.experience || [];
  const education = portfolioData.education || [];

  const [searchTerm, setSearchTerm] = useState("");
  const setSelectedSectionId = useEditorStore((s) => s.setSelectedSectionId);
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId);
  const toggleSectionLock = useEditorStore((s) => s.toggleSectionLock);
  const toggleSectionCollapse = useEditorStore((s) => s.toggleSectionCollapse);

  const filteredLayers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return layers;
    return layers.filter((l) => l.label?.toLowerCase().includes(q) || l.type?.toLowerCase().includes(q));
  }, [layers, searchTerm]);

  const showProjectsEditor = layers.some((l) => l.id === "projects" && l.visible);
  const showExperienceEditor = layers.some((l) => l.id === "experience" && l.visible);
  const showEducationEditor = layers.some((l) => l.id === "education" && l.visible);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndSections = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = layers.findIndex((s) => s.id === active.id);
    const newIndex = layers.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    moveSection(oldIndex, newIndex);
  };

  const handleDragEndProjects = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = Number(String(active.id).replace("project-", ""));
    const overIndex = Number(String(over.id).replace("project-", ""));
    if (!Number.isFinite(activeIndex) || !Number.isFinite(overIndex)) return;

    setPortfolioData({ ...portfolioData, projects: arrayMove(projects, activeIndex, overIndex) });
  };

  const handleDragEndExperience = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = Number(String(active.id).replace("exp-", ""));
    const overIndex = Number(String(over.id).replace("exp-", ""));
    if (!Number.isFinite(activeIndex) || !Number.isFinite(overIndex)) return;

    setPortfolioData({ ...portfolioData, experience: arrayMove(experience, activeIndex, overIndex) });
  };

  const handleDragEndEducation = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = Number(String(active.id).replace("edu-", ""));
    const overIndex = Number(String(over.id).replace("edu-", ""));
    if (!Number.isFinite(activeIndex) || !Number.isFinite(overIndex)) return;

    setPortfolioData({ ...portfolioData, education: arrayMove(education, activeIndex, overIndex) });
  };

  const tabs = [
    { id: "arrange", label: "Arrange", icon: <Columns2 className="w-3.5 h-3.5" /> },
    { id: "layers", label: "Layers", icon: <LayersIcon className="w-3.5 h-3.5" /> },
    { id: "add", label: "Add", icon: <Sticker className="w-3.5 h-3.5" /> },
  ] as const;

  const handleAddProject = () => {
    setPortfolioData({
      ...portfolioData,
      projects: [
        ...projects,
        { name: "New Project", description: "Describe what you built", technologies: [], link: "" },
      ],
    });
  };

  const handleRemoveProject = (index: number) => {
    setPortfolioData({ ...portfolioData, projects: projects.filter((_, i) => i !== index) });
  };

  const handleAddExperience = () => {
    setPortfolioData({
      ...portfolioData,
      experience: [
        ...experience,
        { company: "Company", role: "Role", duration: "Duration", description: "Describe your impact", highlights: [] },
      ],
    });
  };

  const handleRemoveExperience = (index: number) => {
    setPortfolioData({ ...portfolioData, experience: experience.filter((_, i) => i !== index) });
  };

  const handleAddEducation = () => {
    setPortfolioData({
      ...portfolioData,
      education: [
        ...education,
        { institution: "Institution", degree: "Degree", duration: "Duration", gpa: "", highlights: [] },
      ],
    });
  };

  const handleRemoveEducation = (index: number) => {
    setPortfolioData({ ...portfolioData, education: education.filter((_, i) => i !== index) });
  };

  // Section Adder Helper
  const handleAddSection = (type: string, label: string) => {
    const exists = layers.some((l) => l.type === type);
    if (exists) {
      const next = layers.map((l) =>
        l.type === type ? { ...l, visible: true } : l
      );
      setSectionInstances(next);
    } else {
      const next = [
        ...layers,
        { id: type, type, label, visible: true },
      ];
      setSectionInstances(next);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F1113] border-r border-slate-900 text-slate-200">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-slate-900 bg-[#0F1113]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center font-black text-violet-400">✦</span>
            <div className="leading-tight">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Editor</div>
              <div className="text-[13px] font-black text-slate-200">Canvas Sidebar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 py-2 border-b border-slate-900/50 bg-[#0F1113]">
        <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-900">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setLeftPanelTab(t.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 h-8.5 rounded-lg font-bold text-[11.5px] transition-all",
                leftPanelTab === t.id
                  ? "bg-slate-900 text-white shadow-sm border border-slate-800"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              )}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {leftPanelTab === "arrange" && (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2.5">Arrange Workspace</div>
                <div className="space-y-3">
                  <div className="text-[12px] font-medium text-slate-300">
                    Drag layers in the <span className="text-violet-400 font-bold">Layers</span> tab to reorder the template layout sequence.
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      className="h-10 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs" 
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Layout className="w-3.5 h-3.5 mr-2 text-slate-400" /> Tidy Layout
                    </Button>
                    <Button 
                      className="h-10 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs" 
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-2 text-slate-400" /> Auto Glow
                    </Button>
                  </div>

                  {/* Viewport Card */}
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
                    <div className="text-[12px] font-bold text-slate-200">Device Viewport</div>
                    <div className="text-[11px] text-slate-400 mt-1">Scale canvas to preview responsive states:</div>
                    <div className="mt-3.5 grid grid-cols-3 gap-2 bg-slate-950/50 p-1 rounded-xl border border-slate-900">
                      {(["desktop", "tablet", "mobile"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setViewport(v)}
                          className={cn(
                            "h-8 rounded-lg font-bold text-[11px] transition-all capitalize",
                            viewport === v
                              ? "bg-slate-900 text-white border border-slate-800 shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {leftPanelTab === "layers" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Layers Tree</div>
                  <span className="text-[9px] text-slate-500 font-bold">Double-click title to rename</span>
                </div>

                <div className="mt-2.5 relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-200 text-[12px] outline-none focus:border-violet-500/50 placeholder:text-slate-600 transition-colors"
                    placeholder="Search section layers..."
                  />
                </div>
              </div>

              {/* Dnd Section Instances */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSections}>
                <SortableContext items={filteredLayers.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div 
                    className="space-y-2 focus:outline-none" 
                    tabIndex={0} 
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        const ids = filteredLayers.map(f => f.id);
                        const idx = ids.indexOf(selectedSectionId ?? ids[0]);
                        if (e.key === 'ArrowDown') {
                          const next = ids[Math.min(ids.length - 1, (idx === -1 ? 0 : idx) + 1)];
                          setSelectedSectionId(next);
                        } else {
                          const prev = ids[Math.max(0, (idx === -1 ? 0 : idx) - 1)];
                          setSelectedSectionId(prev);
                        }
                      } else if (e.key === 'Enter') {
                        const sel = selectedSectionId;
                        if (sel && (sel === 'projects' || sel === 'experience' || sel === 'education')) {
                          e.preventDefault();
                          toggleSectionCollapse(sel);
                        }
                      } else if (e.key === ' ') {
                        const sel = selectedSectionId;
                        if (sel) {
                          e.preventDefault();
                          toggleSectionVisibility(sel);
                        }
                      } else if (e.key.toLowerCase() === 'l') {
                        const sel = selectedSectionId;
                        if (sel) {
                          e.preventDefault();
                          toggleSectionLock(sel);
                        }
                      }
                    }}
                  >
                    {filteredLayers.map((layer) => (
                      <div key={layer.id}>
                        <SortableLayerRow
                          instance={layer}
                          selected={layer.id === selectedSectionId}
                          onSelect={(id) => setSelectedSectionId(id)}
                        />

                        {/* Nested collection lists */}
                        {layer.id === 'projects' && projects.length > 0 && (
                          <div className={cn("ml-6 mt-1.5 pl-3 border-l border-slate-800 space-y-1 overflow-hidden transition-[max-height] duration-200 ease-out", layer.collapsed ? "max-h-0" : "max-h-[500px]")}>
                            {projects.map((p, i) => (
                              <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 bg-slate-900/30 border border-slate-900/65">
                                <span className="truncate font-medium">{p.name || `Project ${i+1}`}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {layer.id === 'experience' && experience.length > 0 && (
                          <div className={cn("ml-6 mt-1.5 pl-3 border-l border-slate-800 space-y-1 overflow-hidden transition-[max-height] duration-200 ease-out", layer.collapsed ? "max-h-0" : "max-h-[500px]")}>
                            {experience.map((ex, i) => (
                              <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 bg-slate-900/30 border border-slate-900/65">
                                <span className="truncate font-medium">{ex.role || `Role ${i+1}`}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {layer.id === 'education' && education.length > 0 && (
                          <div className={cn("ml-6 mt-1.5 pl-3 border-l border-slate-800 space-y-1 overflow-hidden transition-[max-height] duration-200 ease-out", layer.collapsed ? "max-h-0" : "max-h-[500px]")}>
                            {education.map((ed, i) => (
                              <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 bg-slate-900/30 border border-slate-900/65">
                                <span className="truncate font-medium">{ed.degree || `Degree ${i+1}`}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Sub-item Reordering lists */}
              {showProjectsEditor && (
                <div className="space-y-2 border-t border-slate-900/80 pt-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Project Cards Order</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 border border-slate-850 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-[10px] px-2"
                      onClick={handleAddProject}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Card
                    </Button>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndProjects}>
                    <SortableContext items={projects.map((_, idx) => `project-${idx}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {projects.length === 0 ? (
                          <div className="text-[11px] text-slate-500 bg-slate-900/20 border border-slate-800 rounded-lg p-3 text-center">
                            No projects added.
                          </div>
                        ) : (
                          projects.map((p, idx) => (
                            <div key={idx} className="relative group/card">
                              <SortableProjectRow project={p} index={idx} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveProject(idx)}
                                className="absolute right-1 top-1 h-7 w-7 p-0 bg-slate-950/70 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-800 rounded-lg opacity-0 group-hover/card:opacity-100 transition-opacity"
                                aria-label="Remove project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {showExperienceEditor && (
                <div className="space-y-2 border-t border-slate-900/80 pt-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Work Logs Order</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 border border-slate-850 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-[10px] px-2"
                      onClick={handleAddExperience}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Card
                    </Button>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndExperience}>
                    <SortableContext items={experience.map((_, idx) => `exp-${idx}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {experience.length === 0 ? (
                          <div className="text-[11px] text-slate-500 bg-slate-900/20 border border-slate-800 rounded-lg p-3 text-center">
                            No experience added.
                          </div>
                        ) : (
                          experience.map((e, idx) => (
                            <div key={idx} className="relative group/card">
                              <SortableExperienceRow exp={e} index={idx} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExperience(idx)}
                                className="absolute right-1 top-1 h-7 w-7 p-0 bg-slate-950/70 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-800 rounded-lg opacity-0 group-hover/card:opacity-100 transition-opacity"
                                aria-label="Remove experience"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {showEducationEditor && (
                <div className="space-y-2 border-t border-slate-900/80 pt-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Education Cards</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 border border-slate-850 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-[10px] px-2"
                      onClick={handleAddEducation}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Card
                    </Button>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndEducation}>
                    <SortableContext items={education.map((_, idx) => `edu-${idx}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {education.length === 0 ? (
                          <div className="text-[11px] text-slate-500 bg-slate-900/20 border border-slate-800 rounded-lg p-3 text-center">
                            No education records added.
                          </div>
                        ) : (
                          education.map((ed, idx) => (
                            <div key={idx} className="relative group/card">
                              <SortableEducationRow edu={ed} index={idx} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEducation(idx)}
                                className="absolute right-1 top-1 h-7 w-7 p-0 bg-slate-950/70 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-800 rounded-lg opacity-0 group-hover/card:opacity-100 transition-opacity"
                                aria-label="Remove education"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          )}

          {leftPanelTab === "add" && (
            <div className="space-y-4">
              {/* Optional Section Adder */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2.5">Add Layout Sections</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Certifications", key: "certifications", desc: "Show awards & licenses" },
                    { label: "Languages", key: "languages", desc: "Specify tongues spoken" },
                    { label: "Interests", key: "interests", desc: "Hobbies & interests" },
                    { label: "Custom Section", key: "custom", desc: "Add generic text/blocks" },
                  ].map((s) => {
                    const alreadyAdded = layers.some(l => l.type === s.key && l.visible);
                    return (
                      <Button
                        key={s.key}
                        variant="outline"
                        className={cn(
                          "h-14 border border-slate-800 flex flex-col items-start p-2.5 justify-center leading-normal text-left transition-all",
                          alreadyAdded 
                            ? "bg-violet-950/20 border-violet-800/60 text-violet-300"
                            : "bg-slate-900 text-slate-200 hover:bg-slate-850"
                        )}
                        onClick={() => handleAddSection(s.key, s.label)}
                      >
                        <span className="text-[12px] font-bold block">{s.label}</span>
                        <span className="text-[9px] text-slate-400 block font-normal leading-none mt-0.5 truncate w-full">{s.desc}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Original element tags (variant modifiers) */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Variant Editor Toggles</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Skills Variant", key: "skills", variant: "default" },
                    { label: "Experience Style", key: "experience", variant: "default" },
                    { label: "Projects View", key: "projects", variant: "default" },
                    { label: "Education Layout", key: "education", variant: "default" },
                  ].map((x) => (
                    <Button
                      key={x.key}
                      variant="outline"
                      className="h-11 border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-xs"
                      onClick={() => setSectionVariant(x.key, x.variant)}
                    >
                      {x.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Themes selector */}
              <div className="rounded-xl border border-slate-850 bg-slate-900/30 p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pick Theme Style</div>
                <div className="mt-2 text-[12px] font-bold text-slate-300">Switch core builder aesthetic preset:</div>
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <button
                    className={cn(
                      "h-9 rounded-xl border font-bold text-[12px] transition-all",
                      selectedThemeId === "neo-brutalist"
                        ? "bg-violet-600 text-white border-violet-500 shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                    onClick={() => setTheme("neo-brutalist")}
                  >
                    Neo-Brutalist
                  </button>
                  <button
                    className={cn(
                      "h-9 rounded-xl border font-bold text-[12px] transition-all",
                      selectedThemeId === "minimal-swiss"
                        ? "bg-violet-600 text-white border-violet-500 shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                    onClick={() => setTheme("minimal-swiss")}
                  >
                    Minimal Swiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
