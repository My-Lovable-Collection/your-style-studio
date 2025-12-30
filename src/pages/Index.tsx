import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Camera, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/data/products";
import heroImage from "@/assets/hero-fashion.jpg";

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Fashion hero"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex min-h-[85vh] flex-col justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
            >
              Design Your Unique Style
            </motion.span>

            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Create Clothing
              <br />
              <span className="text-gradient-gold">That Speaks</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground md:text-xl">
              Premium customizable apparel with interactive design tools. 
              Add your text, images, and patches. See it live before you buy.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link to="/products">
                  Start Designing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">Browse Collection</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Your Design, Your Way
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From concept to creation, our platform gives you the tools to bring your vision to life.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Palette,
                title: "Customization Studio",
                description:
                  "Add text, images, and patches with our intuitive design tools. Move, resize, and rotate until it's perfect.",
              },
              {
                icon: Camera,
                title: "Live Try-On",
                description:
                  "Use your camera to see how your design looks on you in real-time before making a purchase.",
              },
              {
                icon: Sparkles,
                title: "Premium Quality",
                description:
                  "Only the finest materials and printing techniques ensure your custom designs last.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
              >
                <div className="mb-6 inline-flex rounded-xl bg-accent/10 p-3 text-accent">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Featured Collection
              </h2>
              <p className="mt-2 text-muted-foreground">
                Our most popular customizable pieces
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link to="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ready to Create Something Unique?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Join thousands of customers who have designed their perfect piece. Start customizing today.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8"
            >
              <Link to="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
