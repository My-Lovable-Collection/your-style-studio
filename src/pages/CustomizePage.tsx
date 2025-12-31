import { useState, useRef, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  X,
  Type,
  Image,
  RotateCcw,
  Save,
  Trash2,
  Bold,
  Italic,
  Plus,
  Minus,
  Box,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductById, patchPlacements } from "@/data/products";
import { CustomDesign } from "@/context/CartContext";
import { toast } from "sonner";
import ProductModel3D from "@/components/3d/ProductModel3D";

const fontFamilies = [
  { value: "Inter", label: "Inter" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier" },
];

const textColors = [
  "#000000",
  "#FFFFFF",
  "#B8860B",
  "#FF4444",
  "#4444FF",
  "#44AA44",
  "#AA44AA",
  "#FF8800",
];

export default function CustomizePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  

  const product = getProductById(id || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedPlacement, setSelectedPlacement] = useState(
    product?.patchPlacements[0] || ""
  );
  const [customText, setCustomText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textColor, setTextColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const [view3D, setView3D] = useState(true);

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

  const productPlacements = patchPlacements.filter((p) =>
    product.patchPlacements.includes(p.id as any)
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCustomText("");
    setFontSize(24);
    setFontFamily("Inter");
    setTextColor("#000000");
    setIsBold(false);
    setIsItalic(false);
    setUploadedImage(null);
    setRotation(0);
    setScale(100);
  };

  const handleSave = () => {
    toast.success("Design saved!", {
      description: "Your custom design has been saved successfully.",
    });
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header with Close Button */}
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Customize {product.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Add text, images, and adjust placement to create your unique design.
            </p>
          </motion.div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/products/${product.id}`)}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Preview Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
          <div className="sticky top-24">
              {/* 3D/2D Toggle */}
              <div className="mb-4 flex justify-end">
                <Button
                  variant={view3D ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView3D(!view3D)}
                  className="gap-2"
                >
                  <Box className="h-4 w-4" />
                  {view3D ? "3D View" : "2D View"}
                </Button>
              </div>
              
              <div className="aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed border-border bg-secondary">
                <div className="relative h-full w-full">
                  {view3D ? (
                    <Suspense
                      fallback={
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="text-muted-foreground">Loading 3D model...</div>
                        </div>
                      }
                    >
                      <ProductModel3D
                        productColor={product.colors[0] === "Black" ? "#1a1a1a" : product.colors[0] === "White" ? "#f5f5f5" : "#4a5568"}
                        customText={customText}
                        textColor={textColor}
                        fontSize={fontSize}
                        fontFamily={fontFamily}
                        isBold={isBold}
                        isItalic={isItalic}
                        uploadedImage={uploadedImage}
                        rotation={rotation}
                        scale={scale}
                      />
                    </Suspense>
                  ) : (
                    <>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />

                      {/* Overlay for customization preview */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-accent/30 bg-background/20 p-4 backdrop-blur-sm"
                          style={{
                            transform: `rotate(${rotation}deg) scale(${scale / 100})`,
                            transition: "transform 0.2s ease-out",
                          }}
                        >
                          {customText && (
                            <span
                              style={{
                                fontFamily,
                                fontSize: `${fontSize}px`,
                                color: textColor,
                                fontWeight: isBold ? "bold" : "normal",
                                fontStyle: isItalic ? "italic" : "normal",
                              }}
                              className="max-w-[200px] break-words text-center"
                            >
                              {customText}
                            </span>
                          )}

                          {uploadedImage && (
                            <img
                              src={uploadedImage}
                              alt="Custom upload"
                              className="mt-2 max-h-32 max-w-32 object-contain"
                            />
                          )}

                          {!customText && !uploadedImage && (
                            <span className="text-muted-foreground">
                              Your design preview
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            {/* Placement indicator */}
            <div className="mt-4 text-center">
              <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                Placement:{" "}
                {productPlacements.find((p) => p.id === selectedPlacement)
                  ?.label || "Select"}
              </span>
            </div>
          </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Placement Selection */}
            <div>
              <h3 className="mb-4 font-display text-lg font-semibold">
                Select Placement
              </h3>
              <div className="flex flex-wrap gap-2">
                {productPlacements.map((placement) => (
                  <button
                    key={placement.id}
                    onClick={() => setSelectedPlacement(placement.id)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm transition-all ${
                      selectedPlacement === placement.id
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    {placement.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Tabs */}
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="text" className="flex-1">
                  <Type className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="image" className="flex-1">
                  <Image className="mr-2 h-4 w-4" />
                  Image
                </TabsTrigger>
              </TabsList>

              {/* Text Tab */}
              <TabsContent value="text" className="space-y-6 pt-6">
                <div>
                  <Label htmlFor="customText">Your Text</Label>
                  <Input
                    id="customText"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter your text..."
                    className="mt-2"
                    maxLength={50}
                  />
                </div>

                <div>
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>
                            {font.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Font Size: {fontSize}px</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Slider
                      value={[fontSize]}
                      onValueChange={([v]) => setFontSize(v)}
                      min={12}
                      max={72}
                      step={1}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFontSize(Math.min(72, fontSize + 2))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${
                          textColor === color
                            ? "scale-110 border-accent ring-2 ring-accent/30"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isBold ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsBold(!isBold)}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={isItalic ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsItalic(!isItalic)}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Image Tab */}
              <TabsContent value="image" className="space-y-6 pt-6">
                <div>
                  <Label>Upload Image</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    {uploadedImage ? "Change Image" : "Choose Image"}
                  </Button>
                </div>

                {uploadedImage && (
                  <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="h-20 w-20 rounded object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedImage(null)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Transform Controls */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="font-display text-lg font-semibold">Transform</h3>

              <div>
                <Label>Rotation: {rotation}°</Label>
                <Slider
                  value={[rotation]}
                  onValueChange={([v]) => setRotation(v)}
                  min={-180}
                  max={180}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Scale: {scale}%</Label>
                <Slider
                  value={[scale]}
                  onValueChange={([v]) => setScale(v)}
                  min={50}
                  max={150}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 border-t border-border pt-6">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={!customText && !uploadedImage}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Design
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
