
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  category_type: "income" | "expense" | "savings";
  is_default: boolean;
}

export const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "📦",
    color: "#3b82f6",
    category_type: "expense" as "income" | "expense" | "savings",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .order("name");

    if (!error && data) {
      setCategories(data);
    }
  };

  const saveCategory = async () => {
    if (!formData.name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const slug = formData.name.toLowerCase().replace(/\s+/g, "_");

      const categoryData = {
        name: formData.name,
        slug,
        icon: formData.icon,
        color: formData.color,
        category_type: formData.category_type,
        user_id: user.id,
        is_default: false,
      };

      if (editingId) {
        await supabase.from("categories").update(categoryData).eq("id", editingId);
        toast.success("Category updated");
      } else {
        await supabase.from("categories").insert(categoryData);
        toast.success("Category created");
      }

      setFormData({ name: "", icon: "📦", color: "#3b82f6", category_type: "expense" });
      setIsAdding(false);
      setEditingId(null);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    }
  };

  const deleteCategory = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error("Cannot delete default categories");
      return;
    }

    try {
      await supabase.from("categories").delete().eq("id", id);
      toast.success("Category deleted");
      loadCategories();
    } catch (error: any) {
      toast.error("Failed to delete category");
    }
  };

  const emojiOptions = ["📦", "🍔", "🏠", "🚗", "💼", "🎮", "🏥", "✈️", "🛒", "💰", "📚", "🎵"];

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Manage Categories
          </CardTitle>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3 animate-fade-in">
            <div>
              <Label>Category Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Groceries, Rent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.category_type}
                  onValueChange={(value: any) => setFormData({ ...formData, category_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emojiOptions.map((emoji) => (
                      <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveCategory} size="sm">Save</Button>
              <Button onClick={() => { setIsAdding(false); setEditingId(null); }} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-lg border flex items-center justify-between hover:bg-accent/50 transition-all"
              style={{ borderLeftColor: cat.color, borderLeftWidth: "4px" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{cat.category_type}</Badge>
                    {cat.is_default && <Badge variant="secondary" className="text-xs">Default</Badge>}
                  </div>
                </div>
              </div>
              {!cat.is_default && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => deleteCategory(cat.id, cat.is_default)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
