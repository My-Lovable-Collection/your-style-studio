import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />
          
          {/* Quick view button */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-foreground/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
            <span className="text-sm font-medium text-primary-foreground">
              View Details
            </span>
          </div>
          
          {/* Customizable badge */}
          {product.isCustomizable && (
            <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground shadow-gold">
              Customizable
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 space-y-1">
          <h3 className="font-display text-lg font-medium transition-colors group-hover:text-accent">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.patchPlacements.length} placement{product.patchPlacements.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
