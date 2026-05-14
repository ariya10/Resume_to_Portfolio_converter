import { TEMPLATES, type TemplateConfig } from "@/lib/portfolio-templates";
import { CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  recommendedIds?: string[];
}

export default function TemplateSelector({ selectedId, onSelect, recommendedIds = [] }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {TEMPLATES.map((template: TemplateConfig) => {
        const isSelected = selectedId === template.id;
        const isRecommended = recommendedIds.includes(template.id);

        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={cn(
              "relative group text-left rounded-xl overflow-hidden border transition-all duration-300",
              isSelected
                ? "border-violet-500 ring-2 ring-violet-500/30 bg-violet-500/10"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
            )}
          >
            {isRecommended && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-amber-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                <Star className="w-3 h-3" />
                Recommended
              </div>
            )}

            {isSelected && (
              <div className="absolute top-3 left-3 z-10">
                <CheckCircle2 className="w-6 h-6 text-violet-400" />
              </div>
            )}

            <div className="aspect-[4/3] overflow-hidden bg-slate-800">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1">{template.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-slate-300 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}