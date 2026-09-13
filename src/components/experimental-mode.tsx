"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Pencil, Download, Check, Trash2 } from "lucide-react";

/**
 * ExperimentalMode — Canva-style visual editor.
 *
 * Persists edit state across route changes via localStorage + custom event,
 * so navigating from /store to /login keeps edit mode active.
 *
 * Selected element gets:
 *   - 8 resize handles (4 corners + 4 sides)
 *   - Drag from middle = move
 *   - Pinch (two-finger) = uniform scale
 *   - Delete button to remove element
 *   - "EDIT TEXT" button for text elements
 *
 * Click handling:
 *   - ALL clicks inside .csmp-root disabled EXCEPT:
 *     [data-editable], .csmp-steve-logo, .csmp-toolbar
 */

const STORAGE_KEY = "csmp_edit_mode";

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

  // Read persisted edit state on mount (so navigation between routes keeps it)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY) === "1";
    if (saved) setEditMode(true);
  }, []);

  // Listen for cross-page edit-mode changes
  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setEditMode(e.newValue === "1");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggle = React.useCallback(() => {
    setEditMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      }
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
    // Clean up
    const editables = root.querySelectorAll("[contenteditable]");
    editables.forEach((el) => el.removeAttribute("contenteditable"));
    const selected = root.querySelectorAll(".csmp-selected, .csmp-text-editing");
    selected.forEach((el) => {
      el.classList.remove("csmp-selected");
      el.classList.remove("csmp-text-editing");
    });
    // Remove editor-injected handles
    root.querySelectorAll(".csmp-handle").forEach((el) => el.remove());

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
      if (target.closest(".csmp-toolbar") || target.closest(".csmp-editor-panel") || target.closest(".csmp-handle")) return;
      if (target.closest(".csmp-steve-logo")) return;

      const editable = target.closest("[data-editable]");
      if (editable) {
        e.preventDefault();
        e.stopPropagation();
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
    return () => document.removeEventListener("click", handler, true);
  }, [editMode]);

  // Body class toggle
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("csmp-editing-active", editMode);
  }, [editMode]);

  return (
    <ExperimentalContext.Provider value={{ editMode, toggle, exportHtml }}>
      <style>{`
        body.csmp-editing-active .csmp-root * {
          pointer-events: none;
        }
        body.csmp-editing-active .csmp-root [data-editable],
        body.csmp-editing-active .csmp-root .csmp-steve-logo,
        body.csmp-editing-active .csmp-toolbar,
        body.csmp-editing-active .csmp-toolbar *,
        body.csmp-editing-active .csmp-editor-panel,
        body.csmp-editing-active .csmp-editor-panel *,
        body.csmp-editing-active .csmp-handle,
        body.csmp-editing-active .csmp-handle * {
          pointer-events: auto;
        }
        body.csmp-editing-active [data-editable] {
          cursor: move;
          outline-offset: 2px;
        }
        body.csmp-editing-active [data-editable]:hover {
          outline: 2px dashed rgba(34,211,238,0.5);
        }
        body.csmp-editing-active .csmp-selected {
          outline: 2px solid #22D3EE !important;
          outline-offset: 0px;
        }
        body.csmp-editing-active .csmp-selected.csmp-text-editing {
          cursor: text;
        }
      `}</style>
      {children}
      {mounted && editMode && selectedEl && createPortal(
        <SelectionOverlay element={selectedEl} onDeselect={() => setSelectedEl(null)} />,
        document.body
      )}
    </ExperimentalContext.Provider>
  );
}

/**
 * SelectionOverlay — renders 8 resize handles + move/delete/text controls
 * around the selected element. Tracks element position via getBoundingClientRect
 * on every animation frame so it stays glued during scroll/resize.
 */
function SelectionOverlay({ element, onDeselect }: { element: HTMLElement; onDeselect: () => void }) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const [textEditing, setTextEditing] = React.useState(false);
  const [isText, setIsText] = React.useState(false);

  // Track element position
  React.useEffect(() => {
    let raf: number;
    const update = () => {
      setRect(element.getBoundingClientRect());
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, [element]);

  // Detect text vs image
  React.useEffect(() => {
    const editType = element.getAttribute("data-edit-type");
    const tag = element.tagName;
    setIsText(
      editType === "text" ||
      tag === "DIV" || tag === "SPAN" || tag === "H1" || tag === "H2" ||
      tag === "H3" || tag === "P" || tag === "A" || tag === "BUTTON"
    );
  }, [element]);

  // Drag-to-move (middle of element)
  React.useEffect(() => {
    if (textEditing) return;
    let dragging = false;
    let startX = 0, startY = 0;
    let startTX = 0, startTY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.target !== element) return;
      // Don't start drag if clicking a handle
      if ((e.target as HTMLElement).classList.contains("csmp-handle")) return;
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
    };

    const onMouseUp = () => { dragging = false; };

    element.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.target !== element) return;
      if ((e.target as HTMLElement).classList.contains("csmp-handle")) return;
      if (e.touches.length !== 1) return;
      dragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      const transform = element.style.transform || "";
      const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
      startTX = match ? parseFloat(match[1]) : 0;
      startTY = match ? parseFloat(match[2]) : 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging || e.touches.length !== 1) return;
      e.preventDefault();
      const newX = Math.round(startTX + (e.touches[0].clientX - startX));
      const newY = Math.round(startTY + (e.touches[0].clientY - startY));
      element.style.transform = `translate(${newX}px, ${newY}px)`;
    };
    const onTouchEnd = () => { dragging = false; };

    element.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      element.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [element, textEditing]);

  // Pinch-to-zoom (two fingers on element)
  React.useEffect(() => {
    let initialDist = 0;
    let initialScale = 1;

    const getScale = (el: HTMLElement) => {
      const t = el.style.transform || "";
      const m = t.match(/scale\(([\d.]+)\)/);
      return m ? parseFloat(m[1]) : 1;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      if (e.target !== element && !(e.target as HTMLElement).closest("[data-editable]") === element) {
        if (e.target !== element) return;
      }
      initialDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialScale = getScale(element);
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || initialDist === 0) return;
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = Math.max(0.2, Math.min(5, initialScale * (dist / initialDist)));
      // Merge with existing translate
      const t = element.style.transform || "";
      const translateMatch = t.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
      const tx = translateMatch ? translateMatch[1] : "0";
      const ty = translateMatch ? translateMatch[2] : "0";
      element.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };

    const onTouchEnd = () => { initialDist = 0; };

    element.addEventListener("touchstart", onTouchStart, { passive: false });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }, [element]);

  if (!rect) return null;

  // Handle resize logic
  const startResize = (e: React.MouseEvent | React.TouchEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    const point = "touches" in e ? e.touches[0] : e as React.MouseEvent;
    const startX = point.clientX;
    const startY = point.clientY;
    const startW = element.offsetWidth;
    const startH = element.offsetHeight;
    const transform = element.style.transform || "";
    const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
    const startTX = match ? parseFloat(match[1]) : 0;
    const startTY = match ? parseFloat(match[2]) : 0;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const p = "touches" in ev ? ev.touches[0] : ev as MouseEvent;
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      let newW = startW, newH = startH, newTX = startTX, newTY = startTY;

      if (handle.includes("e")) newW = Math.max(20, startW + dx);
      if (handle.includes("s")) newH = Math.max(20, startH + dy);
      if (handle.includes("w")) {
        newW = Math.max(20, startW - dx);
        newTX = startTX + dx;
      }
      if (handle.includes("n")) {
        newH = Math.max(20, startH - dy);
        newTY = startTY + dy;
      }

      element.style.width = `${newW}px`;
      element.style.height = `${newH}px`;
      element.style.transform = `translate(${newTX}px, ${newTY}px)`;
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove as any);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove as any);
      document.removeEventListener("touchend", onUp);
    };

    document.addEventListener("mousemove", onMove as any);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove as any, { passive: false });
    document.addEventListener("touchend", onUp);
  };

  const toggleTextEditing = () => {
    const next = !textEditing;
    setTextEditing(next);
    element.contentEditable = next ? "true" : "false";
    if (next) {
      element.classList.add("csmp-text-editing");
      element.focus();
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

  const deleteElement = () => {
    element.remove();
    onDeselect();
  };

  const close = () => {
    element.classList.remove("csmp-selected");
    element.contentEditable = "false";
    element.classList.remove("csmp-text-editing");
    onDeselect();
  };

  // Handle positions (relative to viewport)
  const handleSize = 12;
  const h = handleSize / 2;
  const handles = [
    { id: "nw", x: rect.left - h, y: rect.top - h, cursor: "nwse-resize" },
    { id: "n",  x: rect.left + rect.width / 2 - h, y: rect.top - h, cursor: "ns-resize" },
    { id: "ne", x: rect.right - h, y: rect.top - h, cursor: "nesw-resize" },
    { id: "e",  x: rect.right - h, y: rect.top + rect.height / 2 - h, cursor: "ew-resize" },
    { id: "se", x: rect.right - h, y: rect.bottom - h, cursor: "nwse-resize" },
    { id: "s",  x: rect.left + rect.width / 2 - h, y: rect.bottom - h, cursor: "ns-resize" },
    { id: "sw", x: rect.left - h, y: rect.bottom - h, cursor: "nesw-resize" },
    { id: "w",  x: rect.left - h, y: rect.top + rect.height / 2 - h, cursor: "ew-resize" },
  ];

  return (
    <>
      {/* Resize handles */}
      {handles.map((hdl) => (
        <div
          key={hdl.id}
          className="csmp-handle"
          onMouseDown={(e) => startResize(e, hdl.id)}
          onTouchStart={(e) => startResize(e, hdl.id)}
          style={{
            position: "fixed",
            left: hdl.x,
            top: hdl.y,
            width: handleSize,
            height: handleSize,
            background: "#fff",
            border: "2px solid #22D3EE",
            borderRadius: 3,
            cursor: hdl.cursor,
            zIndex: 10001,
            boxShadow: "0 0 6px rgba(34,211,238,0.6)",
            touchAction: "none",
          }}
        />
      ))}

      {/* Editor panel */}
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
        <button onClick={close} title="Deselect" style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 6,
          padding: "4px 6px",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          display: "flex",
        }}>
          <Check size={14} />
        </button>

        {/* Text editing toggle (only for text elements) */}
        {isText && (
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
            {textEditing ? <Check size={12} /> : <Pencil size={12} />}
            {textEditing ? "DONE" : "TEXT"}
          </button>
        )}

        {/* Delete button */}
        <button onClick={deleteElement} title="Delete element" style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(220,38,38,0.15)",
          border: "1px solid rgba(220,38,38,0.6)",
          borderRadius: 6,
          padding: "4px 8px",
          color: "#FCA5A5",
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "'Minecraft', monospace",
        }}>
          <Trash2 size={12} />
          DELETE
        </button>

        {/* Hint */}
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>
          {textEditing ? "TYPE TO EDIT TEXT" : "DRAG TO MOVE · PINCH TO ZOOM · HANDLES TO RESIZE"}
        </div>
      </div>
    </>
  );
}

export function ExperimentalToolbar() {
  const { editMode, toggle, exportHtml } = React.useContext(ExperimentalContext);
  return (
    <div className="csmp-toolbar" style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        onClick={toggle}
        aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
        title={editMode ? "Exit experimental edit mode" : "Experimental edit mode — click any element to select, drag to move, pinch to zoom, handles to resize"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: editMode ? "linear-gradient(135deg,#22D3EE,#0891B2)" : "rgba(34,211,238,0.12)",
          border: editMode ? "1px solid rgba(34,211,238,0.9)" : "1px solid rgba(34,211,238,0.4)",
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
