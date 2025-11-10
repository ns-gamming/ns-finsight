import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Category { id: string; name: string; color?: string; icon?: string; category_type?: string }
interface Member { id: string; name: string; is_alive: boolean }

export const AddTransactionDialog = ({ open, onOpenChange, onSuccess }: AddTransactionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<{
    merchant: string;
    notes: string;
    averageAmount: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    currency: "INR",
    merchant: "",
    notes: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    category_id: "",
    family_member_id: "",
    payment_source: "",
  });

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'USDT': return '₮';
      case 'INR': default: return '₹';
    }
  };

  // Filter categories based on category_type, fallback to showing all if none match
  const filteredCategories = categories.filter(cat => {
    if (!cat.category_type) return false;
    return cat.category_type === formData.type;
  });
  
  // If no categories match the type, show all categories as fallback
  const displayCategories = filteredCategories.length > 0 ? filteredCategories : categories;

  useEffect(() => {
    const load = async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;
      const [{ data: cats }, { data: mems }] = await Promise.all([
        supabase.from("categories").select("id, name, color, icon, category_type").or(`user_id.eq.${userId},user_id.is.null`),
        supabase.from("family_members").select("id, name, is_alive").eq("user_id", userId),
      ]);
      setCategories(cats || []);
      setMembers((mems || []).filter(m => m.is_alive));
    };
    if (open) load();
  }, [open]);

  // Fetch AI suggestions when category changes
  useEffect(() => {
    if (formData.category_id && formData.category_id !== "") {
      fetchAiSuggestions();
    }
  }, [formData.category_id]);

  const fetchAiSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-suggest-transaction", {
        body: { categoryId: formData.category_id },
      });

      if (error) throw error;
      setAiSuggestions(data);
      
      // Auto-fill if fields are empty and user preferences allow (opt-in)
      const userPrefsOptIn = true; // Can be fetched from user preferences
      if (userPrefsOptIn) {
        if (data.merchant && !formData.merchant) {
          setFormData((prev) => ({ ...prev, merchant: data.merchant }));
          toast.success("AI suggested merchant filled!", { duration: 2000 });
        }
        if (data.notes && !formData.notes) {
          setFormData((prev) => ({ ...prev, notes: data.notes }));
        }
        if (data.averageAmount && !formData.amount) {
          setFormData((prev) => ({ ...prev, amount: data.averageAmount.toString() }));
        }
      }
    } catch (error: any) {
      console.error("AI suggestions error:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const amountNum = parseFloat(formData.amount);
    if (!amountNum || amountNum <= 0 || isNaN(amountNum)) {
      toast.error("Please enter a valid amount greater than zero");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("transactions", {
        body: {
          type: formData.type,
          amount: amountNum,
          merchant: formData.merchant || "Unknown",
          notes: formData.notes || null,
          description: formData.description || null,
          currency: formData.currency,
          timestamp: new Date(formData.date).toISOString(),
          category_id: formData.category_id || null,
          family_member_id: formData.family_member_id || null,
          payment_source: formData.payment_source || null,
        },
      });

      if (error) {
        console.error("Transaction error:", error);
        throw error;
      }

      toast.success("Transaction added successfully");
      setFormData({
        type: "expense",
        amount: "",
        currency: "INR",
        merchant: "",
        notes: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        category_id: "",
        family_member_id: "",
        payment_source: "",
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto animate-enter backdrop-blur-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Add Transaction
          </DialogTitle>
          <DialogDescription className="text-sm">
            Record a new transaction - income, expense, or savings
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Transaction Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value, category_id: "" })}>
                <SelectTrigger className="transition-all hover:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">💰 Income</SelectItem>
                  <SelectItem value="expense">💸 Expense</SelectItem>
                  <SelectItem value="savings">🏦 Savings</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.type === "income" ? "Money coming in" : formData.type === "savings" ? "Money saved" : "Money spent"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                 <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USDT">USDT (₮)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({getCurrencySymbol(formData.currency)})</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category {formData.type && `(${formData.type} categories)`}
              </Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger className="h-11 bg-background border-border transition-all hover:border-primary">
                  <SelectValue placeholder={`Select ${formData.type} category`} />
                </SelectTrigger>
                <SelectContent 
                  className="max-h-[60vh] overflow-y-auto bg-popover border-border z-[100]"
                  position="popper"
                  sideOffset={4}
                >
                  {displayCategories.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Loading categories...
                    </div>
                  ) : (
                    <div className="p-1">
                      {displayCategories.map((c) => (
                        <SelectItem 
                          key={c.id} 
                          value={c.id} 
                          className="cursor-pointer hover:bg-accent focus:bg-accent rounded-md my-0.5 h-10 flex items-center transition-all"
                        >
                          <span className="flex items-center gap-2">
                            {c.icon && <span className="text-lg">{c.icon}</span>}
                            <span className="text-base">{c.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </div>
                  )}
                </SelectContent>
              </Select>
              {formData.category_id === "" && (
                <p className="text-xs text-muted-foreground animate-fade-in">
                  💡 Tip: Choose a category that best matches this {formData.type}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member">Family Member (Optional)</Label>
              <Select value={formData.family_member_id} onValueChange={(value) => setFormData({ ...formData, family_member_id: value })}>
                <SelectTrigger className="h-11 bg-background border-border">
                  <SelectValue placeholder="Select family member (optional)" />
                </SelectTrigger>
                <SelectContent 
                  className="max-h-[40vh] overflow-y-auto bg-popover border-border"
                  position="popper"
                  sideOffset={4}
                >
                  {members.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No family members added yet
                    </div>
                  ) : (
                    <div className="p-1">
                      <SelectItem value="" className="cursor-pointer hover:bg-accent focus:bg-accent rounded-md my-0.5 h-10">
                        <span className="text-muted-foreground">None (Personal)</span>
                      </SelectItem>
                      {members.map((m) => (
                        <SelectItem 
                          key={m.id} 
                          value={m.id}
                          className="cursor-pointer hover:bg-accent focus:bg-accent rounded-md my-0.5 h-10"
                        >
                          {m.name}
                        </SelectItem>
                      ))}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="merchant" className="flex items-center gap-2">
                Merchant/Source (Optional)
                {loadingSuggestions && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
              </Label>
              <Input
                id="merchant"
                value={formData.merchant}
                onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                placeholder="e.g., Salary, Grocery Store"
                className="transition-all"
              />
              {aiSuggestions && formData.merchant === aiSuggestions.merchant && (
                <p className="text-xs text-primary animate-fade-in">✨ AI suggested based on your history</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_source">Payment Source (Optional)</Label>
              <Select value={formData.payment_source} onValueChange={(value) => setFormData({ ...formData, payment_source: value })}>
                <SelectTrigger className="h-11 bg-background border-border">
                  <SelectValue placeholder="Select payment source" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-[100]">
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="bank">🏦 Bank Account</SelectItem>
                  <SelectItem value="wallet">💳 Wallet</SelectItem>
                  <SelectItem value="binance">🔶 Binance</SelectItem>
                  <SelectItem value="paypal">💙 PayPal</SelectItem>
                  <SelectItem value="crypto_wallet">₿ Crypto Wallet</SelectItem>
                  <SelectItem value="cash">💵 Cash</SelectItem>
                  <SelectItem value="other">📦 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why this transaction? How was the money earned/spent?"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any other details..."
              className="min-h-[60px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
