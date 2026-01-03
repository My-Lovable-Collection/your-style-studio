import React, { createContext, useContext, useState, ReactNode } from "react";

export interface PatchPlacementItem {
  id: string;
  label: string;
}

interface PatchPlacementContextType {
  placements: PatchPlacementItem[];
  addPlacement: (id: string, label: string) => { success: boolean; error?: string };
  removePlacement: (id: string) => void;
}

const defaultPlacements: PatchPlacementItem[] = [
  { id: "front-chest", label: "Front Chest" },
  { id: "back", label: "Back" },
  { id: "left-sleeve", label: "Left Sleeve" },
  { id: "right-sleeve", label: "Right Sleeve" },
  { id: "front-center", label: "Front Center" },
];

const PatchPlacementContext = createContext<PatchPlacementContextType | undefined>(undefined);

export function PatchPlacementProvider({ children }: { children: ReactNode }) {
  const [placements, setPlacements] = useState<PatchPlacementItem[]>(defaultPlacements);

  const addPlacement = (id: string, label: string): { success: boolean; error?: string } => {
    const trimmedId = id.trim().toLowerCase().replace(/\s+/g, "-");
    const trimmedLabel = label.trim();

    if (!trimmedId || !trimmedLabel) {
      return { success: false, error: "ID and label are required" };
    }

    if (trimmedId.length < 2 || trimmedId.length > 30) {
      return { success: false, error: "ID must be 2-30 characters" };
    }

    if (trimmedLabel.length < 2 || trimmedLabel.length > 50) {
      return { success: false, error: "Label must be 2-50 characters" };
    }

    if (!/^[a-z0-9-]+$/.test(trimmedId)) {
      return { success: false, error: "ID can only contain lowercase letters, numbers, and hyphens" };
    }

    if (placements.some((p) => p.id === trimmedId)) {
      return { success: false, error: "A placement with this ID already exists" };
    }

    setPlacements((prev) => [...prev, { id: trimmedId, label: trimmedLabel }]);
    return { success: true };
  };

  const removePlacement = (id: string) => {
    setPlacements((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PatchPlacementContext.Provider value={{ placements, addPlacement, removePlacement }}>
      {children}
    </PatchPlacementContext.Provider>
  );
}

export function usePatchPlacements() {
  const context = useContext(PatchPlacementContext);
  if (!context) {
    throw new Error("usePatchPlacements must be used within a PatchPlacementProvider");
  }
  return context;
}
