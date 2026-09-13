"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Pencil, Download, Check, X, Type, Move, Image as ImageIcon } from "lucide-react";

/**
 * ExperimentalMode — full visual editor for the CrazySMP store page.
 *
 * When EDIT is active:
 *   - ALL clicks inside .csmp-root are disabled EXCEPT:
 *     - [data-editable] elements (selectable + editable)
 *     - .csmp-steve-logo (navigates to /login)
 *     - .csmp-toolbar (the EDIT/EXPORT buttons themselves)
 *   - Click any [data-editable] element to SELECT it
 *   - Selected element shows cyan outline + EditorPanel at bottom of screen
 *   - DRAG selected element to move (transform: translate)
 *   - EditorPanel controls: Position X/Y, Size W/H
 *   - For text: Font Size, Color, "EDIT TEXT" toggle (contentEditable)
 *   - For images: Width/Height controls
 *
 * EXPORT serializes .csmp-root.outerHTML with all inline style overrides
 * baked in, downloads as crazysmp-edited-<timestamp>.html.
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
  const [selectedEl, setSelectedEl] = React.useState<HTMLElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const toggle = React.useCallback(() => {
    setEditMode((p) => {
      const next = !p;
      if (!next) {
        document.querySelectorAll(".csmp-selected").forEach((el) => {
          el.classList.remove("csmp-selected");
          (el as HTMLElement).contentEditable = "false";
          el.classList.remove("csmp-text-editing");
        });
        setSelectedEl(null);
      }
      return next;
    });
  }, []);

  const exportHtml = React.useCallback(() => {
    if (typeof document === "undefined") return;
    const root = document.querySelector(".csmp-root");
    if (!root) {
      alert("Nothing to export — .csmp-root not found.");
      return;
    }
    // Clean up editable state before serializing
    const editables = root.querySelectorAll("[contenteditable]");
    editables.forEach((el) => el.removeAttribute("contenteditable"));
    const selected = root.querySelectorAll(".csmp-selected, .csmp-text-editing");
    selected.forEach((el) => {
      el.classList.remove("csmp-selected");
      el.classList.remove("csmp-text-editing");
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"/>
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

  // Click handler — select editable elements
  React.useEffect(() => {
    if (!editMode || typeof document === "undefined") return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip toolbar, editor panel, and Steve logo
      if (target.closest(".csmp-toolbar") || target.closest(".csmp-editor-panel")) return;
      if (target.closest(".csmp-steve-logo")) return;

      const editable = target.closest("[data-editable]");
      if (editable) {
        e.preventDefault();
        e.stopPropagation();
        // Clear previous selection
        document.querySelectorAll(".csmp-selected").forEach((el) => {
          el.classList.remove("csmp-selected");
          (el as HTMLElement).contentEditable = "false";
          el.classList.remove("csmp-text-editing");
        });
        (editable as HTMLElement).classList.add("csmp-selected");
        setSelectedEl(editable as HTMLElement);
      } else {
        document.querySelectorAll(".csmp-selected").forEach((el) => {
          el.classList.remove("csmp-selected");
          (el as HTMLElement).contentEditable = "false";
          el.classList.remove("csmp-text-editing");
        });
        setSelectedEl(null);
      }
    };

    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler, true);
    };
  }, [editMode]);

  // Toggle body class
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("csmp-editing-active", editMode);
  }, [editMode]);

  return (
    <ExperimentalContext.Provider value={{ editMode, toggle, exportHtml }}>
      <style>{`
        /* Disable ALL interactions inside .csmp-root when editing */
        body.csmp-editing-active .csmp-root * {
          pointer-events: none;
        }
        /* Re-enable: editable elements, Steve logo, toolbar */
        body.csmp-editing-active .csmp-root [data-editable],
        body.csmp-editing-active .csmp-root .csmp-steve-logo,
        body.csmp-editing-active .csmp-toolbar,
        body.csmp-editing-active .csmp-toolbar * {
          pointer-events: auto;
        }
        /* Visual feedback on editable elements */
        body.csmp-editing-active [data-editable] {
          cursor: move;
          outline-offset: 2px;
          transition: outline 0.1s ease;
        }
        body.csmp-editing-active [data-editable]:hover {
          outline: 2px dashed rgba(34,211,238,0.5);
        }
        body.csmp-editing-active .csmp-selected {
          outline: 2px solid #22D3EE !important;
          outline-offset: 2px;
        }
        body.csmp-editing-active .csmp-selected.csmp-text-editing {
          cursor: text;
        }
      `}</style>
      {children}
      {mounted && editMode && selectedEl && createPortal(
        <EditorPanel element={selectedEl} onDeselect={() => setSelectedEl(null)} />,
        document.body
      )}
    </ExperimentalContext.Provider>
  );
}

function EditorPanel({ element, onDeselect }: { element: HTMLElement; onDeselect: () => void }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [fontSize, setFontSize] = React.useState(16);
  const [color, setColor] = React.useState("#ffffff");
  const [isText, setIsText] = React.useState(false);
  const [textEditing, setTextEditing] = React.useState(false);

  // Initialize from element
  React.useEffect(() => {
    const computed = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const transform = element.style.transform || "";
    const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
    const tx = match ? parseFloat(match[1]) : 0;
    const ty = match ? parseFloat(match[2]) : 0;

    setPos({ x: Math.round(tx), y: Math.round(ty) });
    setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    setFontSize(parseInt(computed.fontSize) || 16);
    setColor(rgbToHex(computed.color));

    const editType = element.getAttribute("data-edit-type");
    const tag = element.tagName;
    setIsText(
      editType === "text" ||
      tag === "DIV" || tag === "SPAN" || tag === "H1" || tag === "H2" ||
      tag === "H3" || tag === "P" || tag === "A" || tag === "BUTTON"
    );
  }, [element]);

  // Drag-to-move (disabled when text editing is active)
  React.useEffect(() => {
    if (textEditing) return;

    let dragging = false;
    let startX = 0, startY = 0;
    let startTX = 0, startTY = 0;

    const onMouseDown = (e: MouseEvent) => {
      // Only start drag if clicking on the selected element itself
      if (e.target !== element && !(e.target as HTMLElement).closest("[data-editable] === element")) {
        // check if target IS the element
        if (e.target !== element) return;
      }
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const transform = element.style.transform || "";
      const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
      startTX = match ? parseFloat(match[1]) : 0;
      startTY = match ? parseFloat(match[2]) : 0;
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const newX = Math.round(startTX + (e.clientX - startX));
      const newY = Math.round(startTY + (e.clientY - startY));
      element.style.transform = `translate(${newX}px, ${newY}px)`;
      setPos({ x: newX, y: newY });
    };

    const onMouseUp = () => { dragging = false; };

    element.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [element, textEditing]);

  const updatePos = (axis: "x" | "y", value: number) => {
    const newPos = { ...pos, [axis]: value };
    setPos(newPos);
    element.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
  };

  const updateSize = (dim: "w" | "h", value: number) => {
    const newSize = { ...size, [dim]: value };
    setSize(newSize);
    if (dim === "w") element.style.width = `${value}px`;
    else element.style.height = `${value}px`;
  };

  const updateFontSize = (value: number) => {
    setFontSize(value);
    element.style.fontSize = `${value}px`;
  };

  const updateColor = (value: string) => {
    setColor(value);
    element.style.color = value;
  };

  const toggleTextEditing = () => {
    const next = !textEditing;
    setTextEditing(next);
    element.contentEditable = next ? "true" : "false";
    if (next) {
      element.classList.add("csmp-text-editing");
      element.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else {
      element.classList.remove("csmp-text-editing");
      element.blur();
    }
  };

  const close = () => {
    element.classList.remove("csmp-selected");
    element.contentEditable = "false";
    element.classList.remove("csmp-text-editing");
    onDeselect();
  };

  const inputStyle: React.CSSProperties = {
    width: 48,
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(34,211,238,0.3)",
    borderRadius: 4,
    padding: "3px 5px",
    color: "#fff",
    fontSize: 12,
    fontFamily: "monospace",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    color: "#67E8F9",
    fontWeight: 700,
    fontFamily: "'Minecraft', monospace",
  };

  return (
    <div className="csmp-editor-panel" style={{
      position: "fixed",
      bottom: 16,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(15,10,22,0.97)",
      border: "1px solid rgba(34,211,238,0.4)",
      borderRadius: 12,
      padding: "8px 12px",
      display: "flex",
      gap: 8,
      alignItems: "center",
      zIndex: 10000,
      backdropFilter: "blur(12px)",
      maxWidth: "95vw",
      flexWrap: "wrap",
      fontFamily: "'Minecraft', 'Inter', monospace",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      {/* Close button */}
      <button onClick={close} title="Deselect" style={{
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 6,
        padding: "4px 6px",
        color: "rgba(255,255,255,0.6)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}>
        <X size={14} />
      </button>

      {/* Element type indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 4px" }}>
        {isText ? <Type size={14} style={{ color: "#67E8F9" }} /> : <ImageIcon size={14} style={{ color: "#E879F9" }} />}
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
          {isText ? "TEXT" : "IMAGE"}
        </span>
      </div>

      {/* Position */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <span style={labelStyle}>X</span>
        <input type="number" value={pos.x} onChange={(e) => updatePos("x", parseInt(e.target.value) || 0)} style={inputStyle} />
        <span style={labelStyle}>Y</span>
        <input type="number" value={pos.y} onChange={(e) => updatePos("y", parseInt(e.target.value) || 0)} style={inputStyle} />
      </div>

      {/* Size */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <span style={labelStyle}>W</span>
        <input type="number" value={size.w} onChange={(e) => updateSize("w", parseInt(e.target.value) || 0)} style={inputStyle} />
        <span style={labelStyle}>H</span>
        <input type="number" value={size.h} onChange={(e) => updateSize("h", parseInt(e.target.value) || 0)} style={inputStyle} />
      </div>

      {/* Text-specific controls */}
      {isText && (
        <>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <span style={labelStyle}>SIZE</span>
            <input type="number" value={fontSize} onChange={(e) => updateFontSize(parseInt(e.target.value) || 16)} style={{ ...inputStyle, width: 38 }} />
          </div>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <span style={labelStyle}>COLOR</span>
            <input type="color" value={color} onChange={(e) => updateColor(e.target.value)} style={{ width: 28, height: 24, border: "none", borderRadius: 4, cursor: "pointer", background: "none" }} />
          </div>
          <button onClick={toggleTextEditing} title="Toggle text editing" style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: textEditing ? "linear-gradient(135deg,#22D3EE,#0891B2)" : "rgba(34,211,238,0.12)",
            border: textEditing ? "1px solid rgba(34,211,238,0.9)" : "1px solid rgba(34,211,238,0.4)",
            borderRadius: 6,
            padding: "4px 8px",
            color: textEditing ? "#0a0812" : "#67E8F9",
            cursor: "pointer",
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "'Minecraft', monospace",
          }}>
            {textEditing ? <Check size={12} /> : <Type size={12} />}
            {textEditing ? "DONE" : "TEXT"}
          </button>
        </>
      )}

      {/* Drag hint */}
      {!textEditing && (
        <div style={{ display: "flex", alignItems: "center", gap: 3, color: "rgba(255,255,255,0.3)", fontSize: 9 }}>
          <Move size={11} /> DRAG TO MOVE
        </div>
      )}
    </div>
  );
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return "#ffffff";
  return "#" + match.slice(0, 3).map((n) => parseInt(n).toString(16).padStart(2, "0")).join("");
}

export function ExperimentalToolbar() {
  const { editMode, toggle, exportHtml } = React.useContext(ExperimentalContext);
  return (
    <div className="csmp-toolbar" style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        onClick={toggle}
        aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
        title={editMode ? "Exit experimental edit mode" : "Experimental edit mode — click any element to select, drag to move, use panel to resize"}
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
