import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-xl font-semibold">
              ATELIER
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Design your unique style. Premium customizable clothing for those who dare to be different.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">
              Shop
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/products?category=t-shirt"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=hoodie"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=jacket"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Jackets
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=cap"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Caps
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">
              Support
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Size Guide
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Shipping Info
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Returns
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Contact Us
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">
              Legal
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Atelier. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
