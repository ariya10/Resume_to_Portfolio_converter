import { useMemo } from "react";
import {
  Layers as LayersIcon,
  Columns2,
  Sticker,
  Layout,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Search,
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

function SortableLayerRow({ instance }: { instance: SectionInstance }) {
  const { attributes, listeners, setNodeRef, transition, isDragging, transform } = useSortable({
    id: instance.id,
  });

  const toggleSectionVisibility = useEditorStore((s) => s.toggleSectionVisibility);

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
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
        instance.visible
          ? "bg-white/5 border-white/10 hover:border-violet-500/30"
          : "bg-white/[0.02] border-white/5 opacity-60"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-200 touch-none"
        aria-label="Drag layer"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-slate-200 truncate">{instance.label || "Untitled"}</div>
      </div>

      <button
        onClick={() => toggleSectionVisibility(instance.id)}
        className="text-slate-500 hover:text-violet-300 transition-colors"
        aria-label={instance.visible ? "Hide layer" : "Show layer"}
      >
        {instance.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
      className="group flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-white/90 border-black/10"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-black/70 touch-none"
        aria-label="Drag project"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-black text-black/80 truncate">
          {project.name || `Project ${index + 1}`}
        </div>
        {project.description ? (
          <div className="text-[11px] text-black/50 truncate">{project.description}</div>
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
      className="group flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-white/90 border-black/10"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-black/70 touch-none"
        aria-label="Drag experience"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-black text-black/80 truncate">
          {exp.role || `Role ${index + 1}`} {exp.company ? `· ${exp.company}` : ""}
        </div>
        {exp.duration ? <div className="text-[11px] text-black/50 truncate">{exp.duration}</div> : null}
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
      className="group flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-white/90 border-black/10"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-black/70 touch-none"
        aria-label="Drag education"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-black text-black/80 truncate">
          {edu.degree || `Degree ${index + 1}`} {edu.institution ? `· ${edu.institution}` : ""}
        </div>
        {edu.duration ? <div className="text-[11px] text-black/50 truncate">{edu.duration}</div> : null}
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
  } = useEditorStore();

  const layers = useMemo(
    () => (customization.sectionInstances || []) as SectionInstance[],
    [customization.sectionInstances]
  );

  const projects = portfolioData.projects || [];
  const experience = portfolioData.experience || [];
  const education = portfolioData.education || [];

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

  return (
    <div className="h-full flex flex-col bg-[#F7F7F7] border-r border-black/10">
      <div className="px-4 py-3 border-b border-black/10 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center font-black">
              ✦
            </span>
            <div className="leading-tight">
              <div className="text-[12px] font-black uppercase tracking-widest text-black/70">Builder</div>
              <div className="text-[14px] font-black text-black">Canvas</div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 border border-black/10 bg-white hover:bg-black/5 text-black"
            onClick={() => {}}
          >
            <span className="text-[12px] font-bold">⋯</span>
          </Button>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-black/10 bg-white">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setLeftPanelTab(t.id)}
              className={cn(
                "flex items-center justify-center gap-2 h-9 rounded-xl border-2 font-black text-[12px] transition-colors",
                leftPanelTab === t.id
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white text-black/70 hover:bg-black/5"
              )}
            >
              {t.icon}
              <span className="hidden">{t.label}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {leftPanelTab === "arrange" && (
            <div className="space-y-3">
              <div>
                <div className="text-[12px] font-black uppercase tracking-widest text-black/60 mb-2">Arrange</div>
                <div className="space-y-2">
                  <div className="text-[13px] font-bold text-black/80">
                    Drag layers in <span className="underline underline-offset-2">Layers</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button className="h-10 border-2 border-black bg-white hover:bg-black/5 text-black font-black" variant="outline">
                      <Layout className="w-4 h-4 mr-2" /> Tidy
                    </Button>
                    <Button className="h-10 border-2 border-black bg-white hover:bg-black/5 text-black font-black" variant="outline">
                      <Sparkles className="w-4 h-4 mr-2" /> Flip
                    </Button>
                  </div>

                  <div className="rounded-xl border-2 border-black/10 bg-white p-3">
                    <div className="text-[12px] font-bold">Viewport</div>
                    <div className="text-[11px] text-black/60 mt-1">Use existing editor viewport control</div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {(["desktop", "tablet", "mobile"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setViewport(v)}
                          className={cn(
                            "h-9 rounded-lg border-2 font-black text-[11px] transition-colors",
                            viewport === v
                              ? "border-black bg-black text-white"
                              : "border-black/15 bg-white text-black/70 hover:bg-black/5"
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
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-black uppercase tracking-widest text-black/60">Layers</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-2 border-black bg-white hover:bg-black/5 text-black font-black"
                    onClick={() => {}}
                  >
                    Lock
                  </Button>
                </div>

                <div className="mt-2 relative">
                  <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-black/40" />
                  <input
                    className="w-full h-9 pl-8 pr-3 rounded-lg border-2 border-black/10 bg-white text-black font-bold text-[12px] outline-none focus:border-black"
                    placeholder="Search layers"
                  />
                </div>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSections}>
                <SortableContext items={layers.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {layers.map((layer) => (
                      <SortableLayerRow key={layer.id} instance={layer} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {showProjectsEditor && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-black uppercase tracking-widest text-black/60">Projects order</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-2 border-black bg-white hover:bg-black/5 text-black font-black"
                      onClick={handleAddProject}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndProjects}>
                    <SortableContext items={projects.map((_, idx) => `project-${idx}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {projects.length === 0 ? (
                          <div className="text-[12px] text-black/60 bg-white border-2 border-black/10 rounded-lg p-3">
                            No projects yet.
                          </div>
                        ) : (
                          projects.map((p, idx) => (
                            <div key={idx} className="relative">
                              <SortableProjectRow project={p} index={idx} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveProject(idx)}
                                className="absolute right-1 top-1 h-7 w-7 p-0 bg-white/80 hover:bg-white border border-black/10 rounded-lg"
                                aria-label="Remove project"
                              >
                                <Trash2 className="w-4 h-4 text-black/60" />
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-black uppercase tracking-widest text-black/60">Experience order</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-2 border-black bg-white hover:bg-black/5 text-black font-black"
                      onClick={handleAddExperience}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndExperience}>
                    <SortableContext items={experience.map((_, idx) => `exp-${idx}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {experience.length === 0 ? (
                          <div className="text-[12px] text-black/60 bg-white border-2 border-black/10 rounded-lg p-3">
                            No experience yet.
                          </div>
                        ) : (
                          experience.map((e, idx) => (
                            <div key={idx} className="relative">
                              <SortableExperienceRow exp={e} index={idx} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExperience(idx)}
                                className="absolute right-1 top-1 h-7 w-7 p-0 bg-white/80 hover:bg-white border border-black/10 rounded-lg"
                                aria-label="Remove experience"
                              >
                                <Trash2 className="w-4 h-4 text-black/60" />
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-black uppercase tracking-widest text-black/60">Education order</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-2 border-black bg-white hover:bg-black/5 text-black font-black"
                      onClick={handleAddEducation}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndEducation}>
                    <SortableContext items={education.map((_, idx) => `edu-${idx}`)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {education.length === 0 ? (
                          <div className="text-[12px] text-black/60 bg-white border-2 border-black/10 rounded-lg p-3">
                            No education yet.
                          </div>
                        ) : (
                          education.map((e, idx) => (
                            <div key={idx} className="relative">
                              <SortableEducationRow edu={e} index={idx} />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEducation(idx)}
                                className="absolute right-1 top-1 h-7 w-7 p-0 bg-white/80 hover:bg-white border border-black/10 rounded-lg"
                                aria-label="Remove education"
                              >
                                <Trash2 className="w-4 h-4 text-black/60" />
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

          {leftPanelTab === ("add" as any) && (
            <div className="space-y-3">
              <div>
                <div className="text-[12px] font-black uppercase tracking-widest text-black/60 mb-2">Add</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Text", key: "skills", variant: "default" },
                    { label: "Heading", key: "experience", variant: "default" },
                    { label: "Image", key: "profile", variant: "default" },
                    { label: "Icon", key: "projects", variant: "default" },
                    { label: "Education", key: "education", variant: "default" },
                  ].map((x) => (
                    <Button
                      key={x.key}
                      variant="outline"
                      className="h-12 border-2 border-black/15 bg-white hover:bg-black/5 text-black font-black"
                      onClick={() => {
                        if (x.key !== "profile") setSectionVariant(x.key, x.variant);
                      }}
                    >
                      {x.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border-2 border-black/10 bg-white p-3">
                <div className="text-[12px] font-black uppercase tracking-widest text-black/60">Templates</div>
                <div className="mt-2 text-[12px] font-bold text-black/80">Pick your theme in the editor tabs</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    className={cn(
                      "h-10 rounded-xl border-2 font-black text-[12px]",
                      selectedThemeId === "neo-brutalist"
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white text-black/70 hover:bg-black/5"
                    )}
                    onClick={() => setTheme("neo-brutalist")}
                  >
                    Brutal
                  </button>
                  <button
                    className={cn(
                      "h-10 rounded-xl border-2 font-black text-[12px]",
                      selectedThemeId === "minimal-swiss"
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white text-black/70 hover:bg-black/5"
                    )}
                    onClick={() => setTheme("minimal-swiss")}
                  >
                    Swiss
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
