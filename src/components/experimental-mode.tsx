"use client";

import * as React from "react";
import { Pencil, Download, Check } from "lucide-react";

/**
 * ExperimentalMode
 *
 * Two-button toolbar that lives in the hero header:
 *   [✏ EDIT] [⬇ EXPORT]   ←  LEFT of Guest/login area
 *
 * When EDIT is active:
 *   - Every text element with `data-editable` becomes `contentEditable`
 *   - Hover shows a dashed cyan outline so users know what's editable
 *   - Click-to-focus, type to change the text live
 *
 * EXPORT:
 *   - Walks the DOM under `.csmp-root`
 *   - Serializes current outerHTML (with user edits baked in)
 *   - Downloads as `crazysmp-edited-<timestamp>.html`
 *
 * The <ExperimentalToolbar /> component reads from context, so it can be
 * placed anywhere inside <ExperimentalMode>...</ExperimentalMode>.
 */

type ExperimentalState = {
  editMode: boolean;
  toggle: () => void;
  exportHtml: () => void;
};

const ExperimentalContext = React.createContext<ExperimentalState>({
  editMode: false,
  toggle: () => {},
  exportHtml: () => {},
});

export function ExperimentalMode({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = React.useState(false);

  const toggle = React.useCallback(() => setEditMode((p) => !p), []);

  const exportHtml = React.useCallback(() => {
    if (typeof document === "undefined") return;
    const root = document.querySelector(".csmp-root");
    if (!root) {
      alert("Nothing to export — .csmp-root not found.");
      return;
    }
    // Force contentEditable=false before serializing so the attribute doesn't
    // leak into the exported HTML.
    const editables = root.querySelectorAll("[data-editable]");
    editables.forEach((el) => {
      (el as HTMLElement).removeAttribute("contenteditable");
      (el as HTMLElement).style.outline = "";
      (el as HTMLElement).style.cursor = "";
    });
    const html = root.outerHTML;
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const wrapped = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"/>
<title>CrazySMP Store — Edited ${ts}</title>
<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/minecraft-4"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"/>
<style>
  body { margin: 0; background: #141019; font-family: 'Minecraft', 'Inter', monospace; -webkit-font-smoothing: none; font-smooth: never; }
  * { box-sizing: border-box; }
</style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([wrapped], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crazysmp-edited-${ts}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Apply contentEditable to every [data-editable] element when editMode is on.
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const targets = document.querySelectorAll("[data-editable]");
    targets.forEach((el) => {
      (el as HTMLElement).contentEditable = editMode ? "true" : "false";
      if (editMode) {
        (el as HTMLElement).style.outline = "1px dashed rgba(34,211,238,0.4)";
        (el as HTMLElement).style.cursor = "text";
      } else {
        (el as HTMLElement).style.outline = "";
        (el as HTMLElement).style.cursor = "";
      }
    });
  }, [editMode]);

  // Toggle body class for hover CSS
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("csmp-editing-active", editMode);
  }, [editMode]);

  return (
    <ExperimentalContext.Provider value={{ editMode, toggle, exportHtml }}>
      <style>{`
        body.csmp-editing-active [data-editable]:hover {
          outline: 2px solid rgba(34,211,238,0.8) !important;
          background: rgba(34,211,238,0.05);
          border-radius: 4px;
        }
        body.csmp-editing-active [data-editable]:focus {
          outline: 2px solid #22D3EE !important;
          background: rgba(34,211,238,0.08);
        }
      `}</style>
      {children}
    </ExperimentalContext.Provider>
  );
}

export function ExperimentalToolbar() {
  const { editMode, toggle, exportHtml } = React.useContext(ExperimentalContext);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        onClick={toggle}
        aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
        title={editMode ? "Exit experimental edit mode" : "Experimental edit mode — click any text to edit"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: editMode
            ? "linear-gradient(135deg,#22D3EE,#0891B2)"
            : "rgba(34,211,238,0.12)",
          border: editMode
            ? "1px solid rgba(34,211,238,0.9)"
            : "1px solid rgba(34,211,238,0.4)",
          borderRadius: 8,
          padding: "8px 12px",
          color: editMode ? "#0a0812" : "#67E8F9",
          fontFamily: "'Minecraft', 'Inter', monospace",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: 0.5,
          cursor: "pointer",
          transition: "all 0.15s ease",
          boxShadow: editMode ? "0 0 12px rgba(34,211,238,0.5)" : "none",
        }}
      >
        {editMode ? <Check size={14} /> : <Pencil size={14} />}
        {editMode ? "DONE" : "EDIT"}
      </button>

      <button
        onClick={exportHtml}
        aria-label="Export edited HTML"
        title="Export current page as HTML with your edits baked in"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(168,85,247,0.15)",
          border: "1px solid rgba(168,85,247,0.5)",
          borderRadius: 8,
          padding: "8px 12px",
          color: "#E879F9",
          fontFamily: "'Minecraft', 'Inter', monospace",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: 0.5,
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        <Download size={14} />
        EXPORT
      </button>
    </div>
  );
}
