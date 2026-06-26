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
  zoom: number;
  selectedThemeId: string;
  selectedLayoutId: string;
  themeSearch: string;
  themeCategory: string;
  selectedSectionId?: string | null;
  selectedElementId?: string | null;

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
  setProfileImageEffect: (effect: any) => void;
  setProfileImageAnimation: (animation: any) => void;
  setProfileImageCrop: (scale: number, x: number, y: number) => void;
  moveSection: (oldIndex: number, newIndex: number) => void;
  toggleSectionVisibility: (id: string) => void;
  setSectionVariant: (section: string, variant: string) => void;
  toggleSectionLock: (id: string) => void;
  toggleSectionCollapse: (id: string) => void;
  setSectionCollapsed: (id: string, collapsed: boolean) => void;

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
  setZoom: (z: number) => void;
  setSelectedSectionId: (id?: string | null) => void;
  setSelectedElementId: (id?: string | null) => void;

  // History (undo/redo across both customization + portfolio)
  undo: () => void;
  redo: () => void;
  pushCustomizationHistoryDebounced: (customization: CustomizationOptions) => void;
}

const MAX_HISTORY = 50;
let customizationDebounceTimeout: any = null;

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
  zoom: 1,
  selectedThemeId: getDefaultCustomization().themeId,
  selectedLayoutId: "minimal",
  themeSearch: "",
  themeCategory: "all",
  selectedSectionId: null,
  selectedElementId: null,

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
  setColors: (colors) => {
    const c = { ...get().customization, colors };
    set({ customization: c });
    get().pushCustomizationHistoryDebounced(c);
  },
  setFonts: (fonts) => {
    const c = { ...get().customization, fonts };
    set({ customization: c });
    get().pushCustomizationHistoryDebounced(c);
  },
  setAnimation: (animation) => {
    const c = { ...get().customization, animation };
    set({ customization: c });
    get().pushCustomizationHistoryDebounced(c);
  },
  setVisualStyle: (visualStyle) => {
    const c = { ...get().customization, visualStyle };
    set({ customization: c });
    get().pushCustomizationHistoryDebounced(c);
  },
  setImageShape: (imageShape) => {
    const c = { ...get().customization, imageShape };
    set({ customization: c });
    get().pushCustomizationHistory(c);
  },
  setImageSize: (imageSize) => {
    const c = { ...get().customization, imageSize };
    set({ customization: c });
    get().pushCustomizationHistory(c);
  },
  setProfileImageEffect: (profileImageEffect) => {
    const c = { ...get().customization, profileImageEffect };
    set({ customization: c });
    get().pushCustomizationHistory(c);
  },
  setProfileImageAnimation: (profileImageAnimation) => {
    const c = { ...get().customization, profileImageAnimation };
    set({ customization: c });
    get().pushCustomizationHistory(c);
  },
  setProfileImageCrop: (scale, x, y) => {
    const c = {
      ...get().customization,
      profileImageCropScale: scale,
      profileImageCropX: x,
      profileImageCropY: y,
    };
    set({ customization: c });
    get().pushCustomizationHistoryDebounced(c);
  },
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
  toggleSectionLock: (id) => {
    const instances = get().customization.sectionInstances.map((s) =>
      s.id === id ? { ...s, locked: !s.locked } : s
    );
    get().setSectionInstances(instances);
  },
  toggleSectionCollapse: (id) => {
    const instances = get().customization.sectionInstances.map((s) =>
      s.id === id ? { ...s, collapsed: !s.collapsed } : s
    );
    get().setSectionInstances(instances);
  },
  setSectionCollapsed: (id, collapsed) => {
    const instances = get().customization.sectionInstances.map((s) =>
      s.id === id ? { ...s, collapsed } : s
    );
    get().setSectionInstances(instances);
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
  setZoom: (z) => set({ zoom: z }),
  setSelectedSectionId: (id = null) => set({ selectedSectionId: id }),
  setSelectedElementId: (id = null) => set({ selectedElementId: id }),

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

  pushCustomizationHistoryDebounced: (customization: CustomizationOptions) => {
    if (customizationDebounceTimeout) {
      clearTimeout(customizationDebounceTimeout);
    }
    customizationDebounceTimeout = setTimeout(() => {
      const { customizationHistory, customizationHistoryIndex } = get();
      const newHistory = customizationHistory.slice(0, customizationHistoryIndex + 1);
      newHistory.push(customization);

      const trimmed = newHistory.length > MAX_HISTORY ? newHistory.slice(newHistory.length - MAX_HISTORY) : newHistory;

      set({
        customizationHistory: trimmed,
        customizationHistoryIndex: trimmed.length - 1,
      });
      customizationDebounceTimeout = null;
    }, 450);
  },
}));

export default useEditorStore;
