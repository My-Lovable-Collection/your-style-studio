import tshirtWhite from "@/assets/products/tshirt-white.jpg";
import hoodieBlack from "@/assets/products/hoodie-black.jpg";
import capNavy from "@/assets/products/cap-navy.jpg";
import jacketOlive from "@/assets/products/jacket-olive.jpg";
import sweatshirtGray from "@/assets/products/sweatshirt-gray.jpg";
import tshirtBlack from "@/assets/products/tshirt-black.jpg";

export type PatchPlacement = "front-chest" | "back" | "left-sleeve" | "right-sleeve" | "front-center";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "t-shirt" | "hoodie" | "cap" | "jacket" | "sweatshirt";
  image: string;
  colors: string[];
  sizes: string[];
  patchPlacements: PatchPlacement[];
  material: string;
  isCustomizable: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Essential Cotton Tee",
    description: "Premium 100% organic cotton t-shirt with a relaxed fit. Perfect canvas for your custom designs with multiple placement options.",
    price: 45,
    category: "t-shirt",
    image: tshirtWhite,
    colors: ["White", "Black", "Gray", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    patchPlacements: ["front-chest", "back", "left-sleeve", "right-sleeve"],
    material: "100% Organic Cotton",
    isCustomizable: true,
  },
  {
    id: "2",
    name: "Urban Comfort Hoodie",
    description: "Heavyweight fleece hoodie with a cozy feel. Large back panel perfect for bold statement designs.",
    price: 89,
    category: "hoodie",
    image: hoodieBlack,
    colors: ["Black", "Charcoal", "Navy", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    patchPlacements: ["front-chest", "back", "left-sleeve"],
    material: "80% Cotton, 20% Polyester",
    isCustomizable: true,
  },
  {
    id: "3",
    name: "Classic Baseball Cap",
    description: "Structured six-panel cap with curved brim. Premium embroidery-ready front panel.",
    price: 32,
    category: "cap",
    image: capNavy,
    colors: ["Navy", "Black", "Khaki", "White"],
    sizes: ["One Size"],
    patchPlacements: ["front-center"],
    material: "100% Cotton Twill",
    isCustomizable: true,
  },
  {
    id: "4",
    name: "Heritage Bomber Jacket",
    description: "Classic bomber silhouette with modern details. Large back canvas for statement patches.",
    price: 165,
    category: "jacket",
    image: jacketOlive,
    colors: ["Olive", "Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    patchPlacements: ["back", "left-sleeve", "right-sleeve"],
    material: "Nylon Shell, Polyester Lining",
    isCustomizable: true,
  },
  {
    id: "5",
    name: "Minimalist Crewneck",
    description: "Soft French terry sweatshirt with a clean aesthetic. Subtle chest placement for understated designs.",
    price: 72,
    category: "sweatshirt",
    image: sweatshirtGray,
    colors: ["Gray", "Black", "Cream", "Sage"],
    sizes: ["XS", "S", "M", "L", "XL"],
    patchPlacements: ["front-chest", "back"],
    material: "100% Cotton French Terry",
    isCustomizable: true,
  },
  {
    id: "6",
    name: "Signature Black Tee",
    description: "Our bestselling black tee with superior dye retention. A wardrobe essential for any style.",
    price: 48,
    category: "t-shirt",
    image: tshirtBlack,
    colors: ["Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    patchPlacements: ["front-chest", "back", "left-sleeve", "right-sleeve", "front-center"],
    material: "100% Premium Cotton",
    isCustomizable: true,
  },
];

export const categories = [
  { id: "t-shirt", label: "T-Shirts", count: 2 },
  { id: "hoodie", label: "Hoodies", count: 1 },
  { id: "cap", label: "Caps", count: 1 },
  { id: "jacket", label: "Jackets", count: 1 },
  { id: "sweatshirt", label: "Sweatshirts", count: 1 },
];

export const patchPlacements = [
  { id: "front-chest", label: "Front Chest" },
  { id: "back", label: "Back" },
  { id: "left-sleeve", label: "Left Sleeve" },
  { id: "right-sleeve", label: "Right Sleeve" },
  { id: "front-center", label: "Front Center" },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function filterProducts(
  categoryFilter: string[],
  placementFilter: string[]
): Product[] {
  return products.filter((product) => {
    const categoryMatch =
      categoryFilter.length === 0 || categoryFilter.includes(product.category);
    const placementMatch =
      placementFilter.length === 0 ||
      placementFilter.some((p) => product.patchPlacements.includes(p as PatchPlacement));
    return categoryMatch && placementMatch;
  });
}
