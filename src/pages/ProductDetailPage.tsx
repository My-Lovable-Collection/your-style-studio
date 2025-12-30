import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Palette, Camera, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getProductById, patchPlacements } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = getProductById(id || "");

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");

  if (!product) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
          <h1 className="font-display text-2xl font-bold">Product not found</h1>
          <Button onClick={() => navigate("/products")} className="mt-4">
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity: 1,
      selectedColor,
      selectedSize,
      customDesigns: [],
    });
    toast.success("Added to cart!", {
      description: `${product.name} - ${selectedColor} - ${selectedSize}`,
    });
  };

  const productPlacements = patchPlacements.filter((p) =>
    product.patchPlacements.includes(p.id as any)
  );

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.isCustomizable && (
              <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-gold">
                Customizable
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {product.category}
              </span>
              <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="mt-6 text-muted-foreground">{product.description}</p>

            {/* Material */}
            <div className="mt-6">
              <span className="text-sm text-muted-foreground">
                Material: {product.material}
              </span>
            </div>

            {/* Color Selection */}
            <div className="mt-8">
              <h3 className="text-sm font-medium">Color</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm transition-all ${
                      selectedColor === color
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    {color}
                    {selectedColor === color && (
                      <Check className="ml-2 inline h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <h3 className="text-sm font-medium">Size</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Patch Placements */}
            <div className="mt-6">
              <h3 className="text-sm font-medium">Available Placements</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {productPlacements.map((placement) => (
                  <span
                    key={placement.id}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {placement.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/customize/${product.id}`)}
              >
                <Palette className="mr-2 h-5 w-5" />
                Customize
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(`/tryon/${product.id}`)}
              >
                <Camera className="mr-2 h-5 w-5" />
                Try On
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
