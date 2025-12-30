import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { filterProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  const filteredProducts = filterProducts(selectedCategories, selectedPlacements);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPlacements([]);
    setSearchParams({});
  };

  const hasFilters = selectedCategories.length > 0 || selectedPlacements.length > 0;

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold md:text-5xl"
          >
            Shop Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-muted-foreground"
          >
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
          </motion.p>
        </div>

        <div className="flex gap-12">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <ProductFilters
              selectedCategories={selectedCategories}
              selectedPlacements={selectedPlacements}
              onCategoryChange={setSelectedCategories}
              onPlacementChange={setSelectedPlacements}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {hasFilters && (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                        {selectedCategories.length + selectedPlacements.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      selectedCategories={selectedCategories}
                      selectedPlacements={selectedPlacements}
                      onCategoryChange={setSelectedCategories}
                      onPlacementChange={setSelectedPlacements}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground"
                >
                  Clear all
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <p className="text-lg text-muted-foreground">
                  No products found for the selected filters.
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
