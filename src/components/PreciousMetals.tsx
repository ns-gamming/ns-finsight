import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coins, Plus, TrendingUp, TrendingDown } from "lucide-react";

interface Metal {
  id: string;
  metal_type: string;
  quantity: number;
  purchase_price: number;
  current_price?: number;
  purchase_date: string;
  provider?: string;
  currency: string;
}

export const PreciousMetals = () => {
  const [metals, setMetals] = useState<Metal[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    metal_type: "gold",
    quantity: "",
    purchase_price: "",
    purchase_date: new Date().toISOString().split("T")[0],
    provider: "",
    currency: "INR",
  });

  useEffect(() => {
    loadMetals();
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchLivePrices = async () => {
    try {
      // Simulated live prices (in INR per gram)
      // In production, you would fetch from a real API
      const livePrices = {
        gold: 6200 + Math.random() * 100,
        silver: 75 + Math.random() * 5,
        platinum: 3500 + Math.random() * 50,
        digital_gold: 6200 + Math.random() * 100,
      };
      setPrices(livePrices);

      // Update current prices in database
      for (const metal of metals) {
        await supabase
          .from("precious_metals")
          .update({ current_price: livePrices[metal.metal_type as keyof typeof livePrices] })
          .eq("id", metal.id);
      }
    } catch (error) {
      console.error("Failed to fetch live prices:", error);
    }
  };

  const loadMetals = async () => {
    try {
      const { data, error } = await supabase
        .from("precious_metals")
        .select("*")
        .order("purchase_date", { ascending: false });

      if (error) throw error;
      setMetals(data || []);
    } catch (error: any) {
      toast.error("Failed to load precious metals");
    }
  };

  const addMetal = async () => {
    if (!formData.quantity || !formData.purchase_price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const currentPrice = prices[formData.metal_type] || parseFloat(formData.purchase_price);

      const { error } = await supabase.from("precious_metals").insert({
        user_id: user.id,
        metal_type: formData.metal_type,
        quantity: parseFloat(formData.quantity),
        purchase_price: parseFloat(formData.purchase_price),
        current_price: currentPrice,
        purchase_date: formData.purchase_date,
        provider: formData.provider || null,
        currency: formData.currency,
      });

      if (error) throw error;

      toast.success("Precious metal added successfully");
      setOpen(false);
      setFormData({
        metal_type: "gold",
        quantity: "",
        purchase_price: "",
        purchase_date: new Date().toISOString().split("T")[0],
        provider: "",
        currency: "INR",
      });
      loadMetals();
    } catch (error: any) {
      toast.error(error.message || "Failed to add precious metal");
    } finally {
      setLoading(false);
    }
  };

  const getMetalIcon = (type: string) => {
    return "🪙";
  };

  const calculatePnL = (metal: Metal) => {
    const currentPrice = prices[metal.metal_type] || metal.current_price || metal.purchase_price;
    const purchaseValue = metal.quantity * metal.purchase_price;
    const currentValue = metal.quantity * currentPrice;
    const pnl = currentValue - purchaseValue;
    const pnlPercent = (pnl / purchaseValue) * 100;
    return { pnl, pnlPercent, currentValue };
  };

  const totalValue = metals.reduce((sum, metal) => {
    const { currentValue } = calculatePnL(metal);
    return sum + currentValue;
  }, 0);

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Precious Metals</CardTitle>
              <CardDescription>Track gold, silver, and digital metals</CardDescription>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Metal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Add Precious Metal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metal_type">Metal Type</Label>
                  <Select value={formData.metal_type} onValueChange={(value) => setFormData({ ...formData, metal_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="digital_gold">Digital Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity (grams) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="10"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purchase_price">Price/gram *</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      placeholder="6000"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="purchase_date">Purchase Date</Label>
                    <Input
                      id="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="Bank, Platform, etc."
                  />
                </div>

                <Button onClick={addMetal} disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Metal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">Total Value (Live)</p>
          </div>
          <p className="text-2xl font-bold">₹{totalValue.toFixed(2)}</p>
        </div>

        <div className="space-y-3">
          {metals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No precious metals tracked yet. Add your first holding!</p>
          ) : (
            metals.map((metal) => {
              const { pnl, pnlPercent, currentValue } = calculatePnL(metal);
              const isProfit = pnl >= 0;

              return (
                <div key={metal.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMetalIcon(metal.metal_type)}</span>
                      <div>
                        <h4 className="font-semibold capitalize">{metal.metal_type.replace("_", " ")}</h4>
                        <p className="text-sm text-muted-foreground">{metal.quantity}g @ ₹{metal.purchase_price}/g</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{currentValue.toFixed(2)}</p>
                      <div className={`text-sm flex items-center gap-1 ${isProfit ? "text-success" : "text-destructive"}`}>
                        {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isProfit ? "+" : ""}₹{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  {prices[metal.metal_type] && (
                    <p className="text-xs text-muted-foreground">Live: ₹{prices[metal.metal_type].toFixed(2)}/g</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
