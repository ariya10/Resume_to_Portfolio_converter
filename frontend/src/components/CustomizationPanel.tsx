import { FONT_OPTIONS, ALL_SECTIONS, type CustomizationOptions } from "@/lib/portfolio-templates";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, LayoutList } from "lucide-react";

interface CustomizationPanelProps {
  customization: CustomizationOptions;
  onChange: (c: CustomizationOptions) => void;
}

const COLOR_FIELDS: { key: keyof CustomizationOptions["colors"]; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "text", label: "Text" },
  { key: "textSecondary", label: "Text Secondary" },
];

const SECTION_LABELS: Record<string, string> = {
  about: "About / Bio",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  certifications: "Certifications",
  contact: "Contact",
};

export default function CustomizationPanel({ customization, onChange }: CustomizationPanelProps) {
  const updateColor = (key: keyof CustomizationOptions["colors"], value: string) => {
    onChange({
      ...customization,
      colors: { ...customization.colors, [key]: value },
    });
  };

  const toggleSection = (section: string) => {
    const sections = customization.sections.includes(section)
      ? customization.sections.filter((s) => s !== section)
      : [...customization.sections, section];
    onChange({ ...customization, sections });
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Colors</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {COLOR_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="color"
                value={customization.colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <Label className="text-xs text-slate-300">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Font Family</h3>
        </div>
        <Select
          value={customization.fontFamily}
          onValueChange={(v) => onChange({ ...customization, fontFamily: v })}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.value} value={font.value} className="text-white text-sm">
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sections */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LayoutList className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Sections</h3>
        </div>
        <div className="space-y-2.5">
          {ALL_SECTIONS.map((section) => (
            <div key={section.type} className="flex items-center justify-between">
              <Label className="text-xs text-slate-300">{SECTION_LABELS[section.type]}</Label>
              <Switch
                checked={customization.sections.includes(section.type)}
                onCheckedChange={() => toggleSection(section.type)}
                className="data-[state=checked]:bg-violet-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}