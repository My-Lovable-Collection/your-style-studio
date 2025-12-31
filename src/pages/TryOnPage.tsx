import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, CameraOff, Download, AlertTriangle, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/data/products";
import { toast } from "sonner";
import HumanModel3D from "@/components/3d/HumanModel3D";
export default function TryOnPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const product = getProductById(id || "");

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showModel, setShowModel] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      setShowModel(true); // Show 3D model when camera starts
    } catch (error: any) {
      console.error("Camera error:", error);
      if (error.name === "NotAllowedError") {
        setCameraError(
          "Camera access denied. Please enable camera permissions in your browser settings."
        );
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError("Unable to access camera. Please try again.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setShowModel(false);
  }, [stream]);

  const captureScreenshot = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Add product overlay
        if (product) {
          const img = new window.Image();
          img.src = product.image;
          img.onload = () => {
            const overlayWidth = canvas.width * 0.4;
            const overlayHeight = overlayWidth * (4 / 3);
            const x = (canvas.width - overlayWidth) / 2;
            const y = canvas.height * 0.2;
            
            ctx.globalAlpha = 0.8;
            ctx.drawImage(img, x, y, overlayWidth, overlayHeight);
            ctx.globalAlpha = 1;
            
            // Download
            const link = document.createElement("a");
            link.download = `tryon-${product.name.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            
            toast.success("Screenshot saved!");
          };
        }
      }
    }
  }, [product]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

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

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Live Try-On
          </h1>
          <p className="mt-2 text-muted-foreground">
            See how {product.name} looks on you using your camera.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Camera View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-border bg-secondary">
              {cameraActive && showModel ? (
                <div className="relative h-full w-full">
                  {/* Camera feed in small corner */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute bottom-4 right-4 z-10 h-32 w-44 rounded-lg border-2 border-accent object-cover shadow-lg"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  
                  {/* 3D Human Model with product */}
                  <Suspense
                    fallback={
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-muted-foreground">Loading 3D model...</div>
                      </div>
                    }
                  >
                    <HumanModel3D
                      productImage={product.image}
                      productColor={product.colors[0] === "Black" ? "#1a1a1a" : product.colors[0] === "White" ? "#f5f5f5" : "#4a5568"}
                    />
                  </Suspense>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  {cameraError ? (
                    <>
                      <AlertTriangle className="mb-4 h-16 w-16 text-destructive" />
                      <p className="text-destructive">{cameraError}</p>
                      <Button onClick={startCamera} className="mt-4">
                        Try Again
                      </Button>
                    </>
                  ) : (
                    <>
                      <Camera className="mb-4 h-16 w-16 text-muted-foreground" />
                      <p className="mb-4 text-muted-foreground">
                        Click the button below to activate your camera
                      </p>
                      <Button onClick={startCamera} size="lg">
                        <Camera className="mr-2 h-5 w-5" />
                        Start Camera
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            {cameraActive && (
              <div className="mt-4 flex justify-center gap-4">
                <Button variant="outline" onClick={stopCamera}>
                  <CameraOff className="mr-2 h-4 w-4" />
                  Stop Camera
                </Button>
                <Button onClick={captureScreenshot}>
                  <Download className="mr-2 h-4 w-4" />
                  Capture Screenshot
                </Button>
              </div>
            )}

            {/* Hidden canvas for screenshot */}
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="mt-4 font-display text-xl font-semibold">
                {product.name}
              </h2>
              <p className="mt-1 text-lg font-medium">${product.price.toFixed(2)}</p>

              <p className="mt-4 text-sm text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-6 space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/customize/${product.id}`)}
                >
                  Customize This Item
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-xl bg-accent/10 p-6"
        >
          <h3 className="font-display text-lg font-semibold">How it works</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                1
              </span>
              <p className="text-sm text-muted-foreground">
                Click "Start Camera" to activate your device camera
              </p>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                2
              </span>
              <p className="text-sm text-muted-foreground">
                View the product on a 3D model while your camera shows in the corner
              </p>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                3
              </span>
              <p className="text-sm text-muted-foreground">
                Capture a screenshot to save or share your look
              </p>
            </li>
          </ul>
        </motion.div>
      </div>
    </Layout>
  );
}
