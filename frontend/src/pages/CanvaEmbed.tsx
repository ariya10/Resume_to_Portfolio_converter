import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PortfolioTemplateEditor from "@/components/editor/PortfolioTemplateEditor/PortfolioTemplateEditor";
import useEditorStore from "@/store/editor-store";

export default function CanvaEmbed() {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Expect state from TemplateGallery navigate
  const state = (location.state as any) || {};

  // Also allow passing a pre-encoded project via URL search param `project`
  const searchParams = new URLSearchParams(location.search);
  const urlProjectParam = searchParams.get('project');

  useEffect(() => {
    // If no selected template and no data and no URL project param, redirect back
    if (!state.selectedTemplateId && !state.parsedData && !urlProjectParam) {
      // nothing to load — send user back
      // small delay to allow UI to mount
      setTimeout(() => navigate("/templates"), 200);
      return;
    }

    // Nothing else to do here; iframe src is computed synchronously below with project param
    return;
  }, [state, navigate]);

  // Precompute the payload so we can both put it in the URL and postMessage it.
  let computedProjectPayload: any;
  try {
    if (urlProjectParam) {
      computedProjectPayload = JSON.parse(atob(urlProjectParam));
    } else if (state.projectTemplate) {
      const t = state.projectTemplate;
      const now = Date.now();
      computedProjectPayload = {
        version: '1.0',
        name: t.name || 'Template',
        elements: [
          {
            id: `text-${now}-1`,
            type: 'text',
            name: 'Title',
            x: 60,
            y: 60,
            width: 800,
            height: 80,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            zIndex: 1,
            timestamp: now,
            content: state.parsedData?.name || t.name || 'Your Name',
            fontFamily: t.defaultFonts?.heading || 'Inter',
            fontSize: 36,
            fontWeight: '700',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.2,
            letterSpacing: 0,
            fill: t.defaultColors?.primary || '#111827',
          },
          {
            id: `text-${now}-2`,
            type: 'text',
            name: 'Subtitle',
            x: 60,
            y: 160,
            width: 700,
            height: 60,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            zIndex: 2,
            timestamp: now,
            content: state.parsedData?.title || state.parsedData?.summary || t.description || '',
            fontFamily: t.defaultFonts?.body || 'Inter',
            fontSize: 18,
            fontWeight: '400',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left',
            lineHeight: 1.3,
            letterSpacing: 0,
            fill: t.defaultColors?.accent || '#374151',
          },
        ],
        canvas: {
          width: 1200,
          height: 800,
          background: t.background || '#ffffff',
          gridEnabled: false,
          gridSize: 20,
          gridColor: '#e5e7eb',
          snapToGrid: false,
          snapToObjects: true,
          snapThreshold: 6,
        },
        assets: [],
        metadata: { createdAt: now, lastModified: now },
      };
    } else {
      computedProjectPayload = {
        selectedTemplateId: state.selectedTemplateId,
        parsedData: state.parsedData,
        enhancedData: state.enhancedData,
        fileName: state.fileName,
      };
    }
  } catch (err) {
    computedProjectPayload = undefined;
  }

  const iframeSrc = (() => {
    try {
      const encoded = computedProjectPayload ? btoa(JSON.stringify(computedProjectPayload)) : undefined;
      // When developing locally the standalone canva-style editor runs in its own
      // Vite server (in `canva-editor/`) which uses port 3000 by default.
      const localDevEditor = (typeof window !== 'undefined') && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? `http://localhost:3000/editor${encoded ? `?project=${encoded}` : ''}`
        : `${encoded ? `/canva-editor/index.html?project=${encoded}` : '/canva-editor/index.html'}`;
      return localDevEditor;
    } catch (err) {
      return '/canva-editor/editor';
    }
  })();

  const setPortfolioData = useEditorStore((s) => s.setPortfolioData);

  useEffect(() => {
    if (computedProjectPayload && typeof setPortfolioData === 'function') {
      // If the payload looks like the full project with `portfolioData`, use that,
      // otherwise try to map the computed project into the editor's `portfolioData`.
      if (computedProjectPayload.portfolioData) {
        setPortfolioData(computedProjectPayload.portfolioData);
      } else if (computedProjectPayload.parsedData) {
        setPortfolioData(computedProjectPayload.parsedData);
      }
    }
  }, [computedProjectPayload, setPortfolioData]);

  // Render the internal PortfolioTemplateEditor which is website-focused
  // (Figma-like panels, layers, properties) instead of the image-oriented iframe.
  return (
    <div className="h-screen w-screen">
      <PortfolioTemplateEditor />
    </div>
  );
}

// Listen for ACK from iframe
if (typeof window !== 'undefined') {
  window.addEventListener('message', (e) => {
    try {
      const d = e.data;
      if (d && d.type === 'PROJECT_LOADED') {
        console.info('CanvaEmbed: editor reported project loaded', d.project);
      }
    } catch (err) {
      // Log the error so the block is not empty and to aid debugging
      // eslint-disable-next-line no-console
      console.debug('CanvaEmbed: message handler error', err);
    }
  });
}
