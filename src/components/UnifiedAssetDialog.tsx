import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Bitcoin, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UnifiedAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const UnifiedAssetDialog = ({ open, onOpenChange, onSuccess }: UnifiedAssetDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [assetType, setAssetType] = useState<"stock" | "crypto" | "precious_metal">("stock");

  // Stock form
  const [stockForm, setStockForm] = useState({
    symbol: "",
    name: "",
    quantity: "",
    purchase_price: "",
    exchange: "",
    currency: "USD"
  });

  // Crypto form
  const [cryptoForm, setCryptoForm] = useState({
    symbol: "",
    name: "",
    quantity: "",
    purchase_price: "",
    platform: "",
    currency: "USD",
    wallet_address: "",
    network: "",
    fee: "",
    tx_hash: "",
  });

  // Precious metal form
  const [metalForm, setMetalForm] = useState({
    metal_type: "gold",
    quantity: "",
    purchase_price: "",
    provider: "",
    currency: "INR",
    purchase_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (assetType === "stock") {
        const { error } = await supabase.from("stocks").insert({
          user_id: user.id,
          symbol: stockForm.symbol.toUpperCase(),
          name: stockForm.name,
          quantity: parseFloat(stockForm.quantity),
          purchase_price: parseFloat(stockForm.purchase_price),
          exchange: stockForm.exchange,
          currency: stockForm.currency,
          current_price: parseFloat(stockForm.purchase_price), // Initial price
        });
        if (error) throw error;
        toast.success("Stock added successfully! 📈");
      } else if (assetType === "crypto") {
        const metadata: any = {};
        if (cryptoForm.network) metadata.network = cryptoForm.network;
        if (cryptoForm.fee) metadata.fee = parseFloat(cryptoForm.fee);
        if (cryptoForm.tx_hash) metadata.tx_hash = cryptoForm.tx_hash;

        const { error } = await supabase.from("crypto").insert({
          user_id: user.id,
          symbol: cryptoForm.symbol.toUpperCase(),
          name: cryptoForm.name,
          quantity: parseFloat(cryptoForm.quantity),
          purchase_price: parseFloat(cryptoForm.purchase_price),
          platform: cryptoForm.platform || null,
          wallet_address: cryptoForm.wallet_address || null,
          currency: cryptoForm.currency,
          current_price: parseFloat(cryptoForm.purchase_price), // Initial price
        });
        if (error) throw error;
        toast.success("Crypto added successfully! 💰");
      } else {
        const { error } = await supabase.from("precious_metals").insert({
          user_id: user.id,
          metal_type: metalForm.metal_type,
          quantity: parseFloat(metalForm.quantity),
          purchase_price: parseFloat(metalForm.purchase_price),
          provider: metalForm.provider,
          currency: metalForm.currency,
          purchase_date: metalForm.purchase_date,
          current_price: parseFloat(metalForm.purchase_price), // Initial price
        });
        if (error) throw error;
        toast.success("Precious metal added successfully! ✨");
      }

      // Reset forms
      setStockForm({ symbol: "", name: "", quantity: "", purchase_price: "", exchange: "", currency: "USD" });
      setCryptoForm({ symbol: "", name: "", quantity: "", purchase_price: "", platform: "", currency: "USD", wallet_address: "", network: "", fee: "", tx_hash: "" });
      setMetalForm({ metal_type: "gold", quantity: "", purchase_price: "", provider: "", currency: "INR", purchase_date: new Date().toISOString().split('T')[0] });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
          <DialogDescription>
            Select type: Stock | Crypto | Digital Gold
          </DialogDescription>
        </DialogHeader>

        <Tabs value={assetType} onValueChange={(v) => setAssetType(v as typeof assetType)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stock" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Stock
            </TabsTrigger>
            <TabsTrigger value="crypto" className="gap-2">
              <Bitcoin className="w-4 h-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="precious_metal" className="gap-2">
              <Coins className="w-4 h-4" />
              Digital Gold
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="stock" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock-symbol">Symbol *</Label>
                  <Input
                    id="stock-symbol"
                    value={stockForm.symbol}
                    onChange={(e) => setStockForm({ ...stockForm, symbol: e.target.value })}
                    placeholder="AAPL"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock-name">Company Name *</Label>
                  <Input
                    id="stock-name"
                    value={stockForm.name}
                    onChange={(e) => setStockForm({ ...stockForm, name: e.target.value })}
                    placeholder="Apple Inc."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock-quantity">Quantity *</Label>
                  <Input
                    id="stock-quantity"
                    type="number"
                    step="0.01"
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock-price">Purchase Price *</Label>
                  <Input
                    id="stock-price"
                    type="number"
                    step="0.01"
                    value={stockForm.purchase_price}
                    onChange={(e) => setStockForm({ ...stockForm, purchase_price: e.target.value })}
                    placeholder="150.00"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock-exchange">Exchange</Label>
                  <Input
                    id="stock-exchange"
                    value={stockForm.exchange}
                    onChange={(e) => setStockForm({ ...stockForm, exchange: e.target.value })}
                    placeholder="NASDAQ"
                  />
                </div>
                <div>
                  <Label htmlFor="stock-currency">Currency</Label>
                  <Select value={stockForm.currency} onValueChange={(value) => setStockForm({ ...stockForm, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crypto-symbol">Symbol *</Label>
                  <Input
                    id="crypto-symbol"
                    value={cryptoForm.symbol}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, symbol: e.target.value })}
                    placeholder="BTC"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="crypto-name">Cryptocurrency Name *</Label>
                  <Input
                    id="crypto-name"
                    value={cryptoForm.name}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, name: e.target.value })}
                    placeholder="Bitcoin"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crypto-quantity">Quantity *</Label>
                  <Input
                    id="crypto-quantity"
                    type="number"
                    step="0.00000001"
                    value={cryptoForm.quantity}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, quantity: e.target.value })}
                    placeholder="0.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="crypto-price">Purchase Price *</Label>
                  <Input
                    id="crypto-price"
                    type="number"
                    step="0.01"
                    value={cryptoForm.purchase_price}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, purchase_price: e.target.value })}
                    placeholder="45000.00"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crypto-platform">Platform</Label>
                  <Select value={cryptoForm.platform} onValueChange={(value) => setCryptoForm({ ...cryptoForm, platform: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[100]">
                      <SelectItem value="binance">🔶 Binance</SelectItem>
                      <SelectItem value="paypal">💙 PayPal</SelectItem>
                      <SelectItem value="coinbase">💎 Coinbase</SelectItem>
                      <SelectItem value="kraken">🐙 Kraken</SelectItem>
                      <SelectItem value="wazirx">🇮🇳 WazirX</SelectItem>
                      <SelectItem value="other">📦 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="crypto-currency">Currency</Label>
                  <Select value={cryptoForm.currency} onValueChange={(value) => setCryptoForm({ ...cryptoForm, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[100]">
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="USDT">₮ USDT</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crypto-network">Network (Optional)</Label>
                  <Input
                    id="crypto-network"
                    value={cryptoForm.network}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, network: e.target.value })}
                    placeholder="e.g., ERC20, TRC20"
                  />
                </div>
                <div>
                  <Label htmlFor="crypto-fee">Transaction Fee (Optional)</Label>
                  <Input
                    id="crypto-fee"
                    type="number"
                    step="0.00000001"
                    value={cryptoForm.fee}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, fee: e.target.value })}
                    placeholder="0.001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crypto-wallet">Wallet Address (Optional)</Label>
                  <Input
                    id="crypto-wallet"
                    value={cryptoForm.wallet_address}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, wallet_address: e.target.value })}
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <Label htmlFor="crypto-tx">TX Hash (Optional)</Label>
                  <Input
                    id="crypto-tx"
                    value={cryptoForm.tx_hash}
                    onChange={(e) => setCryptoForm({ ...cryptoForm, tx_hash: e.target.value })}
                    placeholder="Transaction hash"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="precious_metal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metal-type">Metal Type *</Label>
                  <Select value={metalForm.metal_type} onValueChange={(value) => setMetalForm({ ...metalForm, metal_type: value })}>
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
                <div>
                  <Label htmlFor="metal-quantity">Quantity (grams) *</Label>
                  <Input
                    id="metal-quantity"
                    type="number"
                    step="0.001"
                    value={metalForm.quantity}
                    onChange={(e) => setMetalForm({ ...metalForm, quantity: e.target.value })}
                    placeholder="10.5"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metal-price">Purchase Price (per gram) *</Label>
                  <Input
                    id="metal-price"
                    type="number"
                    step="0.01"
                    value={metalForm.purchase_price}
                    onChange={(e) => setMetalForm({ ...metalForm, purchase_price: e.target.value })}
                    placeholder="5500.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="metal-date">Purchase Date *</Label>
                  <Input
                    id="metal-date"
                    type="date"
                    value={metalForm.purchase_date}
                    onChange={(e) => setMetalForm({ ...metalForm, purchase_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metal-provider">Provider</Label>
                  <Input
                    id="metal-provider"
                    value={metalForm.provider}
                    onChange={(e) => setMetalForm({ ...metalForm, provider: e.target.value })}
                    placeholder="MMTC-PAMP, Tanishq"
                  />
                </div>
                <div>
                  <Label htmlFor="metal-currency">Currency</Label>
                  <Select value={metalForm.currency} onValueChange={(value) => setMetalForm({ ...metalForm, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Adding..." : "Add Asset"}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
