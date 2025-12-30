import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/auth?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">
              Start shopping to add items to your cart.
            </p>
            <Button onClick={() => navigate("/products")} className="mt-6">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
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
          Continue Shopping
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} item{items.length > 1 ? "s" : ""} in your cart
          </p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 md:gap-6 md:p-6"
                >
                  {/* Product Image */}
                  <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-secondary md:w-32">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-display text-lg font-semibold">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.selectedColor} / {item.selectedSize}
                        </p>
                        {item.customDesigns.length > 0 && (
                          <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                            Customized
                          </span>
                        )}
                      </div>
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              variant="ghost"
              onClick={clearCart}
              className="mt-4 text-muted-foreground"
            >
              Clear Cart
            </Button>
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

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-accent">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 100 && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleCheckout}
              >
                {isAuthenticated ? "Proceed to Checkout" : "Sign In to Checkout"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {!isAuthenticated && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  You need to be logged in to complete your purchase.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
