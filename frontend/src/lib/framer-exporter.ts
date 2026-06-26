/**
 * Framer Exporter Utility
 * Extracts the rendered canvas HTML along with the document's active style tags,
 * generating a clean, self-contained HTML file suitable for copying into Framer.
 */

export function generateFramerExport(): string {
  const canvasEl = document.getElementById("editor-canvas-root");
  if (!canvasEl) {
    throw new Error("Canvas element not found");
  }

  // Clone the canvas element to avoid mutating the live editor view
  const clone = canvasEl.cloneNode(true) as HTMLElement;

  // Clean up editor-specific attributes, classes, and helper elements
  const editModeBadges = clone.querySelectorAll(".border-b.border-violet-500\\/20");
  editModeBadges.forEach(badge => badge.remove());

  const editableElements = clone.querySelectorAll("[contenteditable]");
  editableElements.forEach((el) => {
    el.removeAttribute("contenteditable");
    el.removeAttribute("data-field");
    el.classList.remove(
      "cursor-text",
      "hover:ring-1",
      "hover:ring-violet-400/50",
      "focus:ring-2",
      "focus:ring-violet-500/80",
      "focus:outline-none",
      "rounded",
      "editor-selected"
    );
  });

  const canvasHTML = clone.innerHTML;

  // Gather style tags and stylesheets from the current document
  const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
    .map((s) => s.outerHTML)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio - Framer Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  ${styles}
  <style>
    /* Reset margins and ensure full viewport compatibility */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: var(--color-bg, #ffffff);
    }
  </style>
</head>
<body>
  <div style="width: 100%; min-height: 100vh;">
    ${canvasHTML}
  </div>
</body>
</html>
`;
}
