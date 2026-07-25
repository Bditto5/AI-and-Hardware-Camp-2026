import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface NavMenuItem {
  key: string;
  label: string;
  meta?: string;
  onSelect: () => void;
}

interface NavMenuProps {
  label: string;
  active: boolean;
  items: NavMenuItem[];
  overviewLabel: string;
  onOverviewSelect: () => void;
}

interface PanelPosition {
  top: number;
  left: number;
}

export function NavMenu({ label, active, items, overviewLabel, onOverviewSelect }: NavMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const panelWidth = 260;
      const margin = 8;
      const left = Math.min(rect.left, window.innerWidth - panelWidth - margin);
      setPosition({ top: rect.bottom + 4, left: Math.max(margin, left) });
    }
    updatePosition();

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function handleClose() {
      setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, [open]);

  function selectItem(onSelect: () => void) {
    onSelect();
    setOpen(false);
  }

  return (
    <div className="nav-menu" ref={containerRef}>
      <button
        ref={triggerRef}
        className={active ? "active" : ""}
        aria-current={active ? "page" : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </button>
      {open && position &&
        createPortal(
          <div
            ref={panelRef}
            className="nav-menu-panel"
            role="menu"
            aria-label={`${label} menu`}
            style={{ position: "fixed", top: position.top, left: position.left }}
          >
            <button role="menuitem" className="nav-menu-overview" onClick={() => selectItem(onOverviewSelect)}>
              {overviewLabel}
            </button>
            <div className="nav-menu-items">
              {items.map((item) => (
                <button key={item.key} role="menuitem" onClick={() => selectItem(item.onSelect)}>
                  <span>{item.label}</span>
                  {item.meta && <small>{item.meta}</small>}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
