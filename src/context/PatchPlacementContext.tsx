import React, { createContext, useContext, useState, ReactNode } from "react";
import { products } from "@/data/products";

export interface PlacementOption {
  id: string;
  label: string;
  status: "draft" | "published";
}

export interface ProductPlacements {
  [productId: string]: PlacementOption[];
}

interface PatchPlacementContextType {
  getPlacementsForProduct: (productId: string) => PlacementOption[];
  getPublishedPlacementsForProduct: (productId: string) => PlacementOption[];
  addPlacement: (productId: string, id: string, label: string) => { success: boolean; error?: string };
  updatePlacement: (productId: string, placementId: string, updates: Partial<Pick<PlacementOption, "label" | "status">>) => { success: boolean; error?: string };
  removePlacement: (productId: string, placementId: string) => void;
  getAllPlacementLabels: () => { id: string; label: string }[];
}

// Initialize placements from static product data
const initializeProductPlacements = (): ProductPlacements => {
  const placements: ProductPlacements = {};
  products.forEach((product) => {
    placements[product.id] = product.patchPlacements.map((p) => ({
      id: p,
      label: getLabelForPlacement(p),
      status: "published" as const,
    }));
  });
  return placements;
};

const getLabelForPlacement = (id: string): string => {
  const labels: Record<string, string> = {
    "front-chest": "Front Chest",
    "back": "Back",
    "left-sleeve": "Left Sleeve",
    "right-sleeve": "Right Sleeve",
    "front-center": "Front Center",
  };
  return labels[id] || id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const PatchPlacementContext = createContext<PatchPlacementContextType | undefined>(undefined);

export function PatchPlacementProvider({ children }: { children: ReactNode }) {
  const [productPlacements, setProductPlacements] = useState<ProductPlacements>(initializeProductPlacements);

  const getPlacementsForProduct = (productId: string): PlacementOption[] => {
    return productPlacements[productId] || [];
  };

  const getPublishedPlacementsForProduct = (productId: string): PlacementOption[] => {
    return (productPlacements[productId] || []).filter(p => p.status === "published");
  };

  const addPlacement = (productId: string, id: string, label: string): { success: boolean; error?: string } => {
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

    const currentPlacements = productPlacements[productId] || [];
    if (currentPlacements.some((p) => p.id === trimmedId)) {
      return { success: false, error: "A placement with this ID already exists for this product" };
    }

    setProductPlacements((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), { id: trimmedId, label: trimmedLabel, status: "draft" }],
    }));
    return { success: true };
  };

  const updatePlacement = (
    productId: string,
    placementId: string,
    updates: Partial<Pick<PlacementOption, "label" | "status">>
  ): { success: boolean; error?: string } => {
    const currentPlacements = productPlacements[productId] || [];
    const placementIndex = currentPlacements.findIndex(p => p.id === placementId);
    
    if (placementIndex === -1) {
      return { success: false, error: "Placement not found" };
    }

    if (updates.label !== undefined) {
      const trimmedLabel = updates.label.trim();
      if (trimmedLabel.length < 2 || trimmedLabel.length > 50) {
        return { success: false, error: "Label must be 2-50 characters" };
      }
    }

    setProductPlacements((prev) => ({
      ...prev,
      [productId]: prev[productId].map((p) =>
        p.id === placementId ? { ...p, ...updates } : p
      ),
    }));
    return { success: true };
  };

  const removePlacement = (productId: string, placementId: string) => {
    setProductPlacements((prev) => ({
      ...prev,
      [productId]: (prev[productId] || []).filter((p) => p.id !== placementId),
    }));
  };

  const getAllPlacementLabels = (): { id: string; label: string }[] => {
    const allPlacements = new Map<string, string>();
    Object.values(productPlacements).forEach((placements) => {
      placements.forEach((p) => {
        if (!allPlacements.has(p.id)) {
          allPlacements.set(p.id, p.label);
        }
      });
    });
    return Array.from(allPlacements.entries()).map(([id, label]) => ({ id, label }));
  };

  return (
    <PatchPlacementContext.Provider
      value={{
        getPlacementsForProduct,
        getPublishedPlacementsForProduct,
        addPlacement,
        updatePlacement,
        removePlacement,
        getAllPlacementLabels,
      }}
    >
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
