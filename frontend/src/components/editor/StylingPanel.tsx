import { useCallback, useRef } from "react";
import {
  Palette,
  Type,
  Sparkles,
  Wand2,
  ImageIcon,
  RotateCcw,
  Upload,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ThemeRegistry, THEME_PRESETS } from "@/lib/portfolio-templates";

const FONT_OPTIONS = [
  { label: "Inter (Sans-serif)", value: "Inter, sans-serif" },
  { label: "Roboto (Sans-serif)", value: "Roboto, sans-serif" },
  { label: "Playfair Display (Serif)", value: "'Playfair Display', serif" },
  { label: "Fira Code (Monospace)", value: "'Fira Code', monospace" },
  { label: "Outfit (Modern Sans)", value: "Outfit, sans-serif" },
  { label: "Syne (Display)", value: "Syne, sans-serif" },
  { label: "Space Grotesk (Tech)", value: "'Space Grotesk', sans-serif" },
];

type ColorPalette = any;
type FontPairing = any;
type AnimationProfile = any;
type VisualStyleConfig = any;
type ScrollAnimation = any;
type HoverEffect = any;
type ImageShape = any;
type ImageSize = any;
import { useEditorStore } from "@/store/editor-store";

// ─── Color Input ───────────────────────────────────────────────────

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-white/10 cursor-pointer bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded"
        />
      </div>
      <div className="flex-1">
        <Label className="text-[10px] text-slate-400 mb-0.5 block">{label}</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 text-[10px] bg-white/5 border-white/10 text-slate-300 font-mono px-2"
        />
      </div>
    </div>
  );
}

// ─── Colors Tab ────────────────────────────────────────────────────

function ColorsTab() {
  const { customization, setColors, selectedThemeId } = useEditorStore();
  const { colors } = customization;

  const activeTheme = THEME_PRESETS.find(t => t.id === selectedThemeId) ?? THEME_PRESETS[0];
  const variants = activeTheme.colorVariants ?? [];

  const applyVariant = useCallback((variantColors: any) => {
    setColors({ ...variantColors });
  }, [setColors]);

  const resetColors = useCallback(() => {
    setColors({ ...activeTheme.defaultColors });
  }, [activeTheme, setColors]);

  const colorFields = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "accent", label: "Accent" },
    { key: "background", label: "Background" },
    { key: "surface", label: "Surface" },
    { key: "text", label: "Text" },
    { key: "textSecondary", label: "Text Secondary" },
  ];

  return (
    <div className="space-y-5">
      {/* Color variants for the active template */}
      <div className="space-y-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
          {activeTheme.name} — Color Schemes
        </p>
        <div className="grid gap-1.5">
          {variants.map((variant) => {
            const isActive = colors?.primary === variant.colors.primary && colors?.accent === variant.colors.accent;
            return (
              <button
                key={variant.id}
                onClick={() => applyVariant(variant.colors)}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left",
                  isActive
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10"
                )}
              >
                <div className="flex gap-1 shrink-0">
                  {[variant.colors.primary, variant.colors.accent, variant.colors.background, variant.colors.surface, variant.colors.text].map((c, i) => (
                    <span key={i} className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-slate-200 flex-1">{variant.name}</span>
                {isActive && <Check className="w-3 h-3 text-violet-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-white/10 w-full" />

      {/* Fine-tune individual colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Fine-tune</p>
          <button onClick={resetColors} className="text-[10px] text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
        {colorFields.map(({ key, label }) => (
          <ColorInput key={key} label={label} value={colors?.[key] || "#ffffff"} onChange={(v) => setColors({ ...colors, [key]: v })} />
        ))}
      </div>
    </div>
  );
}

// ─── Fonts Tab ─────────────────────────────────────────────────────

function FontsTab() {
  const { customization, setFonts } = useEditorStore();
  const { fonts } = customization;

  const updateFont = useCallback(
    (key: keyof FontPairing, value: string) => {
      setFonts({ ...fonts, [key]: value });
    },
    [fonts, setFonts]
  );

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Typography</p>

      <div>
        <Label className="text-[10px] text-slate-400 mb-1 block">Heading Font</Label>
        <Select value={fonts.heading} onValueChange={(v) => updateFont("heading", v)}>
          <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A2E] border-white/10">
            {FONT_OPTIONS.map((f) => (
              <SelectItem key={f.value} value={f.value} className="text-slate-200 text-[11px] focus:bg-violet-500/20 focus:text-violet-200">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] text-slate-400 mb-1 block">Heading Weight</Label>
        <Select value={fonts.headingWeight} onValueChange={(v) => updateFont("headingWeight", v)}>
          <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A2E] border-white/10">
            {["300", "400", "500", "600", "700"].map((w) => (
              <SelectItem key={w} value={w} className="text-slate-200 text-[11px] focus:bg-violet-500/20 focus:text-violet-200">
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] text-slate-400 mb-1 block">Body Font</Label>
        <Select value={fonts.body} onValueChange={(v) => updateFont("body", v)}>
          <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A2E] border-white/10">
            {FONT_OPTIONS.map((f) => (
              <SelectItem key={f.value} value={f.value} className="text-slate-200 text-[11px] focus:bg-violet-500/20 focus:text-violet-200">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] text-slate-400 mb-1 block">Body Weight</Label>
        <Select value={fonts.bodyWeight} onValueChange={(v) => updateFont("bodyWeight", v)}>
          <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A2E] border-white/10">
            {["300", "400", "500", "600"].map((w) => (
              <SelectItem key={w} value={w} className="text-slate-200 text-[11px] focus:bg-violet-500/20 focus:text-violet-200">
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] text-slate-400 mb-1 block">Mono Font</Label>
        <Select value={fonts.mono} onValueChange={(v) => updateFont("mono", v)}>
          <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A2E] border-white/10">
            {FONT_OPTIONS.filter((f) => f.value.includes("monospace") || f.value.includes("Mono") || f.value.includes("Code")).map((f) => (
              <SelectItem key={f.value} value={f.value} className="text-slate-200 text-[11px] focus:bg-violet-500/20 focus:text-violet-200">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ─── Effects Tab ───────────────────────────────────────────────────

function EffectsTab() {
  const { customization, setVisualStyle } = useEditorStore();
  const vs = customization.visualStyle;

  const update = useCallback(
    (key: keyof VisualStyleConfig, value: any) => {
      setVisualStyle({ ...vs, [key]: value });
    },
    [vs, setVisualStyle]
  );

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Visual Effects</p>

      {/* Glassmorphism */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] text-slate-300">Glassmorphism</Label>
          <Switch checked={vs.glassmorphism} onCheckedChange={(v) => update("glassmorphism", v)} />
        </div>
        {vs.glassmorphism && (
          <>
            <div>
              <Label className="text-[10px] text-slate-400 mb-1 block">Blur: {vs.glassBlur}px</Label>
              <Slider value={[vs.glassBlur]} onValueChange={([v]) => update("glassBlur", v)} min={4} max={30} step={2} className="py-1" />
            </div>
            <div>
              <Label className="text-[10px] text-slate-400 mb-1 block">Opacity: {vs.glassOpacity}</Label>
              <Slider value={[vs.glassOpacity * 100]} onValueChange={([v]) => update("glassOpacity", v / 100)} min={2} max={20} step={1} className="py-1" />
            </div>
          </>
        )}
      </div>

      {/* Shadow Level */}
      <div>
        <Label className="text-[11px] text-slate-300 mb-1.5 block">Shadow Level</Label>
        <div className="grid grid-cols-3 gap-1">
          {(["none", "sm", "md", "lg", "xl", "glow"] as const).map((level) => (
            <button
              key={level}
              onClick={() => update("shadowLevel", level)}
              className={cn(
                "py-1.5 rounded text-[10px] font-medium border transition-all",
                vs.shadowLevel === level
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Aurora Background */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] text-slate-300">Aurora Background</Label>
          <Switch checked={vs.auroraBackground} onCheckedChange={(v) => update("auroraBackground", v)} />
        </div>
        {vs.auroraBackground && (
          <div className="grid grid-cols-2 gap-2 pl-2 border-l border-white/10">
            <ColorInput label="Color 1" value={vs.auroraColors[0] || "#6366F1"} onChange={(v) => {
              const nc = [...vs.auroraColors]; nc[0] = v; update("auroraColors", nc);
            }} />
            <ColorInput label="Color 2" value={vs.auroraColors[1] || "#EC4899"} onChange={(v) => {
              const nc = [...vs.auroraColors]; nc[1] = v; update("auroraColors", nc);
            }} />
          </div>
        )}
      </div>

      {/* Mesh Gradient */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] text-slate-300">Mesh Gradient</Label>
          <Switch checked={vs.meshGradient} onCheckedChange={(v) => update("meshGradient", v)} />
        </div>
        {vs.meshGradient && (
          <div className="grid grid-cols-2 gap-2 pl-2 border-l border-white/10">
            <ColorInput label="Mesh 1" value={vs.meshColors[0] || customization.colors.primary} onChange={(v) => {
              const nc = [...vs.meshColors]; nc[0] = v; update("meshColors", nc);
            }} />
            <ColorInput label="Mesh 2" value={vs.meshColors[1] || customization.colors.accent} onChange={(v) => {
              const nc = [...vs.meshColors]; nc[1] = v; update("meshColors", nc);
            }} />
          </div>
        )}
      </div>

      {/* Spotlight Effect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] text-slate-300">Spotlight Cursor</Label>
          <Switch checked={vs.spotlightEffect} onCheckedChange={(v) => update("spotlightEffect", v)} />
        </div>
        {vs.spotlightEffect && (
          <ColorInput label="Spotlight Color" value={vs.spotlightColor} onChange={(v) => update("spotlightColor", v)} />
        )}
      </div>

      {/* Pattern Overlay */}
      <div>
        <Label className="text-[11px] text-slate-300 mb-1.5 block">Pattern Overlay</Label>
        <div className="grid grid-cols-3 gap-1">
          {(["none", "dots", "grid", "diagonal", "circles", "waves"] as const).map((p) => (
            <button
              key={p}
              onClick={() => update("patternOverlay", p)}
              className={cn(
                "py-1.5 rounded text-[10px] font-medium border transition-all capitalize",
                vs.patternOverlay === p
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Gradient Angle */}
      <div>
        <Label className="text-[10px] text-slate-400 mb-1 block">Gradient Angle: {vs.gradientAngle}°</Label>
        <Slider value={[vs.gradientAngle]} onValueChange={([v]) => update("gradientAngle", v)} min={0} max={360} step={15} className="py-1" />
      </div>
    </div>
  );
}

// ─── Animations Tab ────────────────────────────────────────────────

function AnimationsTab() {
  const { customization, setAnimation } = useEditorStore();
  const anim = customization.animation;

  const update = useCallback(
    (key: keyof AnimationProfile, value: any) => {
      setAnimation({ ...anim, [key]: value });
    },
    [anim, setAnimation]
  );

  const scrollTypes: { id: ScrollAnimation; label: string }[] = [
    { id: "fade-up", label: "Fade Up" },
    { id: "fade-in", label: "Fade In" },
    { id: "slide-left", label: "Slide Left" },
    { id: "slide-right", label: "Slide Right" },
    { id: "scale-up", label: "Scale Up" },
    { id: "flip", label: "Flip" },
    { id: "parallax", label: "Parallax" },
    { id: "blur-in", label: "Blur In" },
    { id: "typewriter", label: "Typewriter" },
  ];

  const hoverEffects: { id: HoverEffect; label: string }[] = [
    { id: "lift", label: "Lift" },
    { id: "scale", label: "Scale" },
    { id: "glow", label: "Glow" },
    { id: "border-glow", label: "Border Glow" },
    { id: "tilt", label: "Tilt" },
  ];

  const toggleHoverEffect = useCallback(
    (effect: HoverEffect) => {
      const current = anim.hoverEffects;
      const next = current.includes(effect)
        ? current.filter((e) => e !== effect)
        : [...current, effect];
      update("hoverEffects", next);
    },
    [anim.hoverEffects, update]
  );

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Animations</p>

      {/* Scroll Animation */}
      <div>
        <Label className="text-[11px] text-slate-300 mb-1.5 block">Scroll Animation</Label>
        <div className="grid grid-cols-3 gap-1">
          {scrollTypes.map((st) => (
            <button
              key={st.id}
              onClick={() => update("scrollType", st.id)}
              className={cn(
                "py-1.5 rounded text-[10px] font-medium border transition-all",
                anim.scrollType === st.id
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Threshold */}
      <div>
        <Label className="text-[10px] text-slate-400 mb-1 block">Trigger Threshold: {anim.scrollThreshold}</Label>
        <Slider value={[anim.scrollThreshold * 100]} onValueChange={([v]) => update("scrollThreshold", v / 100)} min={5} max={50} step={5} className="py-1" />
      </div>

      {/* Hover Effects */}
      <div>
        <Label className="text-[11px] text-slate-300 mb-1.5 block">Hover Effects</Label>
        <div className="flex flex-wrap gap-1">
          {hoverEffects.map((he) => (
            <button
              key={he.id}
              onClick={() => toggleHoverEffect(he.id)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all",
                anim.hoverEffects.includes(he.id)
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"
              )}
            >
              {he.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stagger Reveal */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] text-slate-300">Stagger Reveal</Label>
          <Switch checked={anim.staggerReveal} onCheckedChange={(v) => update("staggerReveal", v)} />
        </div>
        {anim.staggerReveal && (
          <div>
            <Label className="text-[10px] text-slate-400 mb-1 block">Stagger Delay: {anim.staggerIncrement}ms</Label>
            <Slider value={[anim.staggerIncrement]} onValueChange={([v]) => update("staggerIncrement", v)} min={20} max={200} step={20} className="py-1" />
          </div>
        )}
      </div>

      {/* Reduced Motion */}
      <div className="flex items-center justify-between">
        <Label className="text-[11px] text-slate-300">Reduced Motion</Label>
        <Switch checked={anim.reducedMotion} onCheckedChange={(v) => update("reducedMotion", v)} />
      </div>
    </div>
  );
}

// ─── Image Tab ─────────────────────────────────────────────────────

function ImageTab() {
  const {
    customization,
    setProfileImage,
    setImageShape,
    setImageSize,
    setProfileImageEffect,
    setProfileImageAnimation,
    setProfileImageCrop,
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cropScale = customization.profileImageCropScale ?? 1;
  const cropX = customization.profileImageCropX ?? 0;
  const cropY = customization.profileImageCropY ?? 0;
  const effect = customization.profileImageEffect ?? "none";
  const anim = customization.profileImageAnimation ?? "none";

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target?.result as string);
        setProfileImageCrop(1, 0, 0); // Reset crop on new upload
      };
      reader.readAsDataURL(file);
    },
    [setProfileImage, setProfileImageCrop]
  );

  const shapes: { id: ImageShape; label: string }[] = [
    { id: "circle", label: "Circle" },
    { id: "rounded", label: "Rounded" },
    { id: "square", label: "Square" },
  ];

  const sizes: { id: ImageSize; label: string }[] = [
    { id: "small", label: "Small" },
    { id: "medium", label: "Medium" },
    { id: "large", label: "Large" },
  ];

  const filterEffects = [
    { id: "none", label: "Normal" },
    { id: "grayscale", label: "B&W Noir" },
    { id: "sepia", label: "Warm Sepia" },
    { id: "vintage", label: "Retro Vintage" },
    { id: "duotone", label: "Cyber Duotone" },
    { id: "neon", label: "Neon Glow" },
  ];

  const hoverAnimations = [
    { id: "none", label: "No Animation" },
    { id: "float", label: "Smooth Floating" },
    { id: "spin", label: "Slow Spin" },
    { id: "pulse", label: "Pulse Glow" },
    { id: "tilt", label: "3D Pointer Tilt" },
  ];

  // Helper styles based on selected filter
  const getFilterStyle = (f: string) => {
    switch (f) {
      case "grayscale":
        return "grayscale";
      case "sepia":
        return "sepia";
      case "vintage":
        return "sepia-[0.5] hue-rotate-[-30deg] saturate-[1.4]";
      case "duotone":
        return "grayscale sepia-[0.3] hue-rotate-[280deg] saturate-[3] contrast-[1.2]";
      case "neon":
        return "shadow-[0_0_15px_rgba(139,92,246,0.6)] border-violet-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Profile Image</p>

      {/* Upload & Preview */}
      <div className="space-y-2">
        {customization.profileImage ? (
          <div className="relative border border-white/10 p-4 rounded-xl bg-white/[0.02]">
            <div className={cn(
              "w-28 h-28 mx-auto relative overflow-hidden bg-black/20",
              customization.imageShape === "circle" ? "rounded-full" : customization.imageShape === "rounded" ? "rounded-xl" : "rounded-none"
            )}>
              <img
                src={customization.profileImage}
                alt="Profile Preview"
                className={cn(
                  "w-full h-full object-cover origin-center transition-all duration-75",
                  getFilterStyle(effect)
                )}
                style={{
                  transform: `scale(${cropScale}) translate(${cropX}px, ${cropY}px)`,
                }}
              />
            </div>
            <button
              onClick={() => setProfileImage(null)}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center text-[10px] hover:bg-red-500"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/5 transition-all"
          >
            <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
            <p className="text-[11px] text-slate-400">Click to upload image</p>
            <p className="text-[9px] text-slate-500 mt-1">JPG, PNG, WebP</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      {customization.profileImage && (
        <>
          {/* Crop controls */}
          <div className="space-y-3 p-3 rounded-lg border border-white/5 bg-white/[0.01]">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Interactive Crop & Position</p>
            <div>
              <Label className="text-[10px] text-slate-400 mb-1 block">Zoom/Scale: {cropScale.toFixed(1)}x</Label>
              <Slider
                value={[cropScale * 10]}
                onValueChange={([v]) => setProfileImageCrop(v / 10, cropX, cropY)}
                min={10}
                max={30}
                step={1}
                className="py-1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-slate-400 mb-1 block">X Offset: {cropX}px</Label>
              <Slider
                value={[cropX + 100]}
                onValueChange={([v]) => setProfileImageCrop(cropScale, v - 100, cropY)}
                min={0}
                max={200}
                step={2}
                className="py-1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-slate-400 mb-1 block">Y Offset: {cropY}px</Label>
              <Slider
                value={[cropY + 100]}
                onValueChange={([v]) => setProfileImageCrop(cropScale, cropX, v - 100)}
                min={0}
                max={200}
                step={2}
                className="py-1"
              />
            </div>
          </div>

          {/* Filter Effects */}
          <div>
            <Label className="text-[11px] text-slate-300 mb-1 block">Visual Filter</Label>
            <Select value={effect} onValueChange={(v) => setProfileImageEffect(v)}>
              <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-white/10">
                {filterEffects.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-slate-200 text-[11px] focus:bg-violet-500/20 focus:text-violet-200">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Animations */}
          <div>
            <Label className="text-[11px] text-slate-300 mb-1 block">Image Animation / Effect</Label>
            <Select value={anim} onValueChange={(v) => setProfileImageAnimation(v)}>
              <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A2E] border-white/10">
                {hoverAnimations.map((ha) => (
                  <SelectItem key={ha.id} value={ha.id} className="text-slate-200 text-[11px] focus:bg-violet-500/20 focus:text-violet-200">
                    {ha.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Shape */}
      <div>
        <Label className="text-[11px] text-slate-300 mb-1.5 block">Image Shape</Label>
        <div className="grid grid-cols-3 gap-1">
          {shapes.map((s) => (
            <button
              key={s.id}
              onClick={() => setImageShape(s.id)}
              className={cn(
                "py-1.5 rounded text-[10px] font-medium border transition-all",
                customization.imageShape === s.id
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <Label className="text-[11px] text-slate-300 mb-1.5 block">Image Size</Label>
        <div className="grid grid-cols-3 gap-1">
          {sizes.map((s) => (
            <button
              key={s.id}
              onClick={() => setImageSize(s.id)}
              className={cn(
                "py-1.5 rounded text-[10px] font-medium border transition-all",
                customization.imageSize === s.id
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Styling Panel ────────────────────────────────────────────

export default function StylingPanel() {
  const { rightPanelTab, setRightPanelTab } = useEditorStore();

  const tabs = [
    { id: "colors" as const, icon: <Palette className="w-3.5 h-3.5" />, label: "Colors" },
    { id: "fonts" as const, icon: <Type className="w-3.5 h-3.5" />, label: "Fonts" },
    { id: "effects" as const, icon: <Sparkles className="w-3.5 h-3.5" />, label: "Effects" },
    { id: "animations" as const, icon: <Wand2 className="w-3.5 h-3.5" />, label: "Animate" },
    { id: "image" as const, icon: <ImageIcon className="w-3.5 h-3.5" />, label: "Image" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 px-1 pt-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRightPanelTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors border-b-2",
              rightPanelTab === tab.id
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
          {rightPanelTab === "colors" && <ColorsTab />}
          {rightPanelTab === "fonts" && <FontsTab />}
          {rightPanelTab === "effects" && <EffectsTab />}
          {rightPanelTab === "animations" && <AnimationsTab />}
          {rightPanelTab === "image" && <ImageTab />}
        </div>
      </ScrollArea>
    </div>
  );
}