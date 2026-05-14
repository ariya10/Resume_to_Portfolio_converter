# Canva-like Inline Editing & Drag-to-Reposition

## Design
- Edit mode toggle (pencil icon) in preview toolbar
- When ON: text elements get dashed hover outlines, click to edit inline (contentEditable)
- When ON: sections get grip-dot drag handles, drag to reorder with drop indicators
- postMessage iframe↔parent communication for syncing changes back to store
- Visual feedback: dashed outlines, drag handles, smooth transitions, "editing" indicator badge

## Development Tasks
- [x] Add editMode state and actions to editor-store.ts
- [x] Create edit-mode injection script/CSS in template-renderer.ts (generatePortfolioHTML)
- [ ] Update PortfolioPreview.tsx with postMessage listener, edit mode toggle, sync
- [ ] Update Builder.tsx with edit mode toggle button in toolbar
- [ ] Run lint and build, fix any errors