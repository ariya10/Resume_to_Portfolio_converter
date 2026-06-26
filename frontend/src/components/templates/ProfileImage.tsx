import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { CustomizationOptions } from "@/lib/portfolio-templates";
import { useEditorStore } from "@/store/editor-store";
import { Camera, ImagePlus } from "lucide-react";

interface ProfileImageProps {
  customization: CustomizationOptions;
  className?: string;
  sizeClassName?: string;
}

export function ProfileImage({ customization, className, sizeClassName }: ProfileImageProps) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const editMode = useEditorStore((s) => s.editMode);
  const setProfileImage = useEditorStore((s) => s.setProfileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If no profile image and not in editMode, we can't show anything
  if (!customization.profileImage && !editMode) return null;

  const shape = customization.imageShape ?? "circle";
  const size = customization.imageSize ?? "medium";
  const effect = customization.profileImageEffect ?? "none";
  const anim = customization.profileImageAnimation ?? "none";
  const scale = customization.profileImageCropScale ?? 1;
  const cropX = customization.profileImageCropX ?? 0;
  const cropY = customization.profileImageCropY ?? 0;

  // Filters mapping
  let filterClass = "";
  if (effect === "grayscale") filterClass = "grayscale";
  else if (effect === "sepia") filterClass = "sepia";
  else if (effect === "vintage") filterClass = "sepia-[0.5] hue-rotate-[-30deg] saturate-[1.4]";
  else if (effect === "duotone") filterClass = "grayscale sepia-[0.3] hue-rotate-[280deg] saturate-[3] contrast-[1.2]";
  else if (effect === "neon") filterClass = "ring-4 ring-offset-2 ring-offset-black shadow-[0_0_25px_var(--color-primary)] border-2";

  // Sizes mapping
  const sizeClass = sizeClassName || (
    size === "small" ? "w-24 h-24" :
    size === "large" ? "w-48 h-48 md:w-56 md:h-56" :
    "w-36 h-36 md:w-40 md:h-40"
  );

  // Shape mapping
  const shapeClass = 
    shape === "circle" ? "rounded-full" :
    shape === "rounded" ? "rounded-3xl" :
    "rounded-none";

  // Animations mapping
  let animClass = "";
  if (anim === "float") animClass = "animate-[bounce_4s_infinite]";
  else if (anim === "spin") animClass = "animate-[spin_30s_linear_infinite]";
  else if (anim === "pulse") animClass = "animate-[pulse_3s_infinite]";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (anim !== "tilt") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -12; // tilt max 12deg
    const tiltY = (x / (rect.width / 2)) * 12;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`,
      transition: "transform 0.1s ease",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.5s ease",
    });
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (editMode && fileInputRef.current) {
      e.stopPropagation();
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setProfileImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        "relative overflow-hidden bg-slate-200/20 border-2 border-dashed border-slate-300 dark:border-slate-700/80 select-none shrink-0 group transition-all duration-300",
        editMode && "cursor-pointer hover:border-violet-500 hover:shadow-lg hover:bg-slate-200/40 dark:hover:bg-slate-800/40",
        shapeClass,
        sizeClass,
        animClass,
        className
      )}
      style={{
        borderColor: customization.profileImage ? 'var(--color-primary)' : undefined,
        borderStyle: customization.profileImage ? 'solid' : 'dashed',
        ...tiltStyle,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {editMode && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      )}

      {customization.profileImage ? (
        <>
          <img
            src={customization.profileImage}
            alt="Profile"
            className={cn(
              "w-full h-full object-cover origin-center transition-all duration-75",
              filterClass
            )}
            style={{
              transform: `scale(${scale}) translate(${cropX}px, ${cropY}px)`,
            }}
          />
          {editMode && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none">
              <Camera className="w-5 h-5 text-white/90" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-white/90">Change Photo</span>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-400 dark:text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
          <ImagePlus className="w-6 h-6 mb-1 opacity-80" />
          <span className="text-[9px] font-bold text-center uppercase tracking-wider">Upload Profile</span>
        </div>
      )}
    </div>
  );
}

