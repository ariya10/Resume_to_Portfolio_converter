import { create } from "zustand";
import type { CustomizationOptions, SectionInstance, PortfolioData } from "@/lib/portfolio-templates";
import { getDefaultCustomization, THEME_PRESETS } from "@/lib/portfolio-templates";

interface EditorState {
  // Customization
  customization: CustomizationOptions & Record<string, any>;

  // Portfolio content (edited inline)
  portfolioData: PortfolioData;

  // UI
  fullscreenOpen: boolean;
  editMode: boolean;
  leftPanelTab: string;
  rightPanelTab: string;
  viewport: string;
  selectedThemeId: string;
  selectedLayoutId: string;
  themeSearch: string;
  themeCategory: string;

  // History
  customizationHistory: CustomizationOptions[];
  customizationHistoryIndex: number;

  portfolioHistory: PortfolioData[];
  portfolioHistoryIndex: number;
}

interface EditorActions {
  // Customization
  setSectionInstances: (instances: SectionInstance[]) => void;
  setProfileImage: (url: string | null) => void;
  setTheme: (id: string) => void;
  setLayout: (id: string) => void;
  setColors: (colors: any) => void;
  setFonts: (fonts: any) => void;
  setAnimation: (animation: any) => void;
  setVisualStyle: (visualStyle: any) => void;
  setImageShape: (shape: any) => void;
  setImageSize: (size: any) => void;
  moveSection: (oldIndex: number, newIndex: number) => void;
  toggleSectionVisibility: (id: string) => void;
  setSectionVariant: (section: string, variant: string) => void;

  // Portfolio content
  setPortfolioData: (data: PortfolioData) => void;
  pushPortfolioHistory: (data: PortfolioData) => void;

  // UI
  setFullscreenOpen: (open: boolean) => void;
  toggleEditMode: () => void;
  setEditMode: (on: boolean) => void;
  setLeftPanelTab: (tab: string) => void;
  setRightPanelTab: (tab: string) => void;
  setViewport: (viewport: string) => void;
  setThemeSearch: (search: string) => void;
  setThemeCategory: (category: string) => void;

  // History (undo/redo across both customization + portfolio)
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 50;

function getEmptyPortfolioData(): PortfolioData {
  return {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
    profileImage: null,
  };
}

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  // Initial state
  customization: getDefaultCustomization(),
  portfolioData: getEmptyPortfolioData(),

  fullscreenOpen: false,
  editMode: false,
  leftPanelTab: "templates",
  rightPanelTab: "colors",
  viewport: "desktop",
  selectedThemeId: getDefaultCustomization().themeId,
  selectedLayoutId: "minimal",
  themeSearch: "",
  themeCategory: "all",

  customizationHistory: [getDefaultCustomization()],
  customizationHistoryIndex: 0,

  portfolioHistory: [getEmptyPortfolioData()],
  portfolioHistoryIndex: 0,

  // Customization
  setSectionInstances: (sectionInstances) => {
    const c = { ...get().customization, sectionInstances };
    set({ customization: c });
    get().pushCustomizationHistory(c);
  },
  setProfileImage: (url) => {
    const c = { ...get().customization, profileImage: url };
    set({ customization: c });
    get().pushCustomizationHistory(c);
  },
  setTheme: (id) => {
    const theme = THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0];
    const c = {
      ...get().customization,
      themeId: id,
      colors: { ...theme.defaultColors },
    };
    set({ selectedThemeId: id, customization: c });
    get().pushCustomizationHistory(c);
  },
  setLayout: (id) => set({ selectedLayoutId: id }),
  setColors: (colors) => set((s) => ({ customization: { ...s.customization, colors } })),
  setFonts: (fonts) => set((s) => ({ customization: { ...s.customization, fonts } })),
  setAnimation: (animation) => set((s) => ({ customization: { ...s.customization, animation } })),
  setVisualStyle: (visualStyle) => set((s) => ({ customization: { ...s.customization, visualStyle } })),
  setImageShape: (imageShape) => set((s) => ({ customization: { ...s.customization, imageShape } })),
  setImageSize: (imageSize) => set((s) => ({ customization: { ...s.customization, imageSize } })),
  moveSection: (oldIndex, newIndex) => {
    const instances = [...get().customization.sectionInstances];
    const [moved] = instances.splice(oldIndex, 1);
    instances.splice(newIndex, 0, moved);
    get().setSectionInstances(instances);
  },
  toggleSectionVisibility: (id) => {
    const instances = get().customization.sectionInstances.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    get().setSectionInstances(instances);
  },
  setSectionVariant: (section, variant) => {
    const c = {
      ...get().customization,
      sectionVariants: { ...get().customization.sectionVariants, [section]: variant },
    };
    set({ customization: c });
  },

  // Portfolio content
  setPortfolioData: (data) => {
    set({ portfolioData: data });
    get().pushPortfolioHistory(data);
  },
  pushPortfolioHistory: (data) => {
    const { portfolioHistory, portfolioHistoryIndex } = get();
    const newHistory = portfolioHistory.slice(0, portfolioHistoryIndex + 1);
    newHistory.push(data);
    const trimmed = newHistory.length > MAX_HISTORY ? newHistory.slice(newHistory.length - MAX_HISTORY) : newHistory;

    set({
      portfolioHistory: trimmed,
      portfolioHistoryIndex: trimmed.length - 1,
    });
  },

  // UI
  setFullscreenOpen: (fullscreenOpen) => set({ fullscreenOpen }),
  toggleEditMode: () => set((s) => ({ editMode: !s.editMode })),
  setEditMode: (on) => set({ editMode: on }),
  setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setViewport: (viewport) => set({ viewport }),
  setThemeSearch: (search) => set({ themeSearch: search }),
  setThemeCategory: (category) => set({ themeCategory: category }),

  // History (undo/redo across both)
  undo: () => {
    const { customizationHistory, customizationHistoryIndex, portfolioHistory, portfolioHistoryIndex } = get();

    const nextCustIndex = customizationHistoryIndex > 0 ? customizationHistoryIndex - 1 : customizationHistoryIndex;
    const nextPortIndex = portfolioHistoryIndex > 0 ? portfolioHistoryIndex - 1 : portfolioHistoryIndex;

    if (nextCustIndex !== customizationHistoryIndex) {
      set({
        customization: { ...customizationHistory[nextCustIndex] },
        customizationHistoryIndex: nextCustIndex,
      });
    }

    if (nextPortIndex !== portfolioHistoryIndex) {
      set({
        portfolioData: { ...portfolioHistory[nextPortIndex] },
        portfolioHistoryIndex: nextPortIndex,
      });
    }
  },
  redo: () => {
    const { customizationHistory, customizationHistoryIndex, portfolioHistory, portfolioHistoryIndex } = get();

    const nextCustIndex =
      customizationHistoryIndex < customizationHistory.length - 1 ? customizationHistoryIndex + 1 : customizationHistoryIndex;
    const nextPortIndex =
      portfolioHistoryIndex < portfolioHistory.length - 1 ? portfolioHistoryIndex + 1 : portfolioHistoryIndex;

    if (nextCustIndex !== customizationHistoryIndex) {
      set({
        customization: { ...customizationHistory[nextCustIndex] },
        customizationHistoryIndex: nextCustIndex,
      });
    }

    if (nextPortIndex !== portfolioHistoryIndex) {
      set({
        portfolioData: { ...portfolioHistory[nextPortIndex] },
        portfolioHistoryIndex: nextPortIndex,
      });
    }
  },

  // helper (not in interface) for internal use
  pushCustomizationHistory: (customization: CustomizationOptions) => {
    const { customizationHistory, customizationHistoryIndex } = get();
    const newHistory = customizationHistory.slice(0, customizationHistoryIndex + 1);
    newHistory.push(customization);

    const trimmed = newHistory.length > MAX_HISTORY ? newHistory.slice(newHistory.length - MAX_HISTORY) : newHistory;

    set({
      customizationHistory: trimmed,
      customizationHistoryIndex: trimmed.length - 1,
    });
  },
}));

export default useEditorStore;
