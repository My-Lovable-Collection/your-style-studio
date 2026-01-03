import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";
import { usePatchPlacements } from "@/context/PatchPlacementContext";
import { X } from "lucide-react";

interface ProductFiltersProps {
  selectedCategories: string[];
  selectedPlacements: string[];
  onCategoryChange: (categories: string[]) => void;
  onPlacementChange: (placements: string[]) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  selectedCategories,
  selectedPlacements,
  onCategoryChange,
  onPlacementChange,
  onClearFilters,
}: ProductFiltersProps) {
  const { getAllPlacementLabels } = usePatchPlacements();
  const patchPlacements = getAllPlacementLabels();
  
  const hasActiveFilters =
    selectedCategories.length > 0 || selectedPlacements.length > 0;

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const togglePlacement = (placementId: string) => {
    if (selectedPlacements.includes(placementId)) {
      onPlacementChange(selectedPlacements.filter((p) => p !== placementId));
    } else {
      onPlacementChange([...selectedPlacements, placementId]);
    }
  };

  return (
    <aside className="w-full space-y-8 lg:w-64">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => {
              const category = categories.find((c) => c.id === cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                >
                  {category?.label}
                  <X className="h-3 w-3" />
                </button>
              );
            })}
            {selectedPlacements.map((placement) => {
              const place = patchPlacements.find((p) => p.id === placement);
              return (
                <button
                  key={placement}
                  onClick={() => togglePlacement(placement)}
                  className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  {place?.label}
                  <X className="h-3 w-3" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
          Category
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="flex-1 cursor-pointer text-sm"
              >
                {category.label}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({category.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Patch Placement Filter */}
      <div className="space-y-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
          Patch Placement
        </h3>
        <div className="space-y-3">
          {patchPlacements.map((placement) => (
            <div key={placement.id} className="flex items-center gap-3">
              <Checkbox
                id={`placement-${placement.id}`}
                checked={selectedPlacements.includes(placement.id)}
                onCheckedChange={() => togglePlacement(placement.id)}
              />
              <Label
                htmlFor={`placement-${placement.id}`}
                className="cursor-pointer text-sm"
              >
                {placement.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
