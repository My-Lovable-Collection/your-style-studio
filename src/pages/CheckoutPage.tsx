import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CreditCard, Truck, MapPin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  if (!isAuthenticated) {
    navigate("/auth?redirect=/checkout");
    return null;
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const shippingCost = shippingMethod === "express" ? 19.99 : subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingForm.address && shippingForm.city && shippingForm.state && shippingForm.zip) {
      setStep("payment");
    } else {
      toast.error("Please fill in all shipping fields");
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    clearCart();
    setStep("confirmation");
    toast.success("Order placed successfully!");
  };

  if (step === "confirmation") {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent/20">
              <CheckCircle2 className="h-12 w-12 text-accent" />
            </div>
            <h1 className="font-display text-3xl font-bold">Order Confirmed!</h1>
            <p className="mt-4 text-muted-foreground">
              Thank you for your purchase, {user?.name}! You will receive a
              confirmation email shortly.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Order #: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
            <Button onClick={() => navigate("/products")} className="mt-8">
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="mt-8 flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                step === "shipping" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === "shipping" ? "bg-accent text-accent-foreground" : "bg-secondary"
                }`}
              >
                1
              </div>
              <span className="hidden text-sm font-medium sm:inline">Shipping</span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div
              className={`flex items-center gap-2 ${
                step === "payment" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === "payment" ? "bg-accent text-accent-foreground" : "bg-secondary"
                }`}
              >
                2
              </div>
              <span className="hidden text-sm font-medium sm:inline">Payment</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleShippingSubmit}
                className="space-y-6 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-xl font-semibold">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={shippingForm.address}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, address: e.target.value })
                      }
                      placeholder="123 Main St"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingForm.city}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, city: e.target.value })
                      }
                      placeholder="New York"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingForm.state}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, state: e.target.value })
                      }
                      placeholder="NY"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={shippingForm.zip}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, zip: e.target.value })
                      }
                      placeholder="10001"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingForm.country}
                      disabled
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-accent" />
                    <h2 className="font-display text-xl font-semibold">
                      Shipping Method
                    </h2>
                  </div>

                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="mt-4 space-y-3"
                  >
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <span className="font-medium">Standard Shipping</span>
                          <p className="text-sm text-muted-foreground">
                            5-7 business days
                          </p>
                        </Label>
                      </div>
                      <span className="font-medium">
                        {subtotal > 100 ? "Free" : "$9.99"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <span className="font-medium">Express Shipping</span>
                          <p className="text-sm text-muted-foreground">
                            2-3 business days
                          </p>
                        </Label>
                      </div>
                      <span className="font-medium">$19.99</span>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </motion.form>
            )}

            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-xl font-semibold">
                    Payment Details
                  </h2>
                </div>

                <div className="rounded-lg border border-border bg-secondary/30 p-6 text-center">
                  <p className="text-muted-foreground">
                    Payment integration will be connected with Stripe or PayPal.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For demo purposes, click "Place Order" to complete.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("shipping")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">
                Order Summary
              </h2>

              {/* Items Preview */}
              <div className="mt-6 max-h-48 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-border pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-accent">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
