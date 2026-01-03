import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { usePatchPlacements } from "@/context/PatchPlacementContext";
import { ArrowLeft, Plus, Trash2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { placements, addPlacement, removePlacement } = usePatchPlacements();
  const { toast } = useToast();

  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Shield className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">Please sign in to access the admin panel.</p>
          <Button className="mt-6" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Shield className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Admin Access Required</h1>
          <p className="mt-2 text-muted-foreground">
            Only accounts with email starting with "admin" can access this page.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddPlacement = () => {
    setError("");
    const result = addPlacement(newId, newLabel);
    if (result.success) {
      toast({
        title: "Placement Added",
        description: `"${newLabel}" has been added successfully.`,
      });
      setNewId("");
      setNewLabel("");
    } else {
      setError(result.error || "Failed to add placement");
    }
  };

  const handleRemove = (id: string, label: string) => {
    removePlacement(id);
    toast({
      title: "Placement Removed",
      description: `"${label}" has been removed.`,
    });
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-accent" />
            <h1 className="font-display text-3xl font-semibold">Admin Panel</h1>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-xl font-medium mb-4">Patch Placements</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Manage available patch placement options for product customization.
            </p>

            {/* Add New Placement Form */}
            <div className="space-y-4 mb-8 p-4 rounded-md bg-muted/50">
              <h3 className="font-medium flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Placement
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="placement-id">ID (slug format)</Label>
                  <Input
                    id="placement-id"
                    placeholder="e.g., front-pocket"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placement-label">Display Label</Label>
                  <Input
                    id="placement-label"
                    placeholder="e.g., Front Pocket"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button onClick={handleAddPlacement} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Placement
              </Button>
            </div>

            {/* Existing Placements */}
            <div className="space-y-2">
              <h3 className="font-medium mb-3">Current Placements</h3>
              {placements.map((placement) => (
                <div
                  key={placement.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border bg-background"
                >
                  <div>
                    <span className="font-medium">{placement.label}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({placement.id})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(placement.id, placement.label)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
